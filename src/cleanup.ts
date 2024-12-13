import chalk from "chalk";
import { GITIGNORE_IGNORE } from "./constants.ts";
import { Config } from "./types.ts";
import { formatSize, getDirectorySize } from "./utils/size.ts";
import { join } from "jsr:@std/path";
import { LANGUAGES } from "./constants.ts";
import { Table } from "@cliffy/table";
import { CleanupProgress } from "./utils/progress.ts";

// Using a Set to store unique patterns
async function getGitignorePatterns(
  dir: string,
  patternsSet: Set<string> = new Set(),
): Promise<Set<string>> {
  try {
    // First try to read the .gitignore in the current directory
    const gitignorePath = join(dir, ".gitignore");
    const content = await Deno.readTextFile(gitignorePath);

    // Process the content and add patterns to our Set
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const pattern = trimmed.split("#")[0].trim();
        if (!GITIGNORE_IGNORE.includes(pattern)) {
          patternsSet.add(pattern);
        }
      }
    }
  } catch (error) {
    // Silently continue if .gitignore doesn't exist
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  // Now recursively process all subdirectories
  try {
    for await (const entry of Deno.readDir(dir)) {
      if (entry.isDirectory) {
        // Skip certain directories that we know won't have relevant .gitignore files
        if (!GITIGNORE_IGNORE.includes(entry.name)) {
          await getGitignorePatterns(join(dir, entry.name), patternsSet);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error}`);
  }

  return patternsSet;
}

function getPatternsFromLanguages(
  languages: (keyof typeof LANGUAGES)[],
  patternsSet: Set<string> = new Set(),
): Set<string> {
  for (const language of languages) {
    const languageConfig = LANGUAGES[language];
    for (const dir of languageConfig.dirs) {
      patternsSet.add(dir);
    }
  }
  return patternsSet;
}

async function countFiles(dir: string, patterns: Set<string>): Promise<number> {
  let count = 0;

  async function walk(currentDir: string) {
    for await (const entry of Deno.readDir(currentDir)) {
      const fullPath = join(currentDir, entry.name);

      if (patterns.has(entry.name)) {
        count++;
        continue;
      }

      if (entry.isDirectory && !GITIGNORE_IGNORE.includes(entry.name)) {
        await walk(fullPath);
      }
    }
  }

  await walk(dir);
  return count;
}

async function removeFilesFromPatterns(
  dir: string,
  patterns: Set<string>,
): Promise<void> {
  const progress = new CleanupProgress();
  const totalFiles = await countFiles(dir, patterns);
  progress.start(totalFiles, "Scanning directories...");

  let processedFiles = 0;

  async function walkAndRemove(currentDir: string) {
    try {
      for await (const entry of Deno.readDir(currentDir)) {
        const fullPath = join(currentDir, entry.name);

        // Try to stat the file/directory first
        const fileInfo = await Deno.stat(fullPath).catch(() => null);
        if (!fileInfo) {
          console.warn(
            chalk.yellow(`Warning: Skipping inaccessible path: ${fullPath}`),
          );
          continue;
        }

        if (patterns.has(entry.name)) {
          try {
            await Deno.remove(fullPath, { recursive: true });
            processedFiles++;
            progress.update(processedFiles, `Removed: ${entry.name}`);
          } catch (error) {
            console.warn(
              chalk.yellow(`Warning: Failed to remove ${fullPath}: ${error}`),
            );
          }
          continue;
        }

        if (fileInfo.isDirectory && !GITIGNORE_IGNORE.includes(entry.name)) {
          await walkAndRemove(fullPath);
        }
      }
    } catch (error) {
      console.warn(
        chalk.yellow(
          `Warning: Could not process directory ${currentDir}: ${error}`,
        ),
      );
    }
  }

  try {
    await walkAndRemove(dir);
    progress.finish("Cleanup completed successfully!");
  } catch (error) {
    progress.stop();
    throw error;
  }
}

function displayConfirmation(): boolean {
  return confirm("Do you want to proceed with cleanup?");
}

function printPatternsTable(patterns: Set<string>, wrap: number = 10): void {
  const PATTERN_WRAP = wrap;
  console.log(chalk.blue("• Patterns to be used for cleanup:"));
  const table = new Table()
    .maxColWidth(PATTERN_WRAP)
    .padding(2)
    .indent(2)
    .border()
    .render();

  let row: string[] = [];
  for (const pattern of patterns) {
    row.push(pattern);
    if (row.length === PATTERN_WRAP) {
      table.push(row);
      row = [];
    }
  }
  table.sort();
  console.log(table.toString());
}

export default async function cleanup(
  dir: string,
  config: Config,
): Promise<void> {
  try {
    // TODO: Remove these after testing
    // setUpDummyFolderStructureForTesting("./test-folder");

    const sizeBefore = await getDirectorySize(dir);
    console.log(
      chalk.bgBlue(
        `\nDirectory size before cleanup: ${formatSize(sizeBefore)}\n`,
      ),
    );

    let patterns: Set<string>;
    if (config.languages.length === 0) {
      console.log(chalk.blue("• Using .gitignore files for cleanup"));
      patterns = await getGitignorePatterns(dir);
    } else {
      console.log(
        chalk.blue(
          `• Cleaning up for languages: ${config.languages.join(", ")}`,
        ),
      );
      patterns = getPatternsFromLanguages(config.languages);
    }

    // Log out the patterns that will be used for cleanup (using Table)
    printPatternsTable(patterns);

    // If patterns is empty, show a message and return
    if (Array.from(patterns).length === 0) {
      console.log(chalk.yellow("No patterns found for cleanup"));
      return;
    }

    if (!displayConfirmation()) {
      console.log(chalk.yellow("Cleanup aborted"));
      return;
    }
    // Remove files based on patterns
    await removeFilesFromPatterns(dir, patterns);

    // Calculate and show space saved
    const sizeAfter = await getDirectorySize(dir);
    const savedSize = sizeBefore - sizeAfter;
    console.log(
      chalk.bgGreen(`\nCleanup complete! Saved ${formatSize(savedSize)}`),
    );
  } catch (error) {
    console.error(
      chalk.red(
        `Error during cleanup: ${error instanceof Error && error.message}`,
      ),
    );
    throw error; // Re-throw to be handled by the main error handler
  }
}
