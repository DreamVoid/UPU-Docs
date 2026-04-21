# 配置
此页面专门用于说明 UPU 的相关配置。 它是一份关于插件数据文件夹（通常是 `plugins/UniversalPluginUpdater`）的完整文档，让您能够根据自己的需求调整 UPU。

## 简介
UPU 的配置分为两个主要的部分——全局（插件）配置和每个其他插件的更新配置。每个插件都有自己的名为 `<PluginId>.json` 的更新配置文件（其中 `<PluginId>` 是插件的小写名称），另外还有一个全局性的 `global.json` 更新配置文件，而 UPU 的插件配置是一个单独的名叫 `config.yml` 的文件。

UPU 采用 YAML 格式存储自身的配置，采用 JSON 格式存储每个插件的更新配置。这些是人性化、可读性高且非常通用的格式，您可以在其中对程序进行配置。不过不用担心，您不需要为了配置 UPU 去专门了解 YAML 或 JSON。我提到它只是考虑到您可能会想要使用一些 Bash 脚本批量创建大量 UPU 更新配置文件。

在这里我想穿插提一下上文描述的“配置”和“更新配置”的含义。如果“配置”一词没有跟任何前缀，也没有任何补充描述，代表下文中的配置指的都是 UPU 插件自身的配置（即 `config.yml`）。相应的，如果提到了“更新配置”，那接下来要提到的配置都是有关检查插件更新的（即 `global.json` 和 `<PluginId>.json`）。有人可能会混淆“配置”和“更新配置”，因此在这里澄清一下没有坏处。

## 数据文件夹
所有 UPU 需要的文件都存放在 UPU 的数据文件夹中。数据文件夹的位置由您使用的服务端软件决定，通常位于 Jar 插件文件的相同目录下。我们列出了几个常见服务端下 UPU 的数据文件夹路径，以下路径均为相对服务端工作目录的路径，并假设您没有通过其他方式修改。

- Bukkit/Paper：`plugins/UniversalPluginUpdater`
- BungeeCord/Waterfall：`plugins/UniversalPluginUpdater`
- Velocity：`plugins/universalpluginupdater`

## 插件配置
插件配置存放于 `config.yml` 文件中，其结构如下：

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

要了解对所有选项的解释，请查看 [config.yml](config.yml) 章节。

## 更新配置
更新配置分为两类，一类是存放于 `global.json` 文件中的全局更新配置，还有一类是存放在数据文件夹下名为 `channels` 文件夹的若干个 `<PluginId>.json` 文件。它们的作用域不同，但它们的结构都是相同的，其结构如下：

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

要了解对所有选项的解释，请查看 [global.json\/\<PluginId\>.json](channel.json) 章节。