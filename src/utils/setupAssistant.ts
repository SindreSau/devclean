import chalk from "chalk";
import { Checkbox, Select } from "@cliffy/prompt";
import { LANGUAGES } from "../constants.ts";
import { Config } from "../types.ts";

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

export default async function setupAssistant(): Promise<Config> {
  displayDisclaimer();

  // Prompt the user whether to use .gitignore files or select languages manually
  console.log(chalk.green.bold("Select the method you want to use:"));
  const method = await Select.prompt({
    message: "Select method",
    options: [
      { name: "Use .gitignore files", value: "gitignore" },
      { name: "Select languages manually", value: "manual" },
    ],
  });

  if (method === "gitignore") {
    return { languages: [] };
  }

  // Prompt the user to select the languages they want to clean up
  console.clear();
  console.log(chalk.green.bold("Select the languages you want to clean up:"));
  const languages = await Checkbox.prompt({
    message: "Select languages",
    options: Object.entries(LANGUAGES).map(([key, value]) => ({
      name: `${value.icon} ${key}`,
      value: key,
    })),
  });

  return {
    languages: languages as (keyof typeof LANGUAGES)[],
  };
}
