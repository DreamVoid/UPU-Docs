---
aside: false
---
# 命令

UPU 支持各种命令，用来控制插件自身和更新检查行为。

您可以通过不同的方式发送命令：

- 通过服务端控制台
- 通过具有 `universalpluginupdater.command` 权限的玩家

不过，我们建议您始终使用控制台发送命令，因为有些重要信息只会向控制台以日志形式发送。同时，我们建议您谨慎向玩家授予 `universalpluginupdater.command` 权限，具有此权限的玩家可以控制 UPU 何时升级插件，在 UPU 只有收到命令才会执行升级操作下，这一点尤其危险。

## 命令


| 命令 | 权限 | 描述 |
| ---- | ---- | ---- |
| `upu update` | `universal.command.update` | 更新可用插件列表 |
| `upu list [--upgradable]` | `universal.command.list` | 列出可用插件<br>提供 `--upgradable` 参数将仅列出可升级的插件 |
| `upu download [插件ID...]` | `universal.command.download` | 通过 下载 来下载现有插件的更新版本<br>提供若干插件 ID 作为参数将仅下载这些插件 |
| `upu upgrade [--now\|插件ID...]` | `universal.command.upgrade` | 通过 下载/安装 来升级现有插件到更新版本<br>提供若干插件 ID 作为参数将仅升级这些插件<br>提供 `--now` 参数将指示 UPU 立刻执行升级操作 |
| `upu repo update` | `universal.command.repo` | 从远程仓库中检查更新配置 |
| `upu repo list [--available\|--updatable]` | `universal.command.repo` | 查看可用更新配置列表<br>提供 `--available` 参数将列出所有可下载的更新配置<br>提供 `--updatable` 参数将列出本地存在但不是最新的更新配置 |
| `upu repo get <all\|插件ID...>` | `universal.command.repo` | 获取并保存远程更新配置<br>提供 `all` 参数将获取所有可用更新配置<br>提供若干插件 ID 将仅获取这些插件的更新配置 |

## 备注

所有的命令都不区分大小写，但它们的参数通常是区分大小写的。

上文出现的命令都不包含前导 `/` 符号，如果您以玩家身份执行命令，则需要在命令前添加这个符号，服务端才会将您发送的文本识别为命令。

参数遵循 UNIX 哲学，方括号包围的选项 `[Optional]` 表示这个参数是可选的，尖括号包围的选项 `<Mandatory>` 表示这个参数是必须的，如果有多个可使用的已知参数，以竖线 `|` 分隔。执行命令时，您应该用实际要操作的值替换所需的参数，例如 `[all]` 或 `<--updatable>`，同时省略括号，并用空格分隔多个参数。

命令的权限定义了需要执行此命令所需的最低权限，控制台通常具有所有权限，而某些服务端则要求您明确授予玩家权限。

UPU 使用服务端提供的方式来解析命令参数。这意味着除了空格之外，您还可使用您服务端支持的方式来分隔参数（如制表符和换行符）。