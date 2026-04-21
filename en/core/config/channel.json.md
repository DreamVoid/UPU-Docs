# global.json and \<PluginId\>.json

This page describes all options in UPU’s plugin update configuration files. Unlike plugin config (`config.yml`), changes here take effect immediately, so you can quickly verify whether edits are correct.

If a property is missing in `<PluginId>.json`, UPU falls back to `global.json`. If it is also missing in `global.json`, UPU falls back to code-defined default values.

For convenience, “default value” below refers to values defined in code, and examples are explained from the perspective of a single plugin.

## `selectedChannel`

A `String` with default `null`. Defines which channel UPU should prioritize when checking updates for a plugin.

A plugin may be published on multiple channels (for example, ViaVersion is available on all supported parsable channels). If you prefer downloading from Modrinth, set this to `modrinth`, and UPU will prioritize Modrinth.

If this value is default or invalid, UPU ignores it and checks channels in the order defined by `channels`.

Besides standard `channels.type` values (listed below), if the plugin registers a custom update-channel implementation, you can set `selectedChannel` to `plugin`. Then UPU executes plugin-defined logic for update checks. If `selectedChannel` is not set, UPU will place this custom implementation as the first available channel.

## `channels`

A `List` with default `null`. Defines all update-channel configurations for the plugin associated with the current config.

Each item must contain:
- `type` (`String`): channel type
- `config` (`Map`): channel-specific settings

Supported `type` values: `modrinth`, `github`, `hangar`, `spigotmc`, `url`.

If a channel is defined, the plugin must actually be updatable through that channel. For example, if a plugin is not published on Modrinth, do not add Modrinth config.

## `"type": "modrinth"`

`config` supports:
- `projectId` (`String`)
- `featured` (`boolean`, default `false`)

`projectId` is the plugin’s Modrinth ID. For example, UPU’s ID is `X67Jami3`.

`featured` filters versions marked as featured by plugin owner. It is optional. Even when `featured` is `true`, if no featured version matches, Modrinth API may still return non-featured updates.

## `"type": "github"`

Many plugin developers use GitHub Releases for distribution.

`config` supports four properties:
- `repository` (`String`): repository path
- `auth` (`String`): GitHub token used for API access
- `accept` (`String`, default `"application/java-archive"`): accepted file MIME type
- `filter` (`String`): filename filter expression

### `repository`

Required. Example: if plugin repository URL is `https://github.com/DreamVoid/UniversalPluginUpdater`, set `repository` to `DreamVoid/UniversalPluginUpdater`.

### `auth`

Optional but strongly recommended. GitHub rate limits unauthenticated requests to low quotas, while authenticated requests have much higher quotas.

This token is used to avoid reasonable usage being blocked. It can also allow UPU to access Releases in private repositories on your behalf (if your token has permissions).

Generate tokens from [Personal access tokens](https://github.com/settings/personal-access-tokens). For public repositories only, minimal public-repo scope is usually enough.

Keep token values secret.

### `accept`

Defines which file type UPU should pick from GitHub release assets. Default `"application/java-archive"` means JAR files.

Most users should keep default unless a repository has special packaging needs.

### `filter`

Defines filename matching behavior for GitHub release assets.

If `filter` is `null`, UPU matches filenames against loader names supported by current platform. If none match, it picks the first asset.

If `filter` is not `null` (`""` or `"null"` string are **not** `null`), UPU first searches assets containing the `filter` text, then tries treating `filter` as a regex. If still no match, **UPU discards this update-check result and treats it as update-check failure**.

## `"type": "hangar"`

Hangar is a plugin distribution platform by PaperMC.

`config` supports:
- `author`
- `slugOrId`
- `channel`
- `platform`

For detailed definitions and testing, refer to [Hangar API docs](https://hangar.papermc.io/api-docs#get-/api/v1/projects/-author-/-slugOrId-/versions).

## `"type": "spigotmc"`

Because SpigotMC does not provide a public API, UPU uses [Spiget](https://spiget.org/) for update data.

`config` supports:
- `resource` (`String`): SpigotMC resource ID
- `proxy-download` (`boolean`, default `false`): whether to use Spiget proxy download

For example, in `https://www.spigotmc.org/resources/viaversion.19254/`, the resource ID is `19254`.

Due to strict Cloudflare protection on SpigotMC, direct download can be difficult. Spiget provides proxy services with strict rate limits. Therefore, if UPU detects that a file has already been downloaded locally, it may reuse that file directly instead of performing full integrity verification.

This channel cannot download paid plugins. UPU’s official config repository also does not provide SpigotMC channel configs.

## `"type": "url"`

This channel is mainly for plugin developers.

`config` has only one property:
- `url`: link provided by plugin developer for update checks (or direct-download metadata service)

If you are a plugin developer or can provide direct download services for UPU, see the custom URL section for interface specification.

UPU’s official config repository does not provide URL channel configs.
