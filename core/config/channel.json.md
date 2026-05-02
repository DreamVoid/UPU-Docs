# global.json 和 \<PluginId\>.json

此页面描述了 UPU 的插件更新配置文件中所有选项的解释。与插件配置文件不同，修改的任何属性都是实时生效的，您可以快捷查看您对文件所作的任何更改是否正确。

如果 `<PluginId>.json` 中不存在某个属性，则它会被全局更新配置文件 `global.json` 中的值填充，如果全局更新配置文件也不存在这个属性，那么它会被代码中定义的默认值填充。为了方便，以下所述“默认值”均代表我们在代码中定义的值，而相关属性的讲解以单个插件为例子。

## `selectedChannel`

这是一个默认值为 `null` 的 `String` 类型属性。顾名思义，这个属性定义了 UPU 将优先以什么渠道获取插件的更新。一个插件可能在多个渠道发布，如 ViaVersion 在我们所有支持解析的渠道上都有发布，而您可能偏好在 Modrinth 下载文件，那么您就可以将这个属性设置为 `modrinth`，UPU 会按照您的指示优先从 Modrinth 检查更新。如果指定默认值或指定一个无效的渠道，UPU 会忽略此次设置的值，而按照下面 `channels` 属性的顺序依次检查更新。

`selectedChannel` 值除了能设置为 `channels.type` 的可选值（在下文提到）外，如果插件为自己注册了一个自定义实现的更新渠道，还可以选择 `plugin` 作为更新渠道，在这时，UPU 就会执行插件作者定义的逻辑自行检查更新，同时如果没有指定 `selectedChannel`，UPU 会将这个自定义实现作为第一个可用的更新渠道。

除非您希望更改 UPU 检查特定插件或所有插件的更新渠道，否则最好将其保留为默认值。

## `channels`

这是一个默认值为 `null` 的 `List` 类型属性。此属性定义了当前更新配置所属的插件的所有更新渠道的配置。我们会在下文详细讲解出现的所有属性的含义，在这里，我们只解释这个属性的成员需要具有哪些属性。

`channels` 中的每个成员必须具有用于定义渠道的 `String` 类型的 `type` 属性，和一个相关信息的 `Map` 类型的 `config` 属性。`type` 属性可选的值有 `modrinth`、`github`、`hangar`、`spigotmc` 和 `url`，`config` 属性的可选值根据 `type` 属性的值确定，在下文中有详细解释。

文件中如果定义了一个渠道，那么这个插件必须要能够在这个渠道上检查更新。换言之，如果某个插件没有在 Modrinth 上发布，那么不应该将 Modrinth 渠道相关的配置添加到 `channels` 中。

## `"type": "modrinth"`

Modrinth 渠道可用的 `config` 属性有 4 个：
- `projectId`，类型为 `String`；
- `featured`，类型为 `boolean`，默认值为 `false`；
- `version-key`，类型为 `String`，默认值为 `"name"`；
- `version-regex`，类型为 `String`，默认值为 `null`。

### `projectId`

`projectId` 是必须属性，代表插件在 Modrinth 上的 ID。例如 UPU 的 ID 就是 `X67Jami3`，可以在插件页面右上角的折叠菜单中找到复制 ID 的按钮。

![](/asset/modrinth-id.png)

### `featured`

`featured` 代表筛选插件所有者精选的版本，这不是一个强制性的选项，如果 `featured` 为 `true`，但 Modrinth 上没有符合条件的版本，Modrinth 的 API 仍然会返回 `featured` 为 `false` 的插件更新。因此，不必特别在意这个选项的作用。

### `version-key`

`version-key` 代表 UPU 从 Modrinth API 返回的信息中使用哪个字段作为新版本的版本名。Modrinth API 返回的信息中，`name` 和 `version_number` 都可以由发布者设置为版本名，有些发布者会将 `name` 设置为版本名（展示为发布页面的标题），而有些发布者又喜欢将 `version_number` 设为版本名（展示为发布页面右侧 `Metadata` 部分的 `Version number`。您可以根据需要设置此属性的值，但如果您设置的值既不是 `name` 也不是 `version_number`，UPU 会默认使用 `name` 字段作为版本名。

### `version-regex`

`version-regex` 代表 UPU 从 Modrinth API 返回的信息中提取新版本的版本名所用的正则表达式。默认情况下，UPU 在处理版本名时会去除前导 “v”、去除第一个连字符 “-” 之后的所有文本、去除第一个空格之后的所有文本，以得到标准的 SemVer 格式的版本名。如果默认行为无法正确提取出版本名，则您需要将此属性设置为能提取出版本名的正则表达式，否则 UPU 就会因为版本名问题而无法准确判断是否有更新。

## `"type": "github"`

GitHub 作为全球最大的代码托管平台，许多插件的开发者也会选择 GitHub Releases 作为分发渠道。可用的 `config` 属性有 6 个：
- `repository`，类型为 `String`，定义仓库地址；
- `auth`，类型为 `String`，定义访问 GitHub 提供的令牌；
- `accept`，类型为 `List<String>`，默认值为 `["application/java-archive", "application/x-java-archive"]`，定义接受的文件类型；
- `filter`，类型为 `String`，定义过滤文件使用的表达式。
- `version-key`，类型为 `String`，默认值为 `"name"`；
- `version-regex`，类型为 `String`，默认值为 `null`。

### `repository` 

`repository` 是必须属性，指定插件所在的仓库地址。例如，UPU 的 GitHub 页面是 `https://github.com/DreamVoid/UniversalPluginUpdater`，那么 `repository` 应该设为 `DreamVoid/UniversalPluginUpdater`，这样，UPU 就会通过 GitHub 的 API 查找位于此仓库的 Releases 列表。

### `auth`
`auth` 是随 HTTP 请求发送给 GitHub API 的访问令牌，此属性虽然可选，但强烈建议提供。GitHub 对匿名请求有[每 IP 每小时 60 次](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10#primary-rate-limit-for-unauthenticated-users)的速率限制，插件数量一多，就容易触发速率限制。如果使用的专用 IP 还好，但如果与他人共用一个 IP，那很容易达到速率限制。不过，如果提供了令牌，那么请求就变成了“认证用户请求”，速率限制就变成了[每个用户每小时 5000 次](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10#primary-rate-limit-for-authenticated-users)，且不说有谁能在一个服务端上装 5000 个插件，还全都从 GitHub 获取更新，如果你的账号属于 GitHub Enterprise Cloud 组织，那么还有额外的 1 万次请求，速率限制就变成了每小时 1.5 万次。

不过，设置此属性**绝对不是为了滥用 GitHub 的服务**，相反，我们**反对任何滥用服务的行为**，我们设置此属性只是为了保证您的合理访问不会被阻止。并且，如果您安装了一个托管在私有仓库的插件，此属性允许 UPU 以您的身份访问私有仓库中的 Releases 获取更新。

您可以访问 [Personal access tokens](https://github.com/settings/personal-access-tokens) 页面使用您自己的 GitHub 账号生成访问令牌，如果您只从公开仓库获取更新，则只需要生成 `Public repositories` 权限的令牌即可。如果您有特殊需求，则根据您的需求生成相应的令牌，过期时间根据您的安全需求决定。或者，如果您觉得细调权限太麻烦，也可以生成一个 `Token (classic)` 令牌，什么权限都不需要勾选，直接就能生成一个能访问所有公开仓库的令牌。

无论您使用什么类型的令牌，**务必对令牌文本进行保密**，如上文所述，您的令牌能代表您在 GitHub 上进行操作，泄漏令牌将会导致严重问题。

### `accept`

`accept` 代表 UPU 应从 GitHub API 返回的文件列表中选取什么类型的文件。默认值 `["application/java-archive", "application/x-java-archive"]` 表示 Jar 文件。某些仓库可能会提供 `"application/octet-stream"` 或其他类型的文件，这时您可以将此值与默认值一起填入此属性。不过，大多数时候您都不必关心此属性。除非您有**充分**的理由编辑此属性，否则应将其保留为默认值。

### `filter`

`filter` 代表 UPU 应从 GitHub API 返回的文件列表中选取符合此属性定义的表达式的文件名的文件。一个插件可能像 UPU 一样支持多个平台，并在一个发行版中同时提供这些平台的文件。

如果此属性为 `null`，UPU 会将当前平台支持的加载器名称与文件名进行匹配，如果文件名包含了加载器的名称，则 UPU 就认为此文件是当前平台可用的插件文件，如果没有任何匹配项，那么就使用文件列表中第一个文件。

如果此属性**不**为 `null`（空串 `""` 以及 `"null"` 字符串**不是** `null`，务必进行区分），则 UPU 首先会检查文件列表中有没有文件名包含 `filter` 属性的值的文件，之后再将 `filter` 属性的值视为正则表达式再尝试匹配，如果均没有匹配到合适的文件，**UPU 会丢弃此次更新检查的结果，使用更新检查失败的逻辑。**除非您有理由编辑此属性，否则应将其保留为默认值。

### `version-key`

`version-key` 代表 UPU 从 GitHub API 返回的信息中使用哪个字段作为新版本的版本名。GitHub API 返回的信息中，`name` 代表发布标题，而 `tag_name` 为发布分支标签名，有些开发者会在 `name` 中设置非版本名的文本，而 `tag_name` 通常也会被指定为版本名。您可以根据需要设置此属性的值，但如果您设置的值既不是 `name` 也不是 `tag_name`，UPU 会默认使用 `name` 字段作为版本名。

### `version-regex`

`version-regex` 代表 UPU 从 GitHub API 返回的信息中提取新版本的版本名所用的正则表达式。默认情况下，UPU 在处理版本名时会去除前导 “v”、去除第一个连字符 “-” 之后的所有文本、去除第一个空格之后的所有文本，以得到标准的 SemVer 格式的版本名。大多数开发者在发布新版本时，`tag_name` 的设置已经能够被默认行为处理的很好，因此通常情况下您不需要关注此属性。如果默认行为无法正确提取出版本名，则您需要将此属性设置为能提取出版本名的正则表达式，否则 UPU 就会因为版本名问题而无法准确判断是否有更新。

## `"type": "hangar"`

Hangar 是 PaperMC 推出的插件分发平台，PaperMC 同时也是 Paper 服务端的开发者。可用的 `config` 属性有 4 个：`author`、`slugOrId`、`channel` 和 `platform`。

我原本想在此处详细介绍这 4 个属性，但我突然想到 [PaperMC 自己提供了一个网站](https://hangar.papermc.io/api-docs#get-/api/v1/projects/-author-/-slugOrId-/versions)，解释了这些属性的含义，并且能够直接调试。因此，如果您想了解这些参数的含义，可以查阅 [Hangar API](https://hangar.papermc.io/api-docs#get-/api/v1/projects/-author-/-slugOrId-/versions) 并亲自体验。

## `"type": "spigotmc"`

SpigotMC 曾经还算辉煌，但它的时代（我认为）已经过去了，现在连我自己都很少到 SpigotMC 上下载插件，尤其是 SpigotMC 越来越难用，其管理员还因为我是中国人就对我出言不逊。除了一些曾经用人民币购买的插件需要从 SpigotMC 上下载之外，我更愿意到 Modrinth 上查找插件。不过，SpigotMC 仍然是许多人的选择。

由于 SpigotMC 没有公开的 API，UPU 借助第三方工具 [Spiget](https://spiget.org/) 获取更新。可用的 `config` 属性有 2 个：
- `resource`，类型为 `String`；
- `proxy-download` 类型为 `boolean`，默认值为 `false`。

## `resource`

`resource` 代表 SpigotMC 上的资源 ID，例如，ViaVersion 的资源页面是 `https://www.spigotmc.org/resources/viaversion.19254/`，那么资源 ID 就是最后一串数字 `19254`。

## `proxy-download`

`proxy-download` 代表是否使用 Spiget 进行代理下载，由于 SpigotMC 使用了严格的 Cloudflare WAF 规则，UPU 几乎无法直接从 SpigotMC 下载插件。Spiget 为公众提供了宝贵的服务器资源进行代理下载，并同时设置了严格的速率限制，也因此，UPU 如果发现要下载的文件曾下载到本地，则不会通过任何方式进行完整性校验（也做不到），直接使用已下载的文件作为要使用的文件。

这个更新渠道无法下载需要购买的插件，所以我不建议使用这个更新渠道，在有其他更新渠道可用的情况下，UPU 的配置仓库不会提供 SpigotMC 渠道的更新配置。

## `"type": "url"`

这个更新渠道是专门为插件开发者定制的，只有一个可用的 `config` 属性，名为 `url`，通常定义为插件开发者提供的用于检查更新的链接。如果你是插件开发者，或有能力为 UPU 提供直接下载插件文件的服务，可以查阅自定义链接章节了解接口规范。

UPU 的配置仓库不会提供 URL 渠道的更新配置。