# JVM Parameters

UPU supports several JVM parameters that influence the runtime behavior of plugins by defining system properties for the JVM. Advanced users can utilize these parameters to specify how plugins should operate. Unlike the standard configuration method using the `config.json` file, these command-line parameters can be applied during core initialization (such as `upu.locale`).

## Usage

Usage is generally consistent across all platforms where Java is available. For instance, if you use a `.bat` or `.sh` file to start the server, you can add system properties to that file. Otherwise, you can simply include them directly in the startup command. For example:

```shell
java -Dupu.locale=zh-Hans -jar server.jar
```

Here, `-D` is used to set a system property, with the system property `upu.locale` assigned the value `zh-Hans`.

## Parameters

`-Dupu.locale=<locale>` — Sets the display language for UPU to the value specified by `<locale>`. This parameter ignores the language defined in the configuration file and the system default language, and directly uses the language defined by this parameter. Since configuration loading occurs during the plugin loading phase, text displayed before configuration loading may be shown in your system language or default language. Setting this parameter will allow this text to also be displayed in your language.