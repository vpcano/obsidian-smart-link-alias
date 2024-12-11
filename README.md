# SmartLinkAlias

**SmartLinkAlias** is an Obsidian plugin that enhances your internal link management by allowing you to dynamically control how note titles appear in links. Whether you're working with acronyms, abbreviations, or custom aliases, this plugin provides you with powerful options to display your links exactly how you want.

<!-- ![SmartLinkAlias in action](GIF) -->

## Installation

1. Open Obsidian and go to **Settings** → **Community plugins**.
2. Click **Browse** and search for **SmartLinkAlias**.
3. Click **Install** and then **Enable** to activate the plugin.

## Usage

1. Open a note where you'd like to define custom titles.
2. Add the following YAML properties at the top of your note:

   ```yaml
   ---
   full-title: Sample Note
   short-title: SN
   ---
   ```

3. When creating a link to this note from another note, use the alias section to specify the display mode:

   - `[[Sample Note|short]]` → Displays: `SN`
   - `[[Sample Note|full]]` → Displays: `Sample Note`
   - `[[Sample Note|long]]` → Displays: `SN (Sample Note)`

## Roadmap

- [x] Base functionality in read mode
- [x] Base functionality in edit mode
- [ ] Customize display format via plugin settings
- [ ] Other ways to select the display mode ??

## Contributing

If you encounter any issues or have feature requests, please visit the [GitHub Repository](https://github.com/vpcano/obsidian-smart-link-alias) and feel free to open an issue or submit a pull request.

## License

This plugin is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Thank you for using **SmartLinkAlias**! If you find it helpful, don't forget to leave a review in the Obsidian Community Plugins list!

