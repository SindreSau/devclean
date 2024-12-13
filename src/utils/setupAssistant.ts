import chalk from "chalk";
import { Checkbox } from "@cliffy/prompt";

function displayDisclaimer(): void {
  console.clear();
  console.log(chalk.red.bold(`
⚠️    WARNING: USE AT YOUR OWN RISK ⚠️
  `));
  console.log(chalk.yellow(`
    This tool will permanently delete files and directories.
    Make sure you have backups of important data before proceeding.
  `));
}

enum Language {
  Node = "node",
  Python = "python",
  Java = "java",
  Rust = "rust",
  Common = "common",
}

type Config = {
  languages: Language[];
};

export default async function setupAssistant(): Promise<Config> {
  // Display disclaimer
  // if (await !displayDisclaimer()) {
  //   console.log("Exiting...");
  //   Deno.exit(0);
  // }

  // Prompt user to select languages using checkboxes
  console.clear();
  console.log(chalk.green.bold("Select the languages you want to clean up:"));
  const languages = await Checkbox.prompt({
    message: "Select languages",
    options: [
      { name: Language.Node, value: Language.Node },
      { name: Language.Python, value: Language.Python },
      { name: Language.Java, value: Language.Java },
      { name: Language.Rust, value: Language.Rust },
      { name: Language.Common, value: Language.Common },
    ],
  });

  return {
    languages: languages as Language[],
  };
}
