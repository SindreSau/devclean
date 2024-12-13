function isValidPath(path: string): boolean {
  try {
    return Deno.statSync(path).isDirectory;
  } catch {
    return false;
  }
}

export default function validateArgs(args: string[]): boolean {
  if (args.length === 0) {
    throw new Error("No arguments provided. Please provide a path.");
  }

  if (args.length > 1) {
    throw new Error("Too many arguments provided. Please provide only one path.");
  }

  const path = args[0];
  if (!isValidPath(path)) {
    throw new Error(`Invalid path provided: ${path}. Please provide a valid directory path.`);
  }

  return true;
}