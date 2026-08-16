# dsh-community-plugins

**Community plugin compatibility registry for DeepSeek Harness.**

[简体中文](README.md) | **English**

This repository maintains public plugin metadata, tested versions, and compatibility
evidence for the official DeepSeek Harness ecosystem. It is not a Runtime, a Plugin
Manager, or another distribution. Installation should remain on the official
`dsh plugin add` chain; [`dsh-marketplace`](https://github.com/kamanager2012/dsh-marketplace)
provides browse, search, and install UX.

## Current catalog status

The current validation set contains **7 third-party community plugins**. They were
installed through the official `dsh plugin add` path and compose-tested against the
`0.1.0-rc.6` line. The catalog also contains community-owned and reference entries;
do not treat the raw entry count as the number of third-party production-compatible plugins.

The priority is evidence depth, not growing from 7 to 50 entries:

```text
existence → install → compose → runtime smoke
         → package digest → provenance → DSH compatibility matrix
```

Until those checks exist, versions without a matching Runtime line remain `[UNVERIFIED]`.

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
`0.1.0-rc.6`. It is not a promise to track the newest Runtime. Consumers should
mark an entry `[UNVERIFIED]` when no tested line matches their Runtime instead of
assuming compatibility or safety.

## Submit a plugin

1. Add an entry to the alphabetized `plugins` array in `catalog.json`.
2. Open a Pull Request so CI can validate JSON shape and required fields.
3. Provide a public source repository, an installable package, and the tested Runtime line.
4. After merge, `dsh-marketplace` can read the catalog; installation still calls the official `dsh plugin add` command.

## Registry boundaries

- Include only packages that can be installed from a public registry.
- State private credential requirements instead of implying unconditional availability.
- Do not replace installation smoke tests and version evidence with README claims.
- Do not implement a Runtime, installer, or second Session source of truth here.

See the [DeepSeek Harness Handbook](https://kamanager2012.github.io/deepseek-harness-handbook/)
for the operational and security guidance behind these boundaries.
