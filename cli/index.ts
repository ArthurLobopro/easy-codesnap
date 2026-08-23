import { Argument, program as cli } from "commander";
import { CompressJson } from "./commands/compress-json";
import { main as MakeBadges } from "./commands/make-badges";
import { SortNls } from "./commands/sort.nls";
import { SortOrder } from "./commands/sort.order";
import { getAllTranslationStatus, getTranslationStatusByLocale } from "./getTranslations";

cli
  .name("easy-builder")
  .description("Welcome to Easy CodeSnap Builder CLI!")
  .command("make-badges")
  .description("Generate all extension Readme.md badges")
  .action(MakeBadges);

cli
  .command("sort")
  .description("Sorts the JSON files content depending of target")
  .addArgument(new Argument("<target>", "Resource target").choices(["nls", "order"]))
  .action((target: "nls" | "order") => {
    const sortFunctions = {
      nls: SortNls,
      order: SortOrder,
    };

    sortFunctions[target]();
  });

cli.command("compress-json").action(CompressJson);

cli
  .command("translation-status")
  .description("Show translation coverage status")
  .addArgument(new Argument("[locale]", "Locale code to filter (e.g. pt-br, fr, de)"))
  .action((locale?: string) => {
    if (locale) {
      const result = getTranslationStatusByLocale(locale);
      if (!result) {
        console.error(`No translation file found for locale "${locale}".`);
        process.exit(1);
      }
      console.log(result);
    } else {
      console.log(getAllTranslationStatus());
    }
  });

cli.parse();
