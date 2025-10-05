import { Argument, program as cli } from "commander";
import ora from "ora";
import { main as MakeBadges } from "./commands/make-badges";
import { SortNls } from "./commands/sort.nls";
import { SortOrder } from "./commands/sort.order";

cli
  .name("easy-builder")
  .description("Welcome to Easy CodeSnap Builder CLI!")
  .command("make-badges")
  .description("Generate all extension Readme.md badges")
  .action(async () => {
    const loading = ora("Generating...  ");

    loading.start();
    await MakeBadges();
    loading.succeed("Done!");
  });

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

cli.parse();
