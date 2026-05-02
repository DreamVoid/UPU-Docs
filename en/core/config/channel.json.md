# global.json and \<PluginId\>.json

This page describes all options in UPU’s plugin update configuration files. Unlike plugin config (`config.yml`), changes here take effect immediately, so you can quickly verify whether edits are correct.

If a property is missing in `<PluginId>.json`, UPU falls back to `global.json`. If it is also missing in `global.json`, UPU falls back to code-defined default values.

For convenience, “default value” below refers to values defined in code, and examples are explained from the perspective of a single plugin.

## `selectedChannel`

A `String` with default `null`. As the name suggests, this property defines which channels UPU will prioritize for obtaining plugin updates. A plugin may be released on multiple channels; for example, ViaVersion is released on all our supported channels, while you might prefer to download files from Modrinth. In this case, you can set this property to `modrinth`, and UPU will prioritize checking for updates from Modrinth according to your instruction. If a default value specified or an invalid channel is specified, UPU will ignore this setting and check for updates in the order of the `channels` properties below.

In addition to the optional value of `channels.type` (mentioned below), the `selectedChannel` value can also be set to `plugin` as the update channel if the plugin has registered a custom implementation of the update channel. In this case, UPU will execute the logic defined by the plugin author to check for updates. If `selectedChannel` is not specified, UPU will use this custom implementation as the first available update channel.

Unless you want to change the UPU's check channel for specific plugins or all plugins' updates, it's best to leave it as the default.

## `channels`

A `List` with default `null`. Defines all update-channel configurations for the plugin associated with the current config. We will explain the meaning of all the attributes in detail below. Here, we will only explain which attributes the members of this attribute need to have.

Each member in `channels` must have a `type` property of type `String` to define the channel, and a `config` property of type `Map` containing related information. Possible values ​​for the `type` property are `modrinth`, `github`, `hangar`, `spigotmc`, and `url`. The possible values ​​for the `config` property are determined by the value of the `type` property, as explained in detail below.

If a channel is defined in the configuration file, then the plugin must be able to check for updates on that channel. In other words, if a plugin is not published on Modrinth, then Modrinth channel-related configurations should not be added to `channels`.

## `"type": "modrinth"`

The Modrinth channel has 4 available `config` properties:

- `projectId`, a `String`;
- `featured`, a `boolean`, default value `false`;
- `version-key`, a `String`, default value `"name"`;
- `version-regex`, a `String`, default value `null`.

### `projectId`

`projectId` is a required attribute that represents the plugin's ID on Modrinth. For example, the ID for UPU is `X67Jami3`. You can find the button to copy the ID in the collapsed menu in the upper right corner of the plugin page.

![](/asset/modrinth-id.png)

### `featured`

`featured` filters versions marked as featured by plugin owner. It is optional. Even when `featured` is `true`, if no featured version matches, Modrinth API may still return non-featured updates. Therefore, there is no need to pay special attention to the function of this option.

### `version-key`

`version-key` represents which field the UPU uses as the version name for the new version in the information returned from the Modrinth API. In the information returned by the Modrinth API, both `name` and `version_number` can be set by the publisher to the version name. Some publishers will set `name` to the version name (displayed as the title of the publishing page), while others prefer to set `version_number` to the version name (displayed as the `Version number` in the `Metadata` section on the right side of the publishing page). You can set the value of this attribute as needed, but if you set a value that is neither `name` nor `version_number`, UPU will use the `name` field as the version name by default.

### `version-regex`

`version-regex` represents the regular expression used by UPU to extract the version name of the new version from the information returned by the Modrinth API. By default, UPU removes leading "v", all text after the first hyphen "-", and all text after the first space when processing the version name to obtain a standard SemVer format version name. If the default behavior cannot extract the version name correctly, you need to set this attribute to a regular expression that can extract the version name. Otherwise, UPU will be unable to accurately determine whether there is an update due to version name issues.

## `"type": "github"`

As the world's largest code hosting platform, GitHub is also a popular distribution channel for many plugin developers. There are 6 available `config` properties:

- `repository`, a `String`, defines the repository address;
- `auth`, a `String`, defines the token provided by GitHub for accessing the repository;
- `accept`, a `List<String>`, default value `["application/java-archive", "application/x-java-archive"]`, defines the accepted file types;
- `filter`, a `String`, defines the expression used to filter files;
- `version-key`, a `String`, default value `"name"`;
- `version-regex`, a `String`, default value `null`.

### `repository`

`repository` is a required attribute that specifies the address of the repository where the plugin is located. For example, if UPU's GitHub page is `https://github.com/DreamVoid/UniversalPluginUpdater`, then `repository` should be set to `DreamVoid/UniversalPluginUpdater`. This way, UPU will use GitHub's API to find the list of Releases located in this repository.

### `auth`

`auth` is the access token sent to the GitHub API with the HTTP request. While optional, it is strongly recommended to provide it. GitHub has a rate limit of [60 requests per IP per hour](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10#primary-rate-limit-for-unauthenticated-users) for anonymous requests. With a large number of plugins, this rate limit can be easily triggered. Using a dedicated IP address is manageable, but sharing an IP with others can easily exceed the rate limit. However, if a token is provided, the request becomes an "authenticated user request," and the rate limit becomes [5000 requests per user per hour](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10#primary-rate-limit-for-authenticated-users). Not to mention that no one could install 5000 plugins on a single server and get all updates from GitHub, if your account belongs to a GitHub Enterprise Cloud organization, there's an additional 10,000 requests, bringing the rate limit to 15,000 requests per hour.

However, setting this property is **absolutely not intended to abuse GitHub's services**. On the contrary, we **oppose any abuse of the service**. We set this property simply to ensure that your legitimate access is not blocked. Furthermore, if you have installed a plugin hosted in a private repository, this property allows UPU to access Releases in the private repository as your identity to retrieve updates.

You can generate access tokens using your own GitHub account on the [Personal access tokens](https://github.com/settings/personal-access-tokens) page. If you only get updates from public repositories, you only need to generate a token with `Public repositories` permissions. If you have specific needs, generate the corresponding tokens according to your requirements, and the expiration time will be determined based on your security needs. Alternatively, if you find fine-tuning permissions too cumbersome, you can also generate a `Token (classic)` that doesn't require selecting any permissions and will directly generate a token that allows access to all public repositories.

Regardless of the type of token you use, **it is essential to keep the token text confidential**. As mentioned above, your token represents your actions on GitHub, and leaking your token can lead to serious problems.

### `accept`

`accept` specifies what type of file the UPU should select from the list of files returned by the GitHub API. The default value `["application/java-archive", "application/x-java-archive"]` represents a JAR file. Some repositories may provide `"application/octet-stream"` or other file types, in which case you can include this value along with the default value in this attribute. However, most of the time you don't need to worry about this attribute. Unless you have a **well-founded** reason to edit this attribute, you should leave it as the default value.

### `filter`

`filter` means that UPU should select files from the list of files returned by the GitHub API whose filenames match the expression defined in this attribute. A plugin, like UPU, may support multiple platforms and provide files for all platforms in a single distribution.

If `filter` is `null`, UPU matches filenames against loader names supported by current platform. If none match, it picks the first asset.

If `filter` is **NOT** `null` (`""` or `"null"` string are **not** `null`), UPU first searches assets containing the `filter` text, then tries treating `filter` as a regex. If still no match, **UPU discards this update-check result and treats it as update-check failure**.

### `version-key`

`version-key` specifies which field UPU uses as the version name in the information returned by the GitHub API. In the GitHub API's information, `name` represents the release title, and `tag_name` is the release branch tag name. Some developers may set text other than the version name in `name`, while `tag_name` is usually specified as the version name. You can set the value of this attribute as needed, but if you set a value that is neither `name` nor `tag_name`, UPU will default to using the `name` field as the version name.

### `version-regex`

`version-regex` represents the regular expression used by UPU to extract the version name of a new version from the information returned by the GitHub API. By default, UPU removes leading "v", all text after the first hyphen "-", and all text after the first space when processing version names to obtain a standard SemVer format version name. For most developers, the `tag_name` setting is already handled well by the default behavior when releasing a new version, so you usually don't need to worry about this property. If the default behavior fails to extract the version name correctly, you need to set this property to a regular expression that can extract the version name; otherwise, UPU will be unable to accurately determine if there is an update due to version name issues.

## `"type": "hangar"`

Hangar is a plugin distribution platform launched by PaperMC, which is also the developer of the Paper server. There are 4 available `config` attributes: `author`, `slugOrId`, `channel`, and `platform`. 

I originally intended to explain these four attributes in detail here, but I suddenly remembered that [PaperMC provides its own website](https://hangar.papermc.io/api-docs#get-/api/v1/projects/-author-/-slugOrId-/versions) which explains the meaning of these attributes and allows for direct debugging. Therefore, if you want to understand the meaning of these parameters, you can consult the [Hangar API](https://hangar.papermc.io/api-docs#get-/api/v1/projects/-author-/-slugOrId-/versions) and experience it for yourself.

## `"type": "spigotmc"`

SpigotMC once enjoyed considerable success, but its era (in my opinion) is over. Even I rarely download plugins from SpigotMC now, especially since it's become increasingly difficult to use, and its administrators have even been rude to me because I'm Chinese. Aside from some plugins I used to purchase with money that I need to download from SpigotMC, I prefer to find plugins on Modrinth. However, SpigotMC remains a popular choice for many.

Because SpigotMC does not provide a public API, UPU uses [Spiget](https://spiget.org/) for update data.

There are 2 available `config` attributes:
- `resource`, a `String`;
- `proxy-download`, a `boolean`, default value `false`.

## `resource`

`resource` represents the resource ID on SpigotMC. For example, if the resource page for ViaVersion is `https://www.spigotmc.org/resources/viaversion.19254/`, then the resource ID is the last string of numbers `19254`.

## `proxy-download`

`proxy-download` indicates whether to use Spiget for proxy downloads. Due to SpigotMC's strict Cloudflare WAF rules, UPU can hardly download plugins directly from SpigotMC. Spiget provides valuable server resources for proxy downloads to the public and sets strict rate limits. Therefore, if UPU finds that a file to be downloaded has been downloaded locally before, it will not perform any integrity verification (nor can it), and will directly use the already downloaded file as the file to be used.

This update channel cannot download plugins that require purchase, so I do not recommend using it. If other update channels are available, the UPU configuration repository will not provide update configurations for the SpigotMC channel.

## `"type": "url"`

This channel is mainly for plugin developers.

This update channel is specifically designed for plugin developers. It has only one available `config` attribute named `url`, which is typically defined as a link provided by the plugin developer to check for updates. If you are a plugin developer, or have the capability to provide a service for UPU to directly download plugin files, you can refer to the custom link section to understand the interface specifications.

UPU’s official config repository does not provide URL channel configs.
