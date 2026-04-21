# Configuration
This page explains all UPU-related configuration. It is a complete guide to the plugin data folder (usually `plugins/UniversalPluginUpdater`), so you can tune UPU to your needs.

## Overview
UPU configuration has two major parts: global (plugin) configuration and per-plugin update configuration. Each plugin has its own update config file named `<PluginId>.json` (where `<PluginId>` is the lowercase plugin name). There is also a global update config file `global.json`. UPU’s plugin config itself is a separate file named `config.yml`.

UPU stores plugin config in YAML and per-plugin update config in JSON. These are human-friendly, readable, and widely used formats for configuring software. Don’t worry—you don’t need to become a YAML/JSON expert to configure UPU. This is mentioned mainly in case you want to use scripts (for example Bash) to batch-create many UPU update config files.

A quick clarification on terms used in this documentation:
- If we say “configuration” without a prefix, it refers to UPU plugin configuration (`config.yml`).
- If we say “update configuration”, it refers to plugin update-check configs (`global.json` and `<PluginId>.json`).

Because these terms are easy to confuse, we make the distinction explicit here.

## Data Folder
All files required by UPU are stored in the UPU data folder. Its location depends on your server software, and is usually under the same directory level as plugin JAR files. Below are common paths (relative to server working directory), assuming defaults are unchanged:

- Bukkit/Paper: `plugins/UniversalPluginUpdater`
- BungeeCord/Waterfall: `plugins/UniversalPluginUpdater`
- Velocity: `plugins/universalpluginupdater`

## Plugin Configuration
Plugin configuration is stored in `config.yml`, with a structure like this:

```yaml
verbose: false
language: system

platform:
  name: null
  game-versions: null
  loaders: null

updater:
  strategy: native
  allow-upgrade-now: true
  filename: ${originName}
  proxy:
    uri: ~
    username: ~
    password: ~
  repository:
    check-mode: 1
    check-list:
      - DEFAULT_MODE_IS_BLACKLIST
  plugin-list:
    - DEFAULT_MODE_IS_BLACKLIST
  plugin-list-mode: 1
```

For detailed explanation of every option, see the [config.yml](./config.yml) page.

## Update Configuration
Update configuration has two categories:
- Global update configuration in `global.json`
- Per-plugin update configuration in `<PluginId>.json` files under the `channels` folder in the data directory

They differ in scope but share the same structure:

```json
{
  "selectedChannel": null,
  "channels": [
    {
      "type": "modrinth",
      "config": {
        "projectId": null,
        "featured": false
      }
    },
    {
      "type": "url",
      "config": {
        "url": null
      }
    },
    {
      "type": "github",
      "config": {
        "repository": null,
        "auth": null,
        "accept": "application/java-archive",
        "filter": null
      }
    },
    {
      "type": "hangar",
      "config": {
        "author": null,
        "slugOrId": null,
        "channel": null,
        "platform": null
      }
    },
    {
      "type": "spigotmc",
      "config": {
        "resource": null,
        "proxy-download": false
      }
    }
  ]
}
```

For detailed explanation of all options, see [global.json / \<PluginId\>.json](./channel.json).
