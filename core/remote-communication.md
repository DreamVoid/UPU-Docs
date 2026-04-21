# 远程通信

本章节描述 UPU 所包含的远程通信，以及进一步解释您如何改变其行为。 虽然我们不认为下文所述是恶意或者不需要的，我们在法律上也没有义务予以披露，但我们希望您能更好地理解程序功能，特别是在您的隐私和数据共享方面。

## GitHub/Modrinth/Hangar/Spiget

UPU 与 [Modrinth API](https://api.modrinth.com/)/[GitHub API](https://api.github.com/)/[Hangar API](https://hangar.papermc.io/api/)/[Spiget](https://spiget.org/) 通信用于检查其他插件的更新。您可以设置全局更新配置文件和插件更新配置文件的 [`config`](/config/channel.json#channels) 属性影响 UPU 与这些服务的通信。

**这类通信属于 UPU 内部 HTTP 通信。**UPU 会将自身的版本、操作系统类型、Java 版本拼接为 User-Agent 字段与 HTTP 请求一起发送。

您可以选择禁用这些服务的通信，只需在每个插件的更新配置文件中移除对应更新渠道的配置。

## 配置仓库

UPU 与数据文件夹中 `repositories.json` 文件定义的仓库地址通信提供检查更新配置的功能。默认情况下，此文件仅包含由 UPU 开发者控制的仓库地址 `https://repo.upu.dreamvoid.me/`，其[内容托管在 GitHub 上](https://github.com/DreamVoid/UPU-Repository)，并部署在 Cloudflare Pages 上提供访问。

**这类通信属于 UPU 内部 HTTP 通信。**UPU 会将自身的版本、操作系统类型、Java 版本拼接为 User-Agent 字段与 HTTP 请求一起发送。

您可以将 `repositories.json` 文件内容设置为一对空的方括号 `[]` 来禁用配置仓库功能，这在 JSON 中代表空列表。

## bStats

UPU 的开发者使用 [bStats](https://bstats.org/) 来了解有多少人正在使用 UPU。bStats 只会收集一些不与您关联的匿名数据，您可以查阅其[隐私政策](https://bstats.org/privacy-policy)了解更多信息。

您可以选择禁用 bStats 的通信，只需在插件目录中找到 `bStats` 文件夹，修改 `config.yml` 文件中的 `enabled` 属性为 `false` 后重启服务端。请注意，修改此项也会同时禁用服务端以及其他插件的 bStats 通信。