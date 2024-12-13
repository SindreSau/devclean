import chalk from 'chalk';

export default function showHelp() {
  console.log(chalk.cyan(`
devclean - Interactive directory cleanup tool

Usage:
  devclean <directory>     Clean specified directory
  devclean -h, --help      Show this help message

Example:
  devclean ./projects      Clean the projects directory`));
  Deno.exit(0);
}