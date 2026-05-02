# config.yml

This page describes all options in UPU’s plugin configuration file. After changing any property, you need to restart the server for changes to take effect. Although UPU supports reload behavior on some platforms, you should not rely on it.

## `verbose`

A `boolean` with default `false`. Controls whether UPU outputs verbose debug logs. Most users do not need this enabled, because most verbose logs are not user-facing and can clutter the console.

If you encounter issues or errors related to UPU, you may need to set this to `true` so UPU developers can diagnose problems faster when you report them.

In short, unless you have a reason to enable this feature, you should keep it disabled.

## `language`

A `String` with default `"system"`. Defines the language UPU uses for visible texts. Default value means UPU tries to use your OS language, preferring translated strings in that language. If you do not want OS locale behavior, set this property to another language. UPU accepts locale codes with region (for example `"en-GB"`) and generic codes (for example `"en"`). You can also set preferred language using JVM argument `upu.locale`. If you choose a non-native locale, extra fonts/language packs may be required to display characters properly.

## `platform.name`

A `String` with default `null`. Defines the current server platform name. This value is used in many places, especially update checks where it is sent to remote services to find files matching your platform. If this is `null`, UPU tries to detect platform name from the server.

Normally, UPU can correctly identify the name of the server you are using. You only need to modify this property to help the UPU if it cannot correctly identify the server you are using. Therefore, unless you have a **well-founded** reason to edit this property, you should leave it as the default value.

## `platform.game-versions`

A `List<String>` with default `null`. Defines Minecraft versions supported by the current server. Some plugins require specific Minecraft versions, so UPU sends this info to remote services to locate compatible files.

In most cases you don’t need to care about this (especially for proxy platforms like Velocity). Only specific plugin scenarios require this option.

If this property is `null`, UPU tries to detect supported versions from the server. If it is an empty list, it means Minecraft version should be ignored, and UPU will not send version info to remote services. Unless you have a reason to edit this property, you should leave it as the default value.

## `platform.loaders`

A `List<String>` with default `null`. Defines loaders supported by the current server.

A loader represents platform-specific capabilities introduced by forked platforms. Some plugins require those capabilities, so UPU sends loader info to remote services to find compatible files.

Here's a simple example: Paper is downstream of Bukkit (historically), and squaremap uses Paper-specific features, so it is not compatible with plain Bukkit. UPU must pass Paper as a supported loader; otherwise remote services may not return squaremap updates for your server.

If this property is `null` or empty, UPU attempts automatic loader detection. Unless you have a reason to edit this property, you should leave it as the default value.

## `updater.strategy`

A `String` with default `"native"`. Defines how UPU installs newer plugin versions (“upgrade strategy”). UPU has some built-in upgrade strategies to help you safely upgrade old plugins on the server and replace them with new plugin files.

Default value is a generic strategy: it tries to disable the running plugin, remove old files, move new files into plugin folder, then remind you to restart server.

UPU also includes platform-specific strategies: `bukkit` (for Bukkit) and `velocity` (for Velocity). These are tuned for their own platforms and may work better there.

If you wish to use a different upgrade strategy, or if the `native` upgrade strategy fails to function properly for some reason, you can configure this property as an identifier for another strategy. Furthermore, if other developers have provided alternative upgrade strategies, you can also use them.

## `updater.allow-upgrade-now`

A `boolean` with default `true`. If the active strategy does not support safe hot upgrade, this controls whether `/upu upgrade --now` is allowed to execute immediately. As noted above, `native` is generic, but immediate operations like unloading plugins and deleting files can be risky while server is running. So UPU normally delays such operations until shutdown. Using `--now` forces immediate execution. If you want to prevent accidental immediate upgrades, set this to `false`; UPU will ignore `--now`.

This setting does **NOT** affect strategies that **declare safe upgrade support**. Built-in `bukkit` and `velocity` strategies support safe immediate upgrades. In this case, the upgrade operation is always performed immediately without delay until the server is shut down, and you do not need to modify this property.

## `updater.filename`

A `String` with default `"${originName}"`. Defines naming rule for downloaded files. If `${originName}` is present, UPU uses the filename provided by remote service. Otherwise, UPU will name downloaded files according to the template set here, where:

- `${pluginId}` will be replaced by plugin name in this download operation
- `${channel}` will be replaced by update channel name
- `${timestamp}` will be replaced by timestamp at download time

Unless you have a reason to edit this property, you should leave it as the default value.

## `updater.proxy.uri`

A `String` with default `null`. Defines a web proxy URI used for internal HTTP communication, especially requests to `github.com`. Useful for bypassing firewalls.

This attribute is defined as a URI string:
> A URI string consists of a protocol (supports http/https/socks4/socks4a/socks5), a host, and an optional port. An example of a complete URI string is `"http://contoso.com:8080"`.

If your proxy server requires authentication, you will also need to set the `username` and/or `password` attributes. If authentication is not required, you only need to set this attribute.

Unless you have a reason to edit this property, you should leave it as the default value.

## `updater.proxy.username`

A `String` with default `null`. Defines the username used by the server providing the proxy functionality for Basic, Digest, NTLM, or Kerberos authentication methods. If your proxy does not require users to provide credentials, you do not need to enter anything here. This property only takes effect if you have set the `uri` property.

Unless you have a reason to edit this property, you should leave it as the default value.

## `updater.proxy.password`

A `String` with default `null`. Defines the password used by the server providing proxy functionality for Basic, Digest, NTLM, or Kerberos authentication methods. If your proxy does not require users to provide credentials, you do not need to enter anything here. This property only takes effect if you have set the `uri` attribute.

Unless you have a reason to edit this property, you should leave it as the default value.

## `updater.repository.check-mode`

A `byte` with default `1`. Defines check mode used by `check-list` for repository update-config checks.

- `0` means `Whitelist` mode, disable repository config checks for all plugins, **except** plugins in `check-list`
- `1` means `Blacklist` mode, enable repository config checks for all plugins, **except** plugins in `check-list`

**UPU developers remind you that for your security, you should only enable automatic configuration update checks for trusted sources.** While UPU only checks for updated configurations from our repository by default, and we are responsible for the security of the updated configurations provided, if you define other repository addresses for obtaining configurations, **you are obligated to ensure that the repository addresses you provide are security-free.**

By default, the `/upu repo update` command triggers a plugin configuration update check. If you only want to manually modify the plugin's update configuration and do not want to fetch update configurations from other sources, you can set this property to `0` and clear the `check-list` property list. Otherwise, unless you have a reason to edit this property, you should leave it as the default value.

## `updater.repository.check-list`

A `List<String>` with default `null`. Defines plugin component names used as blacklist/whitelist for repository config checks, depending on `check-mode`.

Unless you have a reason to edit this property, you should leave it as the default value.

## `updater.plugin-list-mode`

A `byte` with default `1`. Similar to `updater.repository.check-mode`, but controls plugin auto-update behavior with `plugin-list`. By specifying this property, you can easily enable/disable the ability of all plugins to update automatically, except for plugins you explicitly specify.

- `0` means `Whitelist` mode, disable auto-update for all plugins, **except** plugins in `plugin-list`
- `1` means `Blacklist` mode, enable auto-update for all plugins, **except** plugins in `plugin-list`

**Security reminder from UPU developers:** only enable auto-update for trusted sources.

**UPU developers remind you that for your security, you should only enable automatic updates for trusted sources.** Please note that **regardless** of the settings here, malicious plugins can update themselves or execute commands remotely. Therefore, this setting only applies to the plugin update function that comes with UPU, and you should still ensure that you verify the security of each plugin before using it.

By default, the `/upu update` command triggers a plugin update check and typically does not execute code; the actual update operation is performed only after the `/upu upgrade` command. However, if a plugin has registered a custom update implementation with UPU, then `/upu update` will execute code. Therefore, **always downloading all plugins from official sources is the best choice to ensure the security of your server data and operating system.** As mentioned above, we are responsible for the security of plugin update configurations provided through the official UPU repository. If you choose to obtain plugins from other sources, **you are obligated to ensure that the sources you provide are security-free.**

Unless you have a reason to edit this property, you should leave it as the default value.

## `updater.plugin-list`

A `List<String>` (default empty list). Defines plugin component names used as blacklist/whitelist for auto-update behavior, depending on `plugin-list-mode`.

Unless you have a reason to edit this property, you should leave it as the default value.
