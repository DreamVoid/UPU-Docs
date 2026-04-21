# 编译

编译是生成 Jar 插件文件的过程。如果您希望对 UPU 作出自己的修改，或者出于某种原因不信任官方​发布​的插件文件，编译就是您需要做的事。如果您是用户而不是开发者，则很可能您希望使用已预编译的二进制文件，但如果您想使用自己的二进制文件或学习新内容，请继续阅读。

只要您拥有所有需要的工具，UPU 就可以在任何当前支持的平台上进行编译。

## JDK

无论使用什么平台，您都需要完整的 JDK（Java Development Kit）才能编译 UPU。 您可以选择任何您喜欢的 JDK，我选择的是 [Azul Zulu](https://www.azul.com/downloads/)，因为它在中国大陆的访问速度很快。有人可能喜爱 [Adoptium](https://adoptium.net/zh-CN) 或者别的 JDK，这都没有问题。UPU 至少需要 Java 17 的 JDK 才能正常编译，更高的 JDK 版本兼容更低的 JDK 版本，所以您可以随意选择 Java 25 作为编译使用的版本。安装成功后，`javac` 命令应该已经可以使用并且正常运行。 您可以执行 `javac -version` 命令进行验证。

## 编译

假设您已安装适当版本的 JDK，现在只需要前往 UPU 源代码目录（Clone 或者下载并解压的 UPU 仓库）并执行：

```windows
mvnw package
```

如果您在使用 Linux/macOS，您需要在这条命令前面加上 `./` 代表从当前目录运行，就像这样：

```linux
./mvnw package
```

如果编译成功完成，您可以在 `target` 目录中找到您的 Jar 文件，会有多个 Jar 文件，因为 UPU 支持多个平台并分别提供这些平台的实现。

## 开发

如果您想要编辑 UPU 代码，您可以使用任何兼容 Java 的 IDE，但这也是可选的，因为您甚至可以用记事本编辑代码并用上述 `mvnw` 命令编译。

如果您不知道如何选择，我们推荐 [JetBrains IDEA](https://www.jetbrains.com/zh-cn/idea/download/) 和 [Visual Studio Code](https://code.visualstudio.com/)，前者是 UPU 开发者实际偏好使用的 IDE，而后者也是可行的选择。这两个程序都是跨平台的，可以在 Linux、macOS 和 Windows 上获得。

## 标签

`main` 分支并不保证能够成功编译或者正常运行 UPU，正如我们在发布周期中所述，这是一个开发分支。如果您希望从源代码编译或引用 UPU，就应该为此选择适当的标签，这样能够保证编译成功，甚至可以正常运行（如果您选择稳定版）。要检查代码库的“健康状态”，您可以检查我们的 GitHub CI。