import { normalize, relative, resolve } from "jsr:@std/path";
import { homedir } from "node:os";

/**
 * Validates if the given path is legal based on several criteria:
 * - The path must be an existing directory.
 * - The path must be within the user's home directory.
 * - The path must not be a system directory or contain special configuration files.
 *
 * @param path - The path to validate.
 * @returns `true` if the path is legal.
 * @throws Will throw an error if the path is not a directory, does not exist, is outside the user's home directory, or is a restricted system directory or file.
 */
export function pathIsLegal(path: string): boolean {
  try {
    const cwd = Deno.cwd(); // Current working directory
    const absolutePath = resolve(cwd, path); // Resolve path to absolute path
    const normalizedPath = normalize(absolutePath); // Normalize path (remove redundant slashes)
    const homeDir = homedir(); // User's home directory

    try {
      const stat = Deno.statSync(normalizedPath);
      if (!stat.isDirectory) {
        throw new Error("Path must be a directory");
      }
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        throw new Error(`Invalid path: Directory does not exist`);
      }
      throw err;
    }

    if (!normalizedPath.startsWith(homeDir)) {
      throw new Error(
        "Access denied: Path must be within user's home directory",
      );
    }

    const relPath = relative(homeDir, normalizedPath);
    const pathSegments = relPath.split("/").filter(Boolean);

    const systemDirs = [
      "Library",
      "System",
      ".Trash",
      "Applications",
      ".config",
      ".local",
      ".cache",
    ];
    if (pathSegments.length === 1 && systemDirs.includes(pathSegments[0])) {
      throw new Error(
        `Access denied: Cannot clean system directory ${pathSegments[0]}`,
      );
    }

    const specialFiles = [
      ".bashrc",
      ".zshrc",
      ".profile",
      ".ssh",
      ".aws",
      ".kube",
    ];
    if (specialFiles.some((file) => normalizedPath.includes(file))) {
      throw new Error("Access denied: Cannot clean system configuration files");
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Path validation failed: ${error.message}`);
    }
    throw new Error("Path validation failed");
  }
}

/**
 * Validates the provided arguments to ensure there is exactly one path.
 *
 * @param args - An array of strings representing the arguments.
 * @returns `true` if the arguments are valid.
 * @throws Will throw an error if no arguments are provided or if more than one argument is provided.
 */
export function validateArgs(args: string[]): boolean {
  if (args.length === 0) {
    throw new Error("No arguments provided. Please provide a path.");
  }
  if (args.length > 1) {
    throw new Error(
      "Too many arguments provided. Please provide only one path.",
    );
  }

  const path = args[0];
  pathIsLegal(path);
  return true;
}
