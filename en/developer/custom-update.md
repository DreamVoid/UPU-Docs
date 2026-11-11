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

Coming soon...