# Build

Building is the process of generating plugin JAR files. If you want to make your own changes to UPU, or if for any reason you don’t trust the officially released plugin files, building is what you need. If you are a regular user rather than a developer, prebuilt binaries are likely what you want—but if you want your own binaries or want to learn, keep reading.

As long as you have the required tools, UPU can be built on any currently supported platform.

## JDK

Regardless of platform, you need a full JDK (Java Development Kit) to build UPU. You can choose any JDK you prefer. I use [Azul Zulu](https://www.azul.com/downloads/) because it is fast to access in the mainland of China. Some people prefer [Adoptium](https://adoptium.net/), or others—that’s fine. UPU requires at least Java 17 to build successfully. Higher JDK versions are generally compatible with lower targets, so using Java 25 for build is also acceptable. After installation, `javac` should be available. You can verify with `javac -version`.

## Build

Assuming the correct JDK is installed, go to the UPU source directory (cloned or downloaded and extracted repository), then run:

```windows
mvnw package
```

If you are on Linux/macOS, prepend `./` to run from current directory:

```linux
./mvnw package
```

If build succeeds, you can find generated JAR files in the `target` directory. There will be multiple JARs because UPU supports multiple platforms and ships platform-specific implementations.

## Development

If you want to edit UPU code, you can use any Java-compatible IDE, though this is optional—you can even edit with Notepad and build using `mvnw` above.

If you’re not sure what to choose, we recommend [JetBrains IDEA](https://www.jetbrains.com/idea/download/) and [Visual Studio Code](https://code.visualstudio.com/). The former is the IDE preferred by UPU developers in practice, while the latter is also a solid option. Both are cross-platform and available on Linux, macOS, and Windows.

## Tags

The `main` branch does not guarantee successful build or stable runtime, as described in our release cycle—it is a development branch. If you want to build from source or depend on UPU source, choose an appropriate tag so build succeeds (and for stable tags, runtime behavior is also expected to be stable). To check repository health, review our GitHub CI.
