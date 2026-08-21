# dsh-community-plugins

**社区插件兼容性注册表（Compatibility Registry）**

[English](README.en.md) | 简体中文

本仓库只维护官方 DeepSeek Harness 插件的公开目录、版本和验证信息。
它不是 Runtime、不是 Plugin Manager，也不是另一个发行版；安装仍尽量走官方
`dsh plugin add` 链路。浏览和安装体验由
[`dsh-marketplace`](https://github.com/kamanager2012/dsh-marketplace) 提供。

## 当前目录状态

当前验证线包含 **9 个第三方社区插件**，均按 `0.1.1-rc.1` 使用官方
`dsh plugin add` 安装并完成组合验证（另有 1 个参考 TUI 条目）。不要把目录条目总数
直接当成第三方生产兼容数量。Canonical 产品的 Latest / 内核 pin / 五个端以
[`dsh-community/docs/current-release.json`](https://github.com/kamanager2012/dsh-community/blob/main/docs/current-release.json)
为准。`testedDsh` 现为 `0.1.1-rc.1`（compose 已过；重启后仍可用未单测）。

 > 2026-08-16 起移除了 `@dsh-community/tui` 条目：它尚未发布到公共 npm
 > registry，不符合「必须能 `dsh plugin add <name>` 安装」的收录原则。社区版终端
 > 本身随 `dsh-community` 发行，不属于本注册表。

正式产品的五个社区端由 [`dsh-community`](https://github.com/kamanager2012/dsh-community)
提供：WSL/Linux Terminal、Windows Desktop、macOS Desktop、Linux AppImage、Android（Labs）。官方 Web 是内核自带界面；
本注册表只记录插件兼容性，不发行这些端。

当前优先级不是把数量从 9 扩到 50，而是提高每个条目的证据深度：

```text
existence → install → compose → runtime smoke
         → package digest → provenance → DSH compatibility matrix
```

已自动化的验证（`scripts/verify.mjs` + `scripts/compose-check.mjs`，每次 push / PR / 每日调度执行）：

| 层级 | 检查 | 状态 |
|---|---|---|
| existence | `npm view <name>@<version>` 存在且版本一致 | ✅ CI |
| package digest | `npm dist.integrity` 与 catalog 记录一致 | ✅ CI |
| provenance | npm 发布证明存在时记入 catalog | ✅ CI |
| repo | 公开仓库 URL 可达（HTTP 200） | ✅ CI |
| shape | 字段、分类、`testedDsh` 官方 rc 线 | ✅ CI |
| install / compose | 官方 `dsh plugin add` + `--dump-config` 合成断言，每插件独立 DSH_HOME | ✅ CI |
| runtime smoke | 真实会话运行冒烟 | 人工验证，证据写入 `notes` |

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

`testedDsh` 表示官方 DSH Runtime 的实际验证线，例如 `0.1.1-rc.1`。
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
