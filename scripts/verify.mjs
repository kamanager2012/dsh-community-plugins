/**
 * Registry verification: every entry must be verifiable against npm and the
 * public repo. Shape checks plus supply-chain facts:
 *
 *   1. catalog shape (schema-level, incl. name/version/repo format gates)
 *   2. npm existence of name@version
 *   3. npm dist.integrity matches the recorded digest (fail-closed)
 *   4. repo URL resolves (HTTP 2xx/3xx)
 *   5. testedDsh is a known official rc line
 *
 * Usage: node scripts/verify.mjs [--write-integrity]
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const OFFICIAL_RC_LINES = ['0.1.0-rc.6', '0.1.1-rc.1']
const WRITE = process.argv.includes('--write-integrity')

const NPM_NAME_RE = /^(@[a-z0-9-][a-z0-9-._]*\/)?[a-z0-9-][a-z0-9-._]*$/
const SEMVER_RE = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/
const REPO_URL_RE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/

const CATALOG_PATH = fileURLToPath(new URL('../catalog.json', import.meta.url))

/** Result of an npm view call; 'error' means transport/registry trouble, not a missing package. */
function npmView(packageSpec, field) {
  try {
    const out = execFileSync('npm', ['view', packageSpec, field, '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60_000,
    }).trim()
    return { status: 'ok', value: out === '' ? undefined : JSON.parse(out) }
  } catch (error) {
    const stderr = String(error?.stderr ?? '')
    if (stderr.includes('E404')) return { status: 'missing' }
    return { status: 'error', value: stderr.split('\n').find(l => l.includes('E')) ?? 'npm view failed' }
  }
}

function httpStatus(url) {
  if (!/^https?:\/\//.test(url)) return undefined
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const out = execFileSync('curl', ['-sSL', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', url], {
        encoding: 'utf8',
        timeout: 30_000,
      }).trim()
      const status = Number(out)
      if (Number.isInteger(status) && status > 0) return status
    } catch {
      // transient TLS/DNS failure: retry once before reporting unreachable
    }
  }
  return undefined
}

const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'))
const problems = []
let changed = false

if (typeof catalog.version !== 'number') problems.push('catalog.version missing')
if (!Array.isArray(catalog.plugins)) problems.push('catalog.plugins missing')

const names = new Set()
for (const plugin of catalog.plugins ?? []) {
  for (const field of ['name', 'description', 'author', 'repo', 'category']) {
    if (typeof plugin[field] !== 'string' || plugin[field] === '') {
      problems.push(`${plugin.name ?? '?'}.${field} missing`)
    }
  }
  // Format gates BEFORE any value reaches a child-process argv.
  if (typeof plugin.name === 'string' && !NPM_NAME_RE.test(plugin.name)) {
    problems.push(`${plugin.name}: not a valid npm package name`)
  }
  if (typeof plugin.repo === 'string' && !REPO_URL_RE.test(plugin.repo)) {
    problems.push(`${plugin.name}: repo must be an https://github.com/<owner>/<repo> URL`)
  }
  if (names.has(plugin.name)) problems.push(`duplicate plugin: ${plugin.name}`)
  names.add(plugin.name)
  if (!['ui', 'tool', 'provider', 'workflow', 'other'].includes(plugin.category)) {
    problems.push(`${plugin.name}: bad category`)
  }
  if (!Array.isArray(plugin.versions) || plugin.versions.length === 0) {
    problems.push(`${plugin.name}: versions missing`)
  }
  let shapeBroken = false
  for (const version of plugin.versions ?? []) {
    if (typeof version.version !== 'string' || typeof version.testedDsh !== 'string'
      || !SEMVER_RE.test(version.version)) {
      problems.push(`${plugin.name}: bad version entry`)
      shapeBroken = true
      continue
    }
    if (!OFFICIAL_RC_LINES.includes(version.testedDsh)) {
      problems.push(`${plugin.name}@${version.version}: testedDsh ${version.testedDsh} not in ${OFFICIAL_RC_LINES.join(', ')}`)
    }
    if (shapeBroken) continue
    const spec = `${plugin.name}@${version.version}`
    const exists = npmView(spec, 'version')
    if (exists.status !== 'ok') {
      const reason = exists.status === 'missing' ? 'not on the public npm registry' : `npm unreachable (${exists.value})`
      problems.push(`${spec}: ${reason}`)
      continue
    }
    if (String(exists.value).replace(/^v/, '') !== version.version) {
      problems.push(`${spec}: npm resolves ${String(exists.value)}, catalog says ${version.version}`)
    }
    const integrity = npmView(spec, 'dist.integrity')
    if (integrity.status === 'error') {
      // Fail-closed: never skip digest verification because of a transient failure.
      problems.push(`${spec}: npm dist.integrity unavailable (${integrity.value}); refusing to pass without verification`)
    } else if (integrity.status === 'missing' || typeof integrity.value !== 'string' || integrity.value === '') {
      problems.push(`${spec}: npm returned no dist.integrity; refusing to pass without verification`)
    } else if (version.integrity === undefined) {
      if (WRITE) {
        version.integrity = integrity.value
        changed = true
      } else {
        problems.push(`${spec}: npm integrity missing in catalog (rerun with --write-integrity)`)
      }
    } else if (version.integrity !== integrity.value) {
      problems.push(`${spec}: integrity mismatch (catalog vs npm)`)
    }
    const provenance = npmView(spec, 'provenance.predicateType')
    if (provenance.status === 'error') {
      process.stdout.write(`WARN ${spec}: provenance check skipped (npm unreachable)\n`)
    } else if (provenance.status === 'ok' && provenance.value !== undefined) {
      if (version.provenance !== true) {
        if (WRITE) {
          version.provenance = true
          changed = true
        } else {
          problems.push(`${spec}: npm provenance missing in catalog (rerun with --write-integrity)`)
        }
      }
    } else if (version.provenance === true) {
      problems.push(`${spec}: catalog claims provenance but npm has none`)
    }
  }
  const status = httpStatus(plugin.repo)
  if (status === undefined || status < 200 || status >= 400) {
    problems.push(`${plugin.name}: repo not reachable (${String(status)})`)
  }
}

if (changed) {
  writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`)
  process.stdout.write('catalog.json updated with npm dist.integrity\n')
}

if (problems.length > 0) {
  for (const problem of problems) process.stderr.write(`FAIL ${problem}\n`)
  process.exit(1)
}
process.stdout.write(`registry OK: ${String(catalog.plugins?.length)} plugins verified (shape + npm + integrity + repo)\n`)
