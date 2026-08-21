/**
 * Compose check: for every catalog entry, run the OFFICIAL install chain in a
 * fresh DSH_HOME and assert the plugin composes as a profile layer.
 *
 *   dsh plugin --profile test add <name>@<version>
 *   dsh --profile test --dump-config   → must list the plugin
 *
 * Uses the catalog `testedDsh` unless `DSH_COMPOSE_RUNTIME` is set.
 * `DSH_COMPOSE_BIN` skips `npx` and runs a local official `dsh` of that same
 * runtime (needed when `npx` OOMs unpacking the kernel).
 */

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const catalog = JSON.parse(readFileSync('catalog.json', 'utf8'))
const failures = []

function run(args, env, timeoutMs = 180_000) {
  const bin = process.env.DSH_COMPOSE_BIN?.trim()
  if (bin) {
    return execFileSync(bin, args, {
      encoding: 'utf8',
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: timeoutMs,
    })
  }
  return execFileSync('npx', ['-y', ...args], {
    encoding: 'utf8',
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: timeoutMs,
  })
}

async function checkPlugin(plugin) {
  const home = mkdtempSync(join(tmpdir(), 'dsh-compose-'))
  const env = { ...process.env, DSH_HOME: home, CI: 'true' }
  try {
    for (const version of plugin.versions) {
      const spec = `${plugin.name}@${version.version}`
      const runtime = process.env.DSH_COMPOSE_RUNTIME?.trim() || version.testedDsh
      const prefix = process.env.DSH_COMPOSE_BIN?.trim() ? [] : [`@deepseek-ai/dsh@${runtime}`]
      try {
        run([...prefix, 'plugin', '--profile', 'test', 'add', spec], env)
      } catch (error) {
        failures.push(`${spec}: install failed\n${String(error.stdout ?? '')}${String(error.stderr ?? '')}`)
        continue
      }
      let dump
      try {
        dump = run([...prefix, '--profile', 'test', '--dump-config'], env, 120_000)
      } catch (error) {
        failures.push(`${spec}: dump-config failed\n${String(error.stdout ?? '')}${String(error.stderr ?? '')}`)
        continue
      }
      if (!dump.includes(plugin.name)) {
        failures.push(`${spec}: installed but not listed in the composed profile`)
      } else {
        process.stdout.write(`OK  ${spec} composes on ${runtime}\n`)
      }
    }
  } finally {
    rmSync(home, { recursive: true, force: true })
  }
}

const plugins = catalog.plugins ?? []
for (const plugin of plugins) {
  await checkPlugin(plugin)
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`FAIL ${failure}\n`)
  process.exit(1)
}
process.stdout.write(`compose OK: ${String(plugins.length)} plugins on the official install chain\n`)
