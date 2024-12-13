import { Config } from "./types.ts";

/**
 * Recursively clean up a directory by removing files and directories that
 * are known to be unnecessary to.
 *
 * @param dir The path to the directory to clean up. If not specified, the current directory is used.
 */
export default function cleanup(dir: string, config: Config) {
  console.log(`Cleanup with args: ${dir}`);
}
