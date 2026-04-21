# Localization

Anyone can help translate UPU into languages around the world.

We currently use the traditional approach: language files for localization support.

## Get Started

If you want to help UPU—whether by translating, reviewing, or approving translations—please create a GitHub account first. Registration is easy and completely free. After signing in, visit the [language file directory](https://github.com/DreamVoid/UniversalPluginUpdater/tree/main/base/src/main/resources/lang), choose the language you want to work on, pick a set of UPU texts, and help the community bring UPU to more languages.

## Translation

If your chosen language is not listed in the language file directory yet, you can create a new file. The filename supports multiple standards. For example, if you are translating *Simplified Chinese (Singapore)*, the file can be named `zh` (ISO 639), `zh-SG` (ISO 3166), `zh-Hans` (ISO 15924), or `zh-Hans-SG`. UPU matches language codes from most specific to less specific. We recommend using the most specific format to avoid ambiguity. The file extension must be `json`, and the content must be valid JSON so UPU can recognize it correctly.

If UPU already supports your language but does not recognize your specific locale code, you can create a file with extension `link`, whose content is another language code to link to. When UPU detects your locale code, it will automatically use the linked language file.

You can start from the English language file `en.json`. If you are fluent in Simplified Chinese, `zh-Hans.json` is often an even better template because UPU is mainly developed in Simplified Chinese, and that text best reflects the original intent.

We try hard to keep translations flexible, so many texts include runtime variables provided dynamically by UPU—these are numbers wrapped in braces, like {0}. This lets you adjust sentence structure naturally for your language instead of being forced into a rigid format. This is especially important for RTL (right-to-left) languages such as Hebrew.

## Submit

After completing your translation, you can submit your language file through a GitHub Pull Request. UPU maintainers will review it, merge it if approved, and distribute your translation to all users in the next release.
