# config.yml

This page describes all options in UPU’s plugin configuration file. After changing any property, you need to restart the server for changes to take effect. Although UPU supports reload behavior on some platforms, you should not rely on it.

## `verbose`

A `boolean` with default `false`. Controls whether UPU outputs verbose debug logs. Most users do not need this enabled, because most verbose logs are not user-facing and can clutter the console.

If you encounter issues or errors related to UPU, you may need to set this to `true` so developers can diagnose problems faster when you report them.

In short: keep it disabled unless you have a clear reason.

## `language`

A `String` with default `system`. Defines the language UPU uses for visible texts. Default `system` means UPU tries to use your OS language, preferring translated strings in that language. If you do not want OS locale behavior, set this property to another language.

UPU accepts locale codes with region (for example `en-GB`) and generic codes (for example `en`). You can also set preferred language using JVM argument `upu.locale`. If you choose a non-native locale, extra fonts/language packs may be required to display characters properly.

## `platform.name`

A `String` with default `null`. Defines the current server platform name. This value is used in many places, especially update checks where it is sent to remote services to find files matching your platform. If this is `null`, UPU tries to detect platform name from the server.

Usually detection works correctly. Only change this when UPU cannot identify your platform. Unless you have a **strong** reason, keep default.

## `platform.game-versions`

A `List<String>` with default `null`. Defines Minecraft versions supported by the current server. Some plugins require specific Minecraft versions, so UPU sends this info to remote services to locate compatible files.

In most cases you don’t need to care about this (especially for proxy platforms like Velocity). Only specific plugin scenarios require this option.

If this property is `null`, UPU tries to detect supported versions from the server. If it is an empty list, it means Minecraft version should be ignored, and UPU will not send version info to remote services.

## `platform.loaders`

A `List<String>` with default `null`. Defines loaders supported by the current server.

A loader represents platform-specific capabilities introduced by forked platforms. Some plugins require those capabilities, so UPU sends loader info to remote services to find compatible files.

Simple example: Paper is downstream of Bukkit (historically), and `squaremap` uses Paper-specific features, so it is not compatible with plain Bukkit. UPU must pass `Paper` as a supported loader; otherwise remote services may not return squaremap updates for your server.

If this property is `null` or empty, UPU attempts automatic loader detection. Keep default unless needed.

## `updater.strategy`

A `String` with default `native`. Defines how UPU installs newer plugin versions (“upgrade strategy”). UPU includes multiple strategies to upgrade safely.

Default `native` is a generic strategy: it tries to disable the running plugin, remove old files, move new files into plugin folder, then remind you to restart server.

UPU also includes platform-specific strategies: `bukkit` (for Bukkit) and `velocity` (for Velocity). These are tuned for their own platforms and may work better there.

If you need another strategy or `native` is unsuitable, set this property to another strategy identifier (including custom strategies provided by others).

## `updater.allow-upgrade-now`

A `boolean` with default `true`. If the active strategy does not support safe hot upgrade, this controls whether `/upu upgrade --now` is allowed to execute immediately.

As noted above, `native` is generic, but immediate operations like unloading plugins and deleting files can be risky while server is running. So UPU normally delays such operations until shutdown. Using `--now` forces immediate execution.

If you want to prevent accidental immediate upgrades, set this to `false`; UPU will ignore `--now`.

This setting does **not** affect strategies that **declare safe upgrade support**. Built-in `bukkit` and `velocity` strategies support safe immediate upgrades.

## `updater.filename`

A `String` with default `${originName}`. Defines naming rule for downloaded files.

If `${originName}` is present, UPU uses the filename provided by remote service.

Otherwise UPU applies your template:
- `${pluginId}` → plugin name in this download operation
- `${channel}` → update channel name
- `${timestamp}` → timestamp at download time

Keep default unless you need custom naming.

## `updater.proxy.uri`

A `String` with default `null`. Defines a web proxy URI used for internal HTTP communication, especially requests to `github.com`. Useful for bypassing firewalls.

URI format includes protocol (supports `http` / `https` / `socks4` / `socks4a` / `socks5`), host, and optional port. Example: `"http://contoso.com:8080"`.

If proxy requires authentication, also set `username` and/or `password`.

## `updater.proxy.username`

A `String` with default `null`. Username for proxy authentication (Basic, Digest, NTLM, or Kerberos). Only effective when `uri` is set.

## `updater.proxy.password`

A `String` with default `null`. Password for proxy authentication (Basic, Digest, NTLM, or Kerberos). Only effective when `uri` is set.

## `updater.repository.check-mode`

A `byte` with default `1`. Defines check mode used by `check-list` for repository update-config checks.

- `0`: whitelist mode — disable repository config checks for all plugins, except plugins in `check-list`
- `1`: blacklist mode — enable repository config checks for all plugins, except plugins in `check-list`

**Security reminder from UPU developers:** only enable automatic update-config checks for trusted sources.

By default, `/upu repo update` triggers update-config checks. If you only want manual update-config edits and do not want remote retrieval, set this to `0` and clear `check-list`.

## `updater.repository.check-list`

A `List<String>` (default empty list). Defines plugin component names used as blacklist/whitelist for repository config checks, depending on `check-mode`.

## `updater.plugin-list-mode`

A `byte` with default `1`. Similar to `updater.repository.check-mode`, but controls plugin auto-update behavior with `plugin-list`.

- `0`: whitelist mode — disable auto-update for all plugins, except plugins in `plugin-list`
- `1`: blacklist mode — enable auto-update for all plugins, except plugins in `plugin-list`

**Security reminder from UPU developers:** only enable auto-update for trusted sources.

Regardless of this setting, malicious plugins may still self-update or execute remote logic. This setting only controls UPU’s built-in update workflow.

By default, `/upu update` checks for updates and usually does not execute code; actual upgrade is performed after `/upu upgrade`. However, if a plugin registers a custom update implementation in UPU, `/upu update` may execute plugin-defined logic.

Always downloading plugins from official sources remains the best security practice.

## `updater.plugin-list`

A `List<String>` (default empty list). Defines plugin component names used as blacklist/whitelist for auto-update behavior, depending on `plugin-list-mode`.

Keep default unless you have a specific policy need.
