# dsh-community-plugins has moved

**Source of truth is now [`dsh-community/packages/marketplace`](https://github.com/kamanager2012/dsh-community/tree/main/packages/marketplace).** The catalog file is [`catalog.json`](https://github.com/kamanager2012/dsh-community/blob/main/packages/marketplace/catalog.json).

[简体中文](README.md) | **English**

This repository is archived. Compatibility catalog, verification CI, and the install entry live in the product repo. Installation still calls official `dsh plugin add`.

The `catalog.json` at the root of this repo remains only so already-shipped clients can keep fetching the old raw GitHub URL. New catalog changes belong in `dsh-community`.

## How to run it

```sh
git clone https://github.com/kamanager2012/dsh-community
cd dsh-community
pnpm install
pnpm marketplace -- list
```

Do not open catalog PRs against this repository.

## Why this GitHub repo still exists

Old docs, bookmarks, and published Desktop / CLI builds fetch `catalog.json` from this raw URL. That address must not 404. This is a redirect, not a second registry.
