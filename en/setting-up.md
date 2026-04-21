# Setup Guide

If this is your first visit here, welcome! We’re glad to see another traveler interested in our project. With great power comes great responsibility—if you’re **willing to learn how to use it**, UPU can handle many tasks related to Minecraft server plugins.

We recommend doing **one thing at a time**. UPU covers many different aspects: some are simple, while others can be complex. You don’t need to understand or read everything at once—in fact, we strongly suggest taking it slowly. Relax, grab a drink, and spend an hour diving into the docs—we promise it won’t be a waste of your time.

Let’s start with the basics: UPU is a Minecraft server plugin, which means it needs an existing server platform (such as Bukkit or Velocity) to load. UPU supports many platforms, and the overall experience is roughly the same, so you don’t need to memorize many differences between platforms (although a few details do differ). We mention this now because some platforms cannot provide the capabilities (interfaces) UPU needs to complete certain tasks, so you won’t be caught off guard if that happens.

After you obtain the UPU JAR file, you still need to configure it—specifically, how you want UPU to check plugin updates, where to check, how to install updates, and so on. If you only install UPU without configuration, it won’t do much in practice. This is for safety reasons: if someone malicious abused UPU to execute arbitrary code on your OS, it would harm both you and the reputation of UPU developers. Don’t worry though—we’ll guide you through the setup step by step.

That’s the big picture. Let’s get started.

## Install the UPU plugin

Usually, this only takes a few minutes:

- First, download the UPU JAR file from your preferred platform:
  - GitHub Releases
  - Modrinth
  - Hangar
  - SpigotMC
- Then place the JAR file in your server’s plugin folder (usually `plugins`).
- Next, start the server once, then stop it. This lets UPU generate initial files.
- Then configure UPU.
- Finally, start the server and begin using UPU.

Some steps are self-explanatory, while others need extra attention. Don’t worry—we’ll walk you through all of it.

## Download

UPU supports many server platforms. UPU provides different JAR files for different platforms to avoid potential conflicts from bundling everything into one JAR, and to reduce file size.

You need to pick the plugin file that matches your platform. For example, if you use `Purpur`, you should download `UniversalPluginUpdater-Bukkit.jar`. You may wonder why the file name includes “Bukkit”. In practice, many server platforms are forks of upstream projects; `Purpur` is a fork of `Paper`, and `Paper` is (or used to be) a fork of `Bukkit`. UPU development targets upstream platforms as much as possible so downstream forks can work without separate reimplementation. See the compatibility section for details on platforms.

After downloading, move the JAR file into the plugin folder. If the server process runs under a regular OS user but file operations are done as an admin user (such as `root` or `Administrator`), you may need to adjust file permissions so the regular user can modify plugin files. The same applies to other plugins. Otherwise, UPU may hit permission issues and fail certain tasks.

## Configure

Now we’re at the last step: configuration. UPU uses the concept of “channels”. One plugin corresponds to one channel config file; each config file can contain multiple channels. Plugin authors often publish on multiple plugin sites (which we call channels), and so does UPU. You can configure as many channels as you like, but for beginners, focus on one channel first—usually the one you know best. UPU also has behavior settings, and the most important one is the global channel config, which affects all channels.

A common rule: if you don’t understand a setting, keep its default value. UPU offers many ways to configure and customize nearly everything, but as mentioned above, trying to understand all options at once is a trap. It quickly becomes confusing. Instead, we suggest making update checks work first, then exploring advanced options gradually with the help of the docs—and **change one thing at a time**.

You can configure UPU with any text editor you like. If you don’t already have one, we recommend [Visual Studio Code](https://code.visualstudio.com/). We explain configuration in depth in the [Configuration](/en/core/config/index) section. If UPU runs into severe errors during setup or stops working entirely and you want to reset configs, simply delete the config files and restart the server—UPU will regenerate defaults. Before doing that, make sure important data is backed up.

## Run UPU

You’ve probably been waiting for this moment, and you shouldn’t wait any longer—you’re ready for your first UPU run. Just start your server as usual, and UPU will run as a plugin on your server.

If you’re concerned about what UPU does next—especially what actions it performs on your behalf, such as fetching update configs from our server by default—you can review the remote communication section now. If you don’t like certain behavior, you can disable specific features at any time. UPU ships with sensible defaults based on common user scenarios and our core design principles.

If everything goes well, UPU should now be running correctly and printing a welcome message in your server output.

You can now try UPU commands, such as `/upu update` to check updates and `/upu download` to download updates. All available commands are listed in the [Commands](/en/core/commands) section.
