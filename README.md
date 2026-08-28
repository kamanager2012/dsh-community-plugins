# dsh-community-plugins 已迁移

**真源已并入 [`dsh-community/packages/marketplace`](https://github.com/kamanager2012/dsh-community/tree/main/packages/marketplace)。** 目录文件是 [`catalog.json`](https://github.com/kamanager2012/dsh-community/blob/main/packages/marketplace/catalog.json)。

[English](README.en.md) | 简体中文

本仓库不再接受功能开发，GitHub 仓库已归档。兼容性目录、验证 CI 和安装入口都在产品仓里；安装仍调用官方 `dsh plugin add`。

根目录这份 `catalog.json` 只留给已经发布的客户端（它们仍从本仓 raw URL 拉目录）。新的改动请提交到 `dsh-community`。

## 怎么用

```sh
git clone https://github.com/kamanager2012/dsh-community
cd dsh-community
pnpm install
pnpm marketplace -- list
```

不要再给本仓库提收录 PR。

## 为什么还留着这个 GitHub 仓库

旧文档、书签和已发布 Desktop / CLI 使用的 raw.githubusercontent.com 地址需要一个不会 404 的 `catalog.json`。这里只做跳转，不是第二份注册表真源。
