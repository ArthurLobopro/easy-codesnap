# Translation Guide

## Adding a New Translation

Translations are located in the `./l10n` folder and follow the naming pattern: `bundle.l10n.[code].json`.

To create a new translation:

1. Copy the file `bundle.l10n.pt-br.json` (it's mantained by the owner, so must be complete).
2. Rename it using the appropriate language code (e.g., `bundle.l10n.es.json` for Spanish).
3. Replace the values in the file with the corresponding translations.

Additionally, you must create a file named `package.nls.[code].json` for your language.  
Use the existing `package.nls.json` file as a reference and translate all applicable keys.

> If you can't translate all the keys but still want to contribute, that's totally fine. However, make sure to **remove any key-value pairs that still contain Brazilian Portuguese** — otherwise, those untranslated values will be published as-is.

Once your translation is complete, open a Pull Request and wait for it to be reviewed.

---

## Adding Missing Translations

After cloning the repository and installing dependencies:

1. Run: `yarn translation-status`

2. The terminal will display the current status of all translations.

This output helps you identify missing strings so you can provide the appropriate translations.

After adding the missing entries (both in `bundle.l10n.[code].json` and `package.nls.[code].json`, when applicable), open a Pull Request and wait for review.