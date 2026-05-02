# Remote Communication

This section describes the remote communications used by UPU and explains how you can change their behavior. While we do not consider the communications below to be malicious or unnecessary—and we are not legally required to disclose them—we still want you to better understand program behavior, especially regarding privacy and data sharing.

## Update channels

UPU communicates with the [Modrinth API](https://api.modrinth.com/)/[GitHub API](https://api.github.com/)/[Hangar API](https://hangar.papermc.io/api/)/[Spiget](https://spiget.org/) to check updates for other plugins. You can configure the [`config`](/en/core/config/channel.json#channels) property in both global update config and per-plugin update config to affect how UPU communicates with these services.

**This communication is internal HTTP communication performed by UPU.** UPU sends an HTTP User-Agent containing its own version, OS type, and Java version.

You can disable communication with these services by removing corresponding channel configs from each plugin’s update config file.

## Configuration Repository

UPU communicates with repository URLs defined in `repositories.json` inside the data folder to provide update-config checking. By default, this file only contains the repository URL controlled by UPU developers: `https://repo.upu.dreamvoid.me/`. Its [content is hosted on GitHub](https://github.com/DreamVoid/UPU-Repository) and served via Cloudflare Pages.

**This communication is internal HTTP communication performed by UPU.** UPU sends an HTTP User-Agent containing its own version, OS type, and Java version.

You can disable repository-config features by setting `repositories.json` to an empty JSON array: `[]`.

## bStats

UPU developers use [bStats](https://bstats.org/) to understand how many users are using UPU. bStats only collects anonymous data that is not tied to you. See its [privacy policy](https://bstats.org/privacy-policy) for details.

You can disable bStats communication by opening the `bStats` folder in your plugins directory, setting `enabled` to `false` in `config.yml`, and restarting your server. Note that this also disables bStats for the server and other plugins.
