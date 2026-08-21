/**
 * Registry verification: every entry must be verifiable against npm and the
 * public repo. Shape checks plus supply-chain facts:
 *
 *   1. catalog shape (schema-level)
 *   2. npm existence of name@version
 *   3. npm dist.integrity matches the recorded digest
 *   4. repo URL resolves (HTTP 200)
 *   5. testedDsh is a known official rc line
 *
 * Usage: node scripts/verify.mjs [--write-integrity]
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const OFFICIAL_RC_LINES = ['0.1.0-rc.6', '0.1.1-rc.1']
const WRITE = process.argv.includes('--write-integrity')

function npmView(packageSpec, field) {
  try {
    const out = execFileSync('npm', ['view', packageSpec, field, '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 60_000,
    }).trim()
    return out === '' ? undefined : JSON.parse(out)
  } catch {
    return undefined
  }
}

function httpStatus(url) {
  try {
    const out = execFileSync('curl', ['-sL', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', url], {
      encoding: 'utf8',
      timeout: 30_000,
    }).trim()
    return Number(out)
  } catch {
    return undefined
  }
}

const catalog = JSON.parse(readFileSync('catalog.json', 'utf8'))
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
  if (names.has(plugin.name)) problems.push(`duplicate plugin: ${plugin.name}`)
  names.add(plugin.name)
  if (!['ui', 'tool', 'provider', 'workflow', 'other'].includes(plugin.category)) {
    problems.push(`${plugin.name}: bad category`)
  }
  if (!Array.isArray(plugin.versions) || plugin.versions.length === 0) {
    problems.push(`${plugin.name}: versions missing`)
  }
  for (const version of plugin.versions ?? []) {
    if (typeof version.version !== 'string' || typeof version.testedDsh !== 'string') {
      problems.push(`${plugin.name}: bad version entry`)
      continue
    }
    if (!OFFICIAL_RC_LINES.includes(version.testedDsh)) {
      problems.push(`${plugin.name}@${version.version}: testedDsh ${version.testedDsh} not in ${OFFICIAL_RC_LINES.join(', ')}`)
    }
    const spec = `${plugin.name}@${version.version}`
    const exists = npmView(spec, 'version')
    if (exists === undefined) {
      problems.push(`${spec}: not on the public npm registry`)
      continue
    }
    if (String(exists).replace(/^v/, '') !== version.version) {
      problems.push(`${spec}: npm resolves ${String(exists)}, catalog says ${version.version}`)
    }
    const integrity = npmView(spec, 'dist.integrity')
    if (typeof integrity === 'string' && integrity !== '') {
      if (version.integrity === undefined) {
        if (WRITE) {
          version.integrity = integrity
          changed = true
        } else {
          problems.push(`${spec}: npm integrity missing in catalog (rerun with --write-integrity)`)
        }
      } else if (version.integrity !== integrity) {
        problems.push(`${spec}: integrity mismatch (catalog vs npm)`)
      }
    }
    const provenance = npmView(spec, 'provenance.predicateType')
    if (provenance !== undefined) {
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
  if (status === undefined || status >= 400) {
    problems.push(`${plugin.name}: repo not reachable (${String(status)})`)
  }
}

if (changed) {
  writeFileSync('catalog.json', `${JSON.stringify(catalog, null, 2)}\n`)
  process.stdout.write('catalog.json updated with npm dist.integrity\n')
}

if (problems.length > 0) {
  for (const problem of problems) process.stderr.write(`FAIL ${problem}\n`)
  process.exit(1)
}
process.stdout.write(`registry OK: ${String(catalog.plugins?.length)} plugins verified (shape + npm + integrity + repo)\n`)
