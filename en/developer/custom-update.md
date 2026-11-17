# Custom Update

The built-in update mechanisms in UPU may not suffice for certain plugins. For instance, a plugin might be a paid product that requires identity verification via the developer's website before a download can be initiated, or the plugin file itself might not be directly accessible through programmatic means. SpigotMC is a prime example of both scenarios: it places plugins behind a Cloudflare WAF and requires a user login to even view the pages for paid plugins. In such cases, you can define a custom update channel within UPU to accommodate these complexities, enabling the successful download of new plugin versions.

This page describes custom updates in UPU from a developer's perspective, as implementing them almost invariably requires Java programming. If you are an end user, the best course of action is to contact the developer of the plugin you are using and request that they add support for UPU-based update checks.

## Custom Update Channel for Plugins

This approach is ideal for developers who wish to integrate UPU update system into their own plugins. You don’t need to maintain your own update logic, simply provide the necessary information, and let UPU handle the rest.

At the core is an abstract class called `AbstractPluginUpdate`. You can create a new class that extends `AbstractPluginUpdate` and implement the required methods. Suppose we implement a custom update mechanism for UPU ourselves: we create a class named `MyPluginUpdate` that inherits from `AbstractPluginUpdate`, and then implement the logic for update checks and downloads. Like this:

```java
package me.dreamvoid.universalpluginupdater;

import me.dreamvoid.universalpluginupdater.update.AbstractPluginUpdate;
import org.jetbrains.annotations.Nullable;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

public class MyPluginUpdate extends AbstractPluginUpdate {
    protected MyPluginUpdate() {
        super("universalpluginupdater");
    }

    private String newVersion;
    
    @Override
    public boolean checkUpdate() {
        try {
            InputStream stream = new URL("https://url.to.plugin.version").openConnection().getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
            String line;
            StringBuilder content = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
            reader.close();
            newVersion = content.toString();
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    @Nullable
    @Override
    public Path download() {
        try {
            InputStream stream = new URL("https://url.to.plugin.file").openConnection().getInputStream();
            Path newFilePath = Path.of("/path/to/newer/plugin/file");
            Files.copy(stream, newFilePath);
            return newFilePath;
        } catch (IOException e) {
            return null;
        }
    }

    @Nullable
    @Override
    public String getVersion() {
        return newVersion;
    }
}
```

Then, use the method provided by UPU to register this update instance at an appropriate location:

```java
import me.dreamvoid.universalpluginupdater.service.UpdateManager;

......

UpdateManager.registerChannel(new MyPluginUpdate());
```

In this example, we have implemented a basic update check. The logic works as follows: it retrieves the version name of the latest release from `https://url.to.plugin.version`, notifies UPU whether the check was successful, and then downloads the new plugin file from `https://url.to.plugin.file`, saving it to `/path/to/newer/plugin/file`.

While this implementation is, to put it mildly, extremely crude—and certainly not production-ready—we will set those shortcomings aside for the moment, as this is intended solely for demonstration purposes. Next, we will examine every detail of this update check, providing you with the knowledge needed to develop a robust, fully-featured custom update mechanism.

### Constructor

The constructor is used to specify which plugin the current custom update class corresponds to:

```java
protected MyPluginUpdate() {
    super("universalpluginupdater");
}
```

In this example, we pass UPU plugin ID directly via the `super` method. We recommend that you do the same, as this is how "your" plugin is updated, and you probably wouldn't want other plugins to use it. Of course, if you have developed multiple plugins and these plugins have similar logic when checking for updates, you can retain the formal parameters and pass the plugin ID during instantiation. We will mention how to obtain the plugin ID later.

The plugin ID passed through the constructor is case-insensitive, cannot be modified, and will be used as the basis for UPU to match plugins and customize update objects. Therefore, it is essential to ensure that the plugin ID is correct.

### `checkUpdate` method

This method contains the actual logic for checking for updates:

```java
private String newVersion;

@Override
public boolean checkUpdate() {
    try {
        InputStream stream = new URL("https://url.to.plugin.version").openConnection().getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        String line;
        StringBuilder content = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            content.append(line).append("\n");
        }
        reader.close();
        newVersion = content.toString();
        return true;
    } catch (IOException e) {
        return false;
    }
}
```

In this example, we assume that accessing `https://url.to.plugin.version` returns the latest version name of the plugin (e.g., `2.0`). We access this URL using Java, store the result in a variable named `newVersion`, and then return `true` to indicate that the update check was successful. If any unexpected event occurs, such as the URL failing to open and resulting in an `IOException` being thrown, return `false` to tell UPU that the update check failed.

**Do not** check for plugin updates within this method! If you return `true` when an update is available and `false` when one is not, UPU will not behave as you might expect. UPU will discard the result of your custom update and try the next available update channel for your plugin until it gets a `true` return value from one channel or all channels fail. The correct approach is to return the version name of the new version in the `getVersion` method mentioned later, rather than manually checking for updates in this method. If you absolutely must explicitly inform UPU whether an update is available, you should do so by controlling the return value of the `hasUpdate` method, not this one.

### `getVersion` method

This method tells UPU the version name of the new version of this plugin:

```java
private String newVersion;

@Nullable
@Override
public String getVersion() {
    return newVersion;
}
```

After calling the `checkUpdate` method in UPU and receiving a `true` return value, the `hasUpdate` method is invoked to verify the existence of an update. If an update is available, this method is used to retrieve the version name of the latest release, which is then displayed to the user. In this example, we directly return the version name of the new version previously cached via the `checkUpdate` method, thus avoiding the need to initiate a network request every time.

This method may return `null`, as the `checkUpdate` process could potentially fail. If UPU detects a `null` return value, it will conclude that no update is available for the plugin.

In most cases, simply returning the version name of the latest release from this method is sufficient. However, if you have a more advanced version management mode, such as if you prefer to use a numeric version number instead of the version name to check for updates, you can consider rewriting the `hasUpdate` method, which will be mentioned below, to replace UPU's default update checking method.

### `hasUpdate` method

This method has a default implementation in UPU:

```java
/**
 * 是否存在更新<br>
 * 将缓存的远程最新版本与本地插件版本进行语义化版本比较，本地版本较旧时返回 true
 * @return 本地版本较旧时返回 true
 */
public boolean hasUpdate() {
    String newVersion = getVersion();
    if (newVersion != null) {
        return Utils.isVersionNewer(newVersion, platform.getPluginVersion(getPluginId()));
    } else {
        return false;
    }
}
```

UPU employs a mechanism similar to SemVer to check for updates. For instance, if the version of the plugin installed on the server is `1.0` and this method returns `1.1`, UPU will identify an available update and notify the user. Similarly, if this method returns `2.0` or `1.0.1`, UPU will also consider that an update exists, while `0.1` will not be considered as an update.

UPU relies directly on this method to determine whether an update exists: a return value of `true` indicates that an update is available, while `false` indicates that no update is available. If UPU’s default update-checking logic does not suit your needs, you may override this method within your custom update class. For example, if you prefer to use a numeric version number instead of a version name to check for updates, you can determine if an update exists by comparing the size of the version numbers.

**Note:** If you override this method, you must ensure that whenever it returns `true`, the `getVersion` method returns a non-null value. If UPU calls this method and learns that an update exists, but cannot obtain the version name of the new version, it will be very confused and will pass this confusion on to the user. Therefore, it is essential to ensure that the version name can be obtained from the `getVersion` method when this method returns `true`.

### `download` method

When UPU is about to download a new version of your plugin file, it will directly call this method:

```java
@Nullable
@Override
public Path download() {
    try {
        InputStream stream = new URL("https://url.to.plugin.file").openConnection().getInputStream();
        Path newFilePath = Path.of("/path/to/newer/plugin/file");
        Files.copy(stream, newFilePath);
        return newFilePath;
    } catch (IOException e) {
        return null;
    }
}
```

In this example, we assume that accessing `https://url.to.plugin.file` will download the new version of the plugin file, save the downloaded file in `/path/to/newer/plugin/file`, and then return this path as the return value.

UPU is agnostic regarding the source or method used for your custom plugin updates, it simply requires that this method provides the file path for the new plugin version. You are free to implement the download logic however you see fit—whether via HTTP, FTP, SSH/SFTP, or even by using a headless browser to simulate a web-based download. You only need to ensure that the returned value points to the location of the downloaded plugin file. If your custom download process fails, you can return `null`. Upon receiving `null`, UPU will recognize that the download failed and proceed to attempt other update channels.

Once the plugin file path is provided, UPU handles the rest of the update process. You don't need to worry about how to delete old plugin files, how to put new plugin files in the plugin directory, or when to update plugins. You only need to maintain this custom update class from time to time to ensure that UPU can always check for updates.

### Other methods

This section describes methods within the `AbstractPluginUpdate` class that were not mentioned previously. Most of these serve as utility methods and you usually cannot override them, they may prove helpful in implementing your custom update logic.

- `List<String> getTargetGameVersions()`: This method returns the target Minecraft version when checking for updates. If your plugin has Minecraft version requirements, you can use this method to return the name of the Minecraft version that this update check hopes to support, such as `1.21.6` or `26.3`.
- `String getPluginId()`: This method returns the plugin ID associated with the current instance. This can be useful if you have multiple plugins that share the same custom update class.
- `String getChannelId()`: This method returns the update channel identifier for the current instance. For `AbstractPluginUpdate`, this value is always `plugin`.

## General Update Channel

This approach is suitable for plugin distribution platforms that already have a user base and a collection of plugins, but are not yet supported by UPU. If the platform you use is not currently supported by UPU and you would like to contribute, this section is exactly what you need.

At the core is the `AbstractUpdate` abstract class, located in the `me.dreamvoid.universalpluginupdater.update` package. In this same package, you can also find existing update channels already supported by UPU, such as Modrinth and Hangar. We will use these as examples to help you get started with writing the update-checking logic for a new channel.

### Inheritance and Annotations

All implementation classes for update channels must extend `AbstractUpdate` and declare their identifier using the `@UpdateChannel` annotation. For instance, the implementation for Modrinth is structured as follows:

```java
@UpdateChannel(id = "modrinth")
public class ModrinthUpdate extends AbstractUpdate {
    ...
}
```

In this example, the logic class for the Modrinth update channel is named `ModrinthUpdate`. It extends `AbstractUpdate` and is decorated with the `@UpdateChannel` annotation, specifying an `id` of `"modrinth"`. The `@UpdateChannel` annotation is mandatory; UPU relies on the value provided in this annotation to locate the corresponding update configuration within `global.json` and `<PluginId>.json` files.

### Constructor

The constructor is used to receive the plugin ID and update configuration corresponding to an update channel instance. For example, the constructor for Hangar is as follows:

```java
public HangarUpdate(String pluginId, JsonObject config, Platform platform) {
    super(pluginId, platform);
    this.info = Utils.gson.fromJson(config, HangarChannelInfo.class);
    if (this.info.author() == null || this.info.author().isEmpty() || this.info.slugOrId() == null || this.info.slugOrId().isEmpty()) {
        throw new IllegalArgumentException("author, slugOrId 不存在或为空");
    }
}
```

In this constructor, the parameters include a `String` representing the plugin ID, a `JsonObject` containing the update configuration, and a platform object provided by UPU for server-side operations. You must pass the first and third parameters to the `AbstractUpdate` constructor via `super()`, and then process the update configuration provided by the second parameter.

You may notice that the constructor for an update channel implementation differs from the constructor for `AbstractUpdate`. This is because a plugin distribution platform requires configuration, whereas an update process itself does not. If you're confused by this statement, let's take a ready-made example: In the first part of this page, when we introduced how to create a dedicated custom update channel for a plugin, we didn't use any configuration from a JSON file because we knew all the information about the plugin's custom updates and didn't need to rely on a configuration file to tell us that. We are currently designing an update channel that is universal for all plugins. It is impossible to use the exact same information to provide update checks for all plugins using this update channel. Otherwise, how can we distinguish which plugin has updates? Consequently, UPU provides a specialized invocation mechanism for these universal update channel implementations. Instead of using the 2-parameter constructor of `AbstractUpdate`, UPU utilizes the 3-parameter constructor of the update channel implementation. This ensures that the update configuration is correctly passed to the update channel object, resulting in a unique, well-defined instance for each plugin on that update channel.

You can check the information for the `config` parameter. By default, this parameter contains a combined configuration of `global.json` and `<PluginId>.json`, but does not include possible default configurations. For non-existent configurations, it is usually represented as `null`. You can check if the configuration includes the identifier used to identify plugins on the plugin distribution platform or other necessary information. If you find that some necessary information is missing, you can throw an `IllegalArgumentException` in the constructor. UPU will consider the information of this update channel to be incomplete and will abandon the use of this update channel.

### `checkUpdate` method, `getVersion` method, `download` method

Similar to those used for plugin-specific update channels, these three methods must be implemented by every update channel implementation class. You can learn about the purpose of these methods in the first section of this page, which covers plugin-specific update channels. Here, we discuss best practices for creating a generic update channel implementation class.

UPU provides a simple HTTP client that supports GET and POST requests, as well as file downloads. You can use the corresponding static methods through the `Http` inner class of the `Utils` class. We recommend that you always use the HTTP client provided by UPU to access the network, as it integrates a caching mechanism and better represents UPU during access, reducing the possibility that the plugin update platform will block UPU's network requests.

A plugin distribution platform typically supports different servers and allows you to pass the platform you need through its API interface. You can use the `platform.getLoaders()` method to retrieve the plugin loaders supported by the current server environment. For example, if UPU is currently running on the Paper server, this method will return an array of `["bukkit","paper"]`, which you can then use the `String.join()` method or process according to the API requirements.

Plugins may offer different versions tailored to specific Minecraft releases, and most distribution platform APIs allow you to filter plugin versions based on the Minecraft version. You can use `platform.getGameVersions()` to obtain a list of all Minecraft versions supported by the current server. If this method returns `null` or an empty array, it indicates that the server environment is not tied to a specific Minecraft version (common with proxy servers like Velocity), meaning you may select any available version of the plugin.

### Registering Update Channel Implementation Classes

If you have implemented a generic update channel within your plugin, you can register your implementation during the plugin's loading phase (the `onLoad` method on Bukkit, or the `ProxyInitializeEvent` event on Velocity) using the following code:

```java
import me.dreamvoid.universalpluginupdater.service.UpdateManager;

......

UpdateManager.registerChannel(YourClassName.class);
```

If you would like to contribute a generic update channel implementation for UPU, you can find the location where update channels are registered in the `LifeCycle` class, at around line 76:

```java
UpdateManager.registerChannel(URLUpdate.class);
UpdateManager.registerChannel(ModrinthUpdate.class);
UpdateManager.registerChannel(GitHubUpdate.class);
UpdateManager.registerChannel(HangarUpdate.class);
UpdateManager.registerChannel(SpigotMCUpdate.class);
```

Simply add the registration code after this code.