# dsh-community-plugins

**社区插件兼容性注册表（Compatibility Registry）**

[English](README.en.md) | 简体中文

本仓库只维护官方 DeepSeek Harness 插件的公开目录、版本和验证信息。
它不是 Runtime、不是 Plugin Manager，也不是另一个发行版；安装仍尽量走官方
`dsh plugin add` 链路。浏览和安装体验由
[`dsh-marketplace`](https://github.com/kamanager2012/dsh-marketplace) 提供。

## 当前目录状态

当前验证线包含 **7 个第三方社区插件**，均按 `0.1.0-rc.6` 使用官方
`dsh plugin add` 安装并完成组合验证。目录中的社区自有包和参考项目另有标记，
不要把目录条目总数直接当成第三方生产兼容数量。

当前优先级不是把数量从 7 扩到 50，而是提高每个条目的证据深度：

```text
existence → install → compose → runtime smoke
         → package digest → provenance → DSH compatibility matrix
```

在这些证据补齐前，未匹配 Runtime 线的版本必须保持 `[UNVERIFIED]`。

## 在六仓生态中的位置

| 仓库 | 职责 | 入口 |
|---|---|---|
| [`dsh-community`](https://github.com/kamanager2012/dsh-community) | Canonical Product，唯一正式下载入口 | [Latest Release](https://github.com/kamanager2012/dsh-community/releases/latest) |
| [`deepseek-harness-suite`](https://github.com/kamanager2012/deepseek-harness-suite) | Community Labs，实验能力验证 | [Labs](https://github.com/kamanager2012/deepseek-harness-suite) |
| [`deepseek-harness-handbook`](https://github.com/kamanager2012/deepseek-harness-handbook) | 使用、验收和运维证据 | [在线手册](https://kamanager2012.github.io/deepseek-harness-handbook/) |
| `dsh-community-plugins` | 插件兼容性元数据 | 本仓库的 `catalog.json` |
| [`dsh-marketplace`](https://github.com/kamanager2012/dsh-marketplace) | 浏览、搜索和安装 UX | `dsh-marketplace` CLI |
| [`dsh-community-edition`](https://github.com/kamanager2012/dsh-community-edition) | Merge & Archive | [历史参考](https://github.com/kamanager2012/dsh-community-edition) |

## 文档入口

- [注册表与验证指南](docs/registry-guide.md)
- [English verification guide](docs/registry-guide.en.md)

## `catalog.json` 的职责

注册表中的每个插件都应说明：

| 字段 | 说明 |
|---|---|
| `name` | npm 包名，必须能被 `dsh plugin add <name>` 安装 |
| `description` | 简短、可验证的插件描述 |
| `author` | 作者或组织 |
| `repo` | 源码仓库 URL |
| `versions` | 已验证版本数组：`version`、`testedDsh`、可选 `notes` |
| `category` | `ui`、`tool`、`provider`、`workflow` 或 `other` |

`testedDsh` 表示官方 DSH Runtime 的实际验证线，例如 `0.1.0-rc.6`。
它不是“最新版本”承诺；客户端应对没有匹配验证线的版本标记为
`[UNVERIFIED]`，而不是默认为安全或兼容。

## 提交插件

1. 在 `catalog.json` 的 `plugins` 数组中增加一条记录，并保持名称排序；
2. 提交 Pull Request，让 CI 校验 JSON 结构和字段完整性；
3. 提供公开源码、可安装包和对应的 Runtime 验证线；
4. 合并后由 `dsh-marketplace` 读取目录，安装仍调用官方 `dsh plugin add`。

## 收录边界

- 只收录公开 registry 中可安装的 npm 包；
- 不把需要未声明私有凭据才能运行的插件写成无条件可用；
- 不用 README 或作者声明替代安装 smoke test 和版本证据；
- 不在本仓库实现 Runtime、插件安装器或新的 Session 真源。
