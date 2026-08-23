# Translation Guide

## Adding a New Translation

Translations are located in the `./l10n` folder and follow the naming pattern: `bundle.l10n.[code].json`.

To create a new translation:

1. Create a file named `bundle.l10n.[code].json` inside the `./l10n` folder (e.g., `bundle.l10n.es.json` for Spanish) with an empty JSON object:
   ```json
   {}
   ```
2. Run `yarn translation-status [code]` to see all strings that need to be translated (`missingKeys`).
3. Add each missing string as a key-value pair in your file, with the translated text as the value.

Additionally, you must create a file named `package.nls.[code].json` at the root of the project.  
Use the existing `package.nls.json` file as a reference and translate all applicable keys.

> If you can't translate all the keys but still want to contribute, that's totally fine — just translate as many as you can and leave the rest out.

Once your translation is complete, open a Pull Request and wait for it to be reviewed.

---

## Checking Translation Coverage

After cloning the repository and installing dependencies, you can use the `translation-status` command to inspect the translation coverage.

### All languages

```bash
yarn translation-status
```

Displays the coverage status for **all available translations**, sorted from highest to lowest coverage.

### Specific language

```bash
yarn translation-status [locale]
```

Filters the output to a **single locale**. The locale code must match the suffix of the translation file (e.g., `pt-br` for `bundle.l10n.pt-br.json`).

**Examples:**

```bash
yarn translation-status pt-br
yarn translation-status fr
yarn translation-status de
```

### Understanding the output

```json
{
  "code": "pt-br",
  "coverage": 100,
  "missingKeys": [],
  "detachedKeys": ["Some old key that no longer exists"]
}
```

| Field | Description |
|---|---|
| `code` | The locale code of the translation file |
| `coverage` | Percentage of source strings that have a translation (0–100) |
| `missingKeys` | Strings used in the source code that are **not yet translated** — these need to be added |
| `detachedKeys` | Keys present in the translation file that **no longer exist** in the source code — these can be safely removed |

---

## Adding Missing Translations

1. Run `yarn translation-status [locale]` for the language you want to improve.
2. Add the entries listed in `missingKeys` to the corresponding `bundle.l10n.[code].json` file.
3. If the missing strings also appear in `package.nls.[code].json`, translate them there as well.
4. Remove any entries listed in `detachedKeys` — they are outdated and no longer used.

After updating the translation files, open a Pull Request and wait for review.