---
aside: false
---
# Commands

UPU provides various commands to control the plugin itself and update-check behavior.

You can send commands in different ways:

- Through the server console
- Through players who have the `universalpluginupdater.command` permission

However, we recommend always using the console, because some important details are only output there as logs. We also recommend granting `universalpluginupdater.command` to players with caution. Players with this permission can control when UPU upgrades plugins, which is especially risky when upgrades are executed only after receiving commands.

## Command List

| Command | Permission | Description |
| ---- | ---- | ---- |
| `upu update` | `universal.command.update` | Refresh available plugin update list |
| `upu list [--upgradable]` | `universal.command.list` | List available plugins<br>Use `--upgradable` to list only upgradable plugins |
| `upu download [pluginId...]` | `universal.command.download` | Download newer versions of existing plugins<br>Provide plugin IDs to download only those plugins |
| `upu upgrade [--now\|pluginId...]` | `universal.command.upgrade` | Upgrade existing plugins by downloading/installing newer versions<br>Provide plugin IDs to upgrade only those plugins<br>Use `--now` to tell UPU to execute upgrade immediately |
| `upu repo update` | `universal.command.repo` | Check update configs from remote repositories |
| `upu repo list [--available\|--updatable]` | `universal.command.repo` | View available update config list<br>Use `--available` to list all downloadable configs<br>Use `--updatable` to list local configs that are not up to date |
| `upu repo get <all\|pluginId...>` | `universal.command.repo` | Fetch and save remote update configs<br>Use `all` to fetch all available configs<br>Provide plugin IDs to fetch only those plugins |

## Notes

All commands are case-insensitive, but their arguments are usually case-sensitive.

The commands shown above do not include the leading `/`. If you execute them as a player, prepend `/` so the server recognizes the input as a command.

Arguments follow UNIX-style conventions: options in square brackets `[Optional]` are optional; options in angle brackets `<Mandatory>` are required. If multiple known values are possible, they are separated by `|`. When executing commands, replace placeholders with actual values (for example `all` or `--updatable`), omit the brackets, and separate multiple arguments with spaces.

Permission nodes define the minimum permission required to execute a command. The console usually has all permissions, while some server platforms require explicit permission assignment for players.

UPU uses your server platform’s command-argument parser. This means you may use separators supported by your platform besides spaces (such as tabs or newlines).
