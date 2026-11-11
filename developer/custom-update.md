# 自定义更新

UPU 自带的更新方式可能无法满足您的插件的更新要求，例如，您的插件可能是一个付费插件且开发者要求从其网站验证您的身份后才能下载，或者插件文件无法直接通过编程的方式得到，SpigotMC 就是这两种情况的“集大成者”，SpigotMC 让插件躲在 Cloudflare WAF 之后，并且必须登录才能查看付费插件的页面。这时，您可以为 UPU 自定义更新渠道，帮助 UPU 适配这些复杂情况，从而能够成功下载插件的新版本文件。

此页面从开发者视角描述 UPU 自定义更新，因为要实现自定义更新几乎不可能绕开 Java 编程。如果您只是一个普通用户，最好向您使用的插件的开发者请求适配一个插件在 UPU 的更新检查。

## 插件专用的自定义更新渠道

这种方式最适合那些想要为自己的插件接入 UPU 更新系统的开发者，不需要自行维护更新逻辑，只需要提供必要的信息，然后将一切交给 UPU 即可。

核心是一个名为 `AbstractPluginUpdate` 的抽象类，您可以创建一个新的类继承 `AbstractPluginUpdate`，并实现其中必要的方法。假设我们为 UPU 自己实现自定义更新，那么我们创建一个名为 `MyPluginUpdate` 的类，然后继承 `AbstractPluginUpdate`，最后编写更新检查和下载逻辑。就像下面这样：

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

然后，使用 UPU 提供的方法在一个合适的地方注册这个更新实例：

```java
import me.dreamvoid.universalpluginupdater.service.UpdateManager;

......

UpdateManager.registerChannel(new MyPluginUpdate());
```

在这个例子中，我们实现了一个简单的更新检查，这个更新检查的逻辑是：从 `https://url.to.plugin.version` 获取新版本的版本名，然后告诉 UPU 检查是否成功，新的插件文件从 `https://url.to.plugin.file` 下载并保存到 `/path/to/newer/plugin/file`。

这个更新检查的实现不能说完全用不了，至少也算得上是粗糙无比，不过考虑到这只用于演示，姑且暂时忽略这些问题。接下来我们会探索这个更新检查实现的所有细节，帮助您编写真正完善的自定义更新。

### 构造函数

构造函数用于传递当前自定义更新类对应的是什么插件：

```java
protected MyPluginUpdate() {
    super("universalpluginupdater");
}
```

在本例中，我们直接通过 super 方法传递了 UPU 的插件 ID，我们建议您也这么做，因为这是“您的”插件的更新方式，您应该不会愿意让其他插件使用。当然，如果您开发了多个插件，并且这些插件检查更新时具有类似的逻辑，则可以保留形参并在实例化时传递插件 ID，我们会在后文提到如何获取插件 ID。

通过构造函数传递的插件 ID 不区分大小写、不可修改，且将作为 UPU 匹配插件和自定义更新对象的依据，因此务必确保插件 ID 的正确性。

### `checkUpdate` 方法

这个方法用于实际的检查更新的逻辑：

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

在本例中，我们假设访问 `https://url.to.plugin.version` 会得到插件的最新版本名（如 `2.0`），通过 Java 的方式访问这个 URL，并将得到的结果保存在变量 `newVersion` 中，之后返回值 `true` 代表更新检查成功。如果出现了任何意外，比如 URL 无法打开导致抛出了一个 `IOException`，则返回 `false` 告诉 UPU 检查更新失败了。

**不要**在这个方法检查插件是否存在更新！如果您针对插件存在更新的场景返回 `true`，在没有更新的场景返回 `false`，那么 UPU 并不会按照您的想法行事。UPU 会放弃您的自定义更新的结果，尝试您的插件的下一个可用更新渠道，直到从一个渠道中得到 `true` 的返回值或全部失败。正确的做法是在接下来提到的 `getVersion` 方法返回新版本的版本名，而不是在此方法手动检查更新。如果您一定要通过某种方式直接告诉 UPU 是否存在更新，则应当操作 `hasUpdate` 方法的返回值，而不是这个方法。

### `getVersion` 方法

这个方法告诉 UPU 本插件新版本的版本名：

```java
private String newVersion;

@Nullable
@Override
public String getVersion() {
    return newVersion;
}
```

在 UPU 调用 `checkUpdate` 方法并得到 `true` 的返回值后，会先调用 `hasUpdate` 方法检查是否存在更新，如果存在更新，就用此方法获取最新版本的版本名，然后展示给用户。本例中，我们直接返回先前通过 `checkUpdate` 方法缓存的新版本的版本名，这样就不必每次都发起一个网络请求。

此方法的返回值可以为 `null`，因为 `checkUpdate` 可能会失败。如果 UPU 发现此方法返回了 `null` 则会认为插件没有更新。

通常情况下，您只需要直接在这个方法返回最新版本的版本名即可，但如果您有更高级的版本管理模式，例如您偏好使用数字形式的版本号来代替版本名检查更新，则可以考虑重写下文将要提到的 `hasUpdate` 方法替代 UPU 的默认更新检查方式。

### `hasUpdate` 方法

这个方法在 UPU 中有默认实现：

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

UPU 使用类似 SemVer 的机制检查版本是否更新，例如，您安装在服务端的插件的版本名是 `1.0`，而此方法返回了 `1.1`，那么 UPU 就会认为您的插件存在更新，并展示给用户。类似的，如果此方法返回 `2.0` 或 `1.0.1`，UPU 同样会认为存在更新，而 `0.1` 则不会认为存在更新。

UPU 会直接使用此方法来判断是否存在更新，此方法的返回值为 `true` 时代表存在更新，为 `false` 时代表没有更新。如果 UPU 默认的检查更新的方式不适合您，您可以在您的自定义更新类中重写这个方法。例如，您偏好使用数字形式的版本号来代替版本名检查更新，则可以通过比较版本号数字的大小来确定是否存在更新。

**注意**，如果您重写了此方法，则务必检查此方法返回 `true` 时，`getVersion` 方法的返回值是否不为 `null`。如果 UPU 调用此方法得知存在更新，但无法获取新版本的版本名，会感到非常的困惑，并将这种困惑传导给用户，因此务必确保此方法返回 `true` 时一定能从 `getVersion` 方法得到版本名。

### `download` 方法

当 UPU 将要下载您的插件的新版本文件时，将会直接调用此方法：

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

本例中，我们假设访问 `https://url.to.plugin.file` 就能下载新版本的插件文件，并将下载得到的文件保存在 `/path/to/newer/plugin/file`，然后将这个路径作为返回值返回。

UPU 并不关心您的自定义更新从哪里下载插件、如何下载，UPU 只希望调用此方法后能得到新版本插件的文件，因此您可以根据需要自定义这个方法的行为，您可以简单的通过 HTTP 下载插件文件，也可以通过 FTP 传输插件文件，或者通过 SSH 和 SFTP 获取插件文件，甚至可以使用无头浏览器来模拟网页点击下载插件的行为，您只需要在返回值中告诉 UPU 下载好的插件放在哪里就行。如果您的自定义下载行为失败了，则可以返回 `null`，UPU 发现 `null` 的返回值就会明白下载失败，并继续尝试其他更新渠道。

在得到插件路径后，UPU 就会采取各种方式尝试更新您的插件。如何删除旧的插件文件、如何将新的插件文件放到插件目录中、何时更新插件，这一切您都不需要关心，您只需要时不时维护这个自定义的更新类，确保 UPU 始终都能检查更新即可。

### 其他方法

这部分描述 `AbstractPluginUpdate` 类中存在的上文没有提到的方法，这些方法大多为辅助作用，并且通常您不能重写，不过使用这些方法可能可以帮助您更好的实现自定义更新的逻辑。

- `List<String> getTargetGameVersions()`：这个方法返回检查更新时的目标 Minecraft 版本，如果您的插件对 Minecraft 版本有要求，则可以使用这个方法返回本次更新检查希望支持的 Minecraft 版本名，例如 `1.21.6` 或 `26.3`。
- `String getPluginId()`：这个方法返回当前实例对应的插件 ID，如果您有多个插件复用同一个自定义更新类，这个方法可能会有帮助。
- `String getChannelId()`：这个方法返回当前实例的更新渠道标识符，对于 `AbstractPluginUpdate`，返回值始终为 `plugin`。

## 通用更新渠道

即将添加...