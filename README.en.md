# dsh-community-plugins

**Community plugin compatibility registry for DeepSeek Harness.**

[简体中文](README.md) | **English**

This repository maintains public plugin metadata, tested versions, and compatibility
evidence for the official DeepSeek Harness ecosystem. It is not a Runtime, a Plugin
Manager, or another distribution. Installation should remain on the official
`dsh plugin add` chain; [`dsh-marketplace`](https://github.com/kamanager2012/dsh-marketplace)
provides browse, search, and install UX.

## Current catalog status

The catalog contains **9 entries in total = 8 third-party community plugins + 1 reference TUI entry**. The
third-party plugins were installed through the official `dsh plugin add` path and compose-tested against the
`0.1.1-rc.1` line.
Do not treat the raw entry count as the number of third-party production-compatible plugins.
Canonical Latest / kernel pin / five endpoints live in
[`dsh-community/docs/current-release.json`](https://github.com/kamanager2012/dsh-community/blob/main/docs/current-release.json).
`testedDsh` is `0.1.1-rc.1` (compose passed; restart-after-install is still unverified).

The priority is evidence depth, not growing from 9 to 50 entries:

```text
existence → install → compose → runtime smoke
         → package digest → provenance → DSH compatibility matrix
```

Until those checks exist, versions without a matching Runtime line remain `[UNVERIFIED]`.

The five Community endpoints are shipped by
[`dsh-community`](https://github.com/kamanager2012/dsh-community): WSL/Linux Terminal,
Windows Desktop, macOS Desktop, Linux AppImage, and Android (Labs). Official Web is
the kernel's own UI; this registry records plugin compatibility and
does not distribute those endpoints.

The automated verification ladder currently covers:

| Level | Check | Status |
|---|---|---|
| existence | `npm view <name>@<version>` exists at the declared version | ✅ CI |
| package digest | npm `dist.integrity` matches the catalog | ✅ CI |
| provenance | npm publication provenance is recorded when present | ✅ CI |
| repo | public repository URL is reachable | ✅ CI |
| shape | schema, category, and official `testedDsh` line | ✅ CI |
| install / compose | official `dsh plugin add` plus `--dump-config`, isolated `DSH_HOME` per plugin | ✅ CI |
| runtime smoke | real-session smoke test | Manual; record evidence in `notes` |

## Position in the ecosystem

| Repository | Role | Entry |
|---|---|---|
| [`dsh-community`](https://github.com/kamanager2012/dsh-community) | Canonical Product and only normal download entry | [Latest release](https://github.com/kamanager2012/dsh-community/releases/latest) |
| [`deepseek-harness-suite`](https://github.com/kamanager2012/deepseek-harness-suite) | Community Labs for experimental validation | [Labs](https://github.com/kamanager2012/deepseek-harness-suite) |
| [`deepseek-harness-handbook`](https://github.com/kamanager2012/deepseek-harness-handbook) | Knowledge, evidence, and operations | [Online handbook](https://kamanager2012.github.io/deepseek-harness-handbook/) |
| `dsh-community-plugins` | Plugin metadata and compatibility status | `catalog.json` in this repository |
| [`dsh-marketplace`](https://github.com/kamanager2012/dsh-marketplace) | Discovery and distribution UX | `dsh-marketplace` CLI |
| [`dsh-community-edition`](https://github.com/kamanager2012/dsh-community-edition) | Merge & Archive | [Historical reference](https://github.com/kamanager2012/dsh-community-edition) |

## Catalog schema

Every plugin entry should identify:

| Field | Meaning |
|---|---|
| `name` | npm package name; it must install through `dsh plugin add <name>` |
| `description` | Short, verifiable description |
| `author` | Author or organization |
| `repo` | Source repository URL |
| `versions` | Tested versions with `version`, `testedDsh`, and optional `notes` |
| `category` | `ui`, `tool`, `provider`, `workflow`, or `other` |

`testedDsh` records the official Runtime line actually tested, for example
`0.1.1-rc.1`. It is not a promise to track the newest Runtime. Consumers should
mark an entry `[UNVERIFIED]` when no tested line matches their Runtime instead of
assuming compatibility or safety.

## Documentation

- [Registry and verification guide](docs/registry-guide.en.md)
- [中文验证指南](docs/registry-guide.md)

## Submit a plugin

1. Add an entry to the alphabetized `plugins` array in `catalog.json`.
2. Open a Pull Request so CI can verify shape, npm existence, version, `dist.integrity`, and repo reachability.
3. Provide a public source repository, an installable package, and the tested Runtime line.
4. After merge, `dsh-marketplace` can read the catalog; installation still calls the official `dsh plugin add` command.

Every catalog entry is also checked by the `compose-catalog` workflow: the official `dsh plugin add` install plus a `--dump-config` composition assertion per version, in an isolated `DSH_HOME`.

## Registry boundaries

- Include only packages that can be installed from a public registry.
- State private credential requirements instead of implying unconditional availability.
- Do not replace installation smoke tests and version evidence with README claims.
- Do not implement a Runtime, installer, or second Session source of truth here.

See the [DeepSeek Harness Handbook](https://kamanager2012.github.io/deepseek-harness-handbook/)
for the operational and security guidance behind these boundaries.
