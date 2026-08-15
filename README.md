# DSH 社区发行版(重制版)· 市场注册表

> DSH 社区发行版 = 官方 DeepSeek Harness 的第三方重构发行。这里是发行版的市场组件注册表。

官方 DeepSeek Harness 的社区插件目录。客户端是 [dsh-marketplace](https://github.com/kamanager2012/dsh-marketplace)
(`dsh-marketplace list/search/info/install`)。

## 提交插件

1. 在 `catalog.json` 的 `plugins` 数组里加一条记录(按字母序)
2. 开 PR;CI 会校验 JSON 格式与字段完整性
3. 合并后,客户端拉取本仓库的 `catalog.json` 即可看到

## 字段说明

| 字段 | 说明 |
|---|---|
| `name` | npm 包名(必须能 `dsh plugin add <name>` 安装) |
| `description` | 一句话中文描述 |
| `author` | 作者/组织 |
| `repo` | 源码仓库 URL |
| `versions` | 已验证版本数组:`{ "version": "x.y.z", "testedDsh": "0.1.0-rc.6", "notes": "..." }` |
| `category` | `ui` / `tool` / `provider` / `workflow` / `other` |

`testedDsh` 必须与 [dsh-community 契约](https://github.com/kamanager2012/dsh-community/tree/main/contracts)
里的验证线一致;客户端对未标记版本的插件只显示"(未验证)"。

## 收录原则

- 只收录可公开安装的 npm 包(公开 registry)
- 不收录需要私有凭据才能运行的插件
- 插件必须声明它验证过的官方 DSH 版本线(rc 号)
