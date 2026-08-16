# 插件注册表与验证指南

[English](registry-guide.en.md) · [返回中文 README](../README.md) · [在线 Handbook](https://kamanager2012.github.io/deepseek-harness-handbook/)

## 这个仓库负责什么

`dsh-community-plugins` 是公开的 Compatibility Registry。它记录插件从哪里来、哪个版本被哪个官方 DSH Runtime 验证过，以及用户在 Marketplace 中应该看到什么状态。

它不负责：

- 执行 Agent 或实现 Runtime；
- 替代官方 `dsh plugin add` 安装链；
- 把作者 README 当成安全或兼容性证明；
- 保存用户 Session、凭据或插件运行数据。

## 条目结构

`catalog.json` 中的条目至少应提供：

| 字段 | 要求 |
| --- | --- |
| `name` | 可由官方 `dsh plugin add <name>` 解析的包名 |
| `description` | 简短、可核对、不夸大结果的描述 |
| `author` | 作者或组织 |
| `repo` | 公开源码 URL |
| `category` | `ui`、`tool`、`provider`、`workflow` 或 `other` |
| `versions[].version` | 被验证的插件版本 |
| `versions[].testedDsh` | 实际使用的官方 Runtime 版本线 |
| `versions[].notes` | 安装、组合或运行 smoke test 的事实说明 |

`testedDsh` 是证据关联，不是“永远兼容”承诺。没有匹配当前 Runtime 的版本必须显示 `[UNVERIFIED]`。

## 验证阶梯

```text
existence
  → install
  → compose
  → runtime smoke
  → package digest
  → provenance
  → DSH compatibility matrix
```

当前只做到某一级，就只声明到某一级。目录数量不能替代验证深度；尤其不能把“能访问 GitHub”或“README 写了支持”写成运行成功。

建议每个条目保留以下证据：

- 包名和公开仓库仍然存在；
- 使用指定 Runtime 版本完成官方安装；
- 与基础 profile 组合时没有破坏启动；
- 最小运行 smoke test 的命令、退出码和结果；
- 版本、digest 或 immutable commit；
- 所属 Runtime 线和最后核验日期。

## 提交流程

1. 先在插件自己的仓库准备公开安装说明和最小 smoke test；
2. 在 `catalog.json` 增加记录，保持字段和名称格式一致；
3. 在 Pull Request 中附上 Runtime 版本、安装命令和结果；
4. 维护者复核目录内容，不把未验证字段写成保证；
5. Marketplace 读取注册表，安装仍回到官方 `dsh plugin add`。

## 用户看到的状态

| 状态 | 含义 | 安全处理 |
| --- | --- | --- |
| `[VERIFIED]` | 有指定 Runtime 线和相应安装/组合/运行证据 | 仍需用户审查插件权限 |
| `[PARTIAL]` | 只有部分证据，例如安装成功但没有运行 smoke test | 不宣称运行兼容 |
| `[UNVERIFIED]` | 没有匹配 Runtime 线或证据过期 | 默认按未知来源处理 |
| `[INCOMPATIBLE]` | 已知与当前 Runtime 线不兼容 | 不进入默认安装建议 |

注册表只描述兼容性证据，不替用户判断插件是否值得信任。涉及网络、文件、进程、凭据或系统修改的插件，必须单独阅读源码和权限说明。

## 生态跳转

- [Canonical Product：dsh-community](https://github.com/kamanager2012/dsh-community)
- [Community Labs](https://github.com/kamanager2012/deepseek-harness-suite)
- [Marketplace 安装体验](https://github.com/kamanager2012/dsh-marketplace)
- [Handbook 插件章节](https://kamanager2012.github.io/deepseek-harness-handbook/content/10-plugins/)
- [官方 Runtime](https://github.com/deepseek-ai/deepseek-harness)
