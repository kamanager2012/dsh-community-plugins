# Plugin Registry and Verification Guide

[简体中文](registry-guide.md) · [Back to English README](../README.en.md) · [Online Handbook](https://kamanager2012.github.io/deepseek-harness-handbook/en/)

## What this repository owns

`dsh-community-plugins` is a public Compatibility Registry. It records where a plugin comes from, which version was tested against which official DSH Runtime line, and which status Marketplace should show.

It does not:

- execute an Agent or implement a Runtime;
- replace the official `dsh plugin add` install chain;
- treat an author README as security or compatibility proof;
- store user Sessions, credentials, or plugin runtime data.

## Entry shape

Entries in `catalog.json` should provide:

| Field | Requirement |
| --- | --- |
| `name` | Package name accepted by official `dsh plugin add <name>` |
| `description` | Short, checkable, non-inflated description |
| `author` | Author or organization |
| `repo` | Public source URL |
| `category` | `ui`, `tool`, `provider`, `workflow`, or `other` |
| `versions[].version` | Tested plugin version |
| `versions[].testedDsh` | Official Runtime line actually used |
| `versions[].notes` | Facts from install, composition, or runtime smoke tests |

`testedDsh` links evidence; it is not a promise of permanent compatibility. A version without a matching Runtime line must be shown as `[UNVERIFIED]`.

## Verification ladder

```text
existence
  → install
  → compose
  → runtime smoke
  → package digest
  → provenance
  → DSH compatibility matrix
```

Declare only the level that has evidence. Catalog size cannot replace verification depth; a reachable GitHub page or an author README is not a successful runtime test.

Recommended evidence for each entry:

- package and public repository still exist;
- official installation succeeds against the specified Runtime version;
- composition with the base profile does not break startup;
- a minimal runtime smoke test with command, exit code, and result;
- version, digest, or immutable commit;
- Runtime line and last verification date.

## Submission flow

1. Prepare public installation instructions and a minimal smoke test in the plugin repository;
2. Add an entry to `catalog.json` with consistent fields and naming;
3. Include the Runtime version, install command, and result in the Pull Request;
4. Let maintainers review the evidence without turning unknown fields into guarantees;
5. Marketplace reads the registry, while installation returns to official `dsh plugin add`.

## Status shown to users

| Status | Meaning | Safe handling |
| --- | --- | --- |
| `[VERIFIED]` | Runtime line and install/composition/runtime evidence exist | Users must still review plugin permissions |
| `[PARTIAL]` | Some evidence exists, such as install without runtime smoke coverage | Do not claim runtime compatibility |
| `[UNVERIFIED]` | No matching Runtime line or evidence is stale | Treat as unknown by default |
| `[INCOMPATIBLE]` | Known incompatibility with the current Runtime line | Do not recommend by default |

The registry describes compatibility evidence, not whether a plugin is trustworthy. For plugins that access the network, files, processes, credentials, or system mutation, read the source and permission notes separately.

## Ecosystem links

- [Canonical Product: dsh-community](https://github.com/kamanager2012/dsh-community)
- [Community Labs](https://github.com/kamanager2012/deepseek-harness-suite)
- [Marketplace install UX](https://github.com/kamanager2012/dsh-marketplace)
- [Handbook plugin section](https://kamanager2012.github.io/deepseek-harness-handbook/en/10-plugins/)
- [Official Runtime](https://github.com/deepseek-ai/deepseek-harness)
