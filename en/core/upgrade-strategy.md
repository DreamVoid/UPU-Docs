# Upgrade Strategy

The most critical step in upgrading a plugin is replacing the old JAR file with the new version, ensuring that the server loads the updated file. There are many ways to replace files. You can delete the file first and then copy the new file, or you can directly overwrite it with a file of the same name. UPU's upgrade strategy is essentially different file copying methods, and different upgrade strategies behave differently on different systems and server softwares. This page describes some of the UPU's built-in upgrade strategies and how to create a new upgrade strategy.

## About File Systems

Before describing UPU's upgrade strategy, let's first understand how the operating system organizes files, which will help you understand how UPU's upgrade strategy works.

Each plugin is a JAR file stored within what is known as a [file system](https://en.wikipedia.org/wiki/File_system) on your server. You don’t need to concern yourself too much with the file system itself—it is sufficient to know that different operating systems typically use different file systems, and that these file systems behave in different ways.

On Windows, the most common file system is [NTFS](https://en.wikipedia.org/wiki/NTFS). Its design centers on a core concept: **every file and directory is, in essence, a "record" within the Master File Table (MFT).** Operations performed on a file are, fundamentally, operations on this record. Accessing a file on Windows is essentially a process of requesting "permissions." The operations performed on a file are essentially operations on that record. Accessing a file on Windows is actually a process of requesting "permissions". When a server process wants to read a plugin file, it requests two permissions from the operating system. The first is "what I want to do", and the second is "what others can do under what I do". The former requests the operating system to operate on the file, and the latter declares to the operating system what permissions other processes should be denied. For instance, a server process might tell the operating system: "Do not allow any other process to delete this file while I am reading it!" Consequently, if you attempt to delete a plugin file that is currently loaded by other process on Windows, you will encounter an error message stating that the file cannot be accessed because it is being used by another process.

In Linux systems (and throughout the Unix world), the situation is slightly different; **all files are divided into two separate parts: inodes and directory entries**. An index node, also known as an inode (https://en.wikipedia.org/wiki/Inode), is the actual entity of a file. It stores all the file's metadata (permissions, size, timestamps, etc.) and the location of data blocks on the disk. Each inode has a unique number. A directory entry is essentially just a "label". Each directory corresponds to a "directory file" that contains a mapping table, linking human-readable filenames to specific inode numbers. This "name-to-inode" association is what we call a "hard link." An inode can be pointed to by multiple directory entries (i.e., multiple different filenames, even in different directories). The filename is just one of the paths to access the inode, not the inode itself. Therefore, deleting a file on Linux is essentially deleting a hard link and decrementing the link count of the inode corresponding to that hard link by 1. This process is entirely indifferent to whether any processes currently have the inode open, removing one hard link has no impact on others. A file is only truly deleted from the file system when no processes are accessing it and no directory entries remain that point to it. This design brings some elegant capabilities that are difficult to achieve on Windows. You may sometimes notice that even if your server process is still running on Linux, you can delete the plugins used by that server process and replace them with new plugins.

## UPU's Built-in Upgrade Strategy 

Now, let’s combine the previously discussed concepts regarding file systems with the various upgrade strategies built-in in UPU. This will help you better understand these options and select the one that best suits your needs. Each policy ID is displayed as a subheading, and you can use the corresponding policy ID directly in the configuration file.

### `native`

- Available platforms: All

This strategy, referred to as the "native" upgrade strategy, leverages the file-handling capabilities provided by the operating system to perform plugin upgrades. When performing an upgrade, this strategy will first attempt to unload the plugin and close the server process's reference to the plugin file in order to release the file from use. It then deletes the old plugin files and places the previously downloaded new plugin files into the plugin directory. Once this is complete, you simply need to restart the server to finalize the upgrade and begin using the new version of the plugin.

You might think this strategy is no different from manually replacing files, and that's true. Therefore, this strategy is also subject to limitations of different operating systems and server softwares. Consequently, this strategy is subject to the specific limitations of the underlying operating system and the server software. For instance, consider the Velocity server running on Windows: Windows does not permit the deletion of files that are currently in use, and Velocity does not support unloading plugins while the server is running to release those file locks. However, if you are not using the Velocity server or are using a Linux system, the native strategy should work correctly because Bukkit and BungeeCord support unloading plugins and releasing files from use at runtime, while Linux supports operating on files when they are in use.

For obvious reasons, if this strategy is used, UPU will typically only perform the upgrade operation during the plugin unloading phase when the server is about to shut down, in order to minimize the side effects of this strategy. You can use the `--now` parameter to allow the UPU to upgrade plugins at runtime, but the native policy's plugin unloading operation will make the upgraded plugins unusable until the server restarts, which may have an adverse effect on your server, especially when the upgraded plugin is a protected plugin, in which case the protection function provided by the plugin will be completely disabled.

### `applier`

- Available platforms: All

This strategy serves as an alternative to the "native" approach. The key difference is that it launches a new, separate process to handle the replacement of plugin files. (Hypothetically) Since we cannot operate on files while the process is running, why don't we start a new process when the server is about to shut down, and let this process perform the file replacement operation after the server process ends? This is the design philosophy of the applier strategy: using a new process to avoid the problem of files being occupied.

This strategy enables automatic plugin updates on the Velocity server on Windows. We don't need to worry about operating system and server limitations, as these limitations can be avoided. The new process will wait for a period of time until the file is no longer in use, and then immediately replace the old file with the new plugin file. Of course, this strategy may not work properly in some environments that do not support creating new processes. Docker containers are one such scenario. However, considering that most Docker containers are Linux systems, you may want to use the native strategy directly.

Because a new process needs to be started, and it is designed as an improved version of the native strategy, if this strategy is used, UPU will only perform the upgrade operation during the plugin uninstallation phase that the server is about to shut down.

### `bukkit`

- Available platforms: Bukkit

Unlike the two strategies mentioned earlier, the bukkit strategy, as the name suggests, can only be used on Bukkit. This strategy utilizes a feature of Bukkit called [Update Folder](https://docs.papermc.io/paper/updating/#step-2-update-plugins), which replaces the old plugin files with the new plugin files after the server starts but before the plugins are loaded. This mechanism is even more complete on Paper.

When using this strategy, UPU retrieves the path to the update folder via the Bukkit API's `getUpdateFolder()` method and places the newly downloaded plugin file there. The upgrade process is then considered complete The next time the server starts, Bukkit will handle the file replacement and load the updated plugin. Because UPU does not need to manipulate files directly, this strategy is safer than the others previously discussed. However, it is exclusively available for Bukkit-based servers. Should other server softwares introduce similar features in the future, UPU may add corresponding strategies named after those specific softwares.

It is important to note that the behavior of this mechanism varies across different versions of Bukkit and Paper. At least up to Bukkit 1.16.5, this mechanism will only replace plugins with the same name in the plugin folder. If the old version of the plugin is named `MyPlugin-1.0.jar` and the new version is named `MyPlugin-1.1.jar`, then Bukkit will not perform file operations. Paper has optimized this mechanism so that it will replace the file as long as the file corresponds to the same plugin, regardless of the file name. Therefore, if you are not using Paper, you may need to adjust the [`updater.filename`](/en/core/config/config.yml#updater-filename) setting in your configuration file  to specify the filename UPU should use when downloading the plugin.

If this strategy is used, UPU will perform the upgrade operation at any time because the upgrade operation is safe under this strategy, and the actual upgrade behavior is controlled by Bukkit.

## Create a new upgrade strategy

If you have a great idea for an upgrade strategy, you can help UPU support a wider range of such strategies. If you have some experience with Java development, you can even implement your idea in code and integrate it directly into UPU. This section explains how to create a new upgrade strategy as a developer and make it available for use within UPU.

It's important to note that creating a new plugin and declaring a dependency on the UPU to provide the upgrade strategy is not a good idea, because the upgrade strategy code must remain available when the UPU is unloading, and a plugin's subsidiary plugins are usually unloaded before the plugin itself. Therefore, unless you can control the uninstallation order of plugins (which is usually not possible), it is a better option to build the upgrade strategy into the UPU.

In the `me.dreamvoid.universalpluginupdater.upgrade` package, you can see the UPU's upgrade strategy interface `UpgradeStrategy` and two implemented upgrade strategies `NativeUpgradeStrategy` and `ApplierUpgradeStrategy`. To create your upgrade strategy, simply create a new class in this package that implements `UpgradeStrategy`. Here, we'll assume it's named `MyUpgradeStrategy`. You then need to implement the required interface methods within this class, as shown below:

```java
package me.dreamvoid.universalpluginupdater.upgrade;

import org.jetbrains.annotations.NotNull;

import java.util.List;

/**
 * @author Me
 */
public class MyUpgradeStrategy implements UpgradeStrategy{
    @NotNull
    @Override
    public String getId() {
        return "mystrategy";
    }

    @NotNull
    @Override
    public List<UpgradeResult> upgrade(@NotNull List<UpgradeTask> tasks) {
        // Do upgrade
        return List.of();
    }
}
```

Two methods are mandatory: `getId()`, which defines the identifier for the strategy used by users to specify it in configuration files. And `upgrade(List)`, which performs the actual upgrade. The `tasks` parameter contains information about all plugins to be upgraded, including their plugin IDs, the locations of the new version files, and the locations of the old version files (if applicable). You are free to use your creativity. You only need to provide an `UpgradeResult` object for each plugin's upgrade result and combine the upgrade results of all plugins in this task into a `List` object and return it. If an exception occurs during the upgrade of an individual plugin, it should be handled within the `upgrade` method itself. If the `upgrade` method throws an exception, UPU will assume that the upgrade strategy itself has encountered an issue and will consider the upgrades for all plugins to have failed.

You can also implement a `getName()` method that returns `null` by default, giving your upgrade strategy a nice name. If your strategy is sufficiently safe to be executed at any time, you can also override the `getExecutionPhase()` method to return `ExecutionPhase.RUNTIME`. This informs UPU that your strategy can be applied at any point without the risk of causing issues.

Once implemented, you can register your upgrade strategy with the UPU. In the `preLoad` method of the `LifeCycle` class, around line 70, you can find the registration locations for several existing strategies:

``java`
``UpgradeStrategyRegistry.instance().registerStrategy(new NativeUpgradeStrategy(platform));

UpgradeStrategyRegistry.instance().registerStrategy(new ApplierUpgradeStrategy(platform));

```

Instantiate your strategy and register it using `registerStrategy`.