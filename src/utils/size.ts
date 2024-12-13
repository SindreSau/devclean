import { join } from "node:path";
import chalk from "chalk";

/**
 * Format the size of a file in bytes to a human-readable format.
 *
 * @param bytes The size of the file in bytes.
 */
function formatSize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + sizes[i];
}

export { formatSize };

/**
 * Get the size of a file in bytes.
 *
 * @param path The path to the file.
 */
export async function getFileSize(path: string): Promise<number> {
  const fileInfo = await Deno.stat(path);
  return fileInfo.size;
}

/**
 * Get the size of a directory in bytes.
 *
 * @param path The path to the directory.
 */
export async function getDirectorySize(path: string): Promise<number> {
  let size = 0;
  try {
    for await (const entry of Deno.readDir(path)) {
      const entryPath = join(path, entry.name);
      try {
        const fileInfo = await Deno.stat(entryPath).catch(() => null);

        // If we can't stat the file/directory, skip it and continue
        if (!fileInfo) {
          console.warn(
            chalk.yellow(`Warning: Skipping inaccessible path: ${entryPath}`),
          );
          continue;
        }

        if (fileInfo.isDirectory) {
          size += await getDirectorySize(entryPath);
        } else {
          size += fileInfo.size;
        }
      } catch (error) {
        // Log the warning but continue processing other files
        console.warn(
          chalk.yellow(`Warning: Error processing ${entryPath}: ${error}`),
        );
      }
    }
  } catch (error) {
    // For directory access errors, warn but don't throw
    console.warn(
      chalk.yellow(`Warning: Could not read directory ${path}: ${error}`),
    );
  }
  return size;
}
