import cleanup from "./src/cleanup.ts";
import validateArgs from "./src/utils/validateArgs.ts";

if (import.meta.main) {
  try {
    const path = Deno.args[0];
    if (!validateArgs([path])) {
      console.error("Argument validation failed.");
      Deno.exit(1);
    }
    cleanup(path);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error occurred.');
    }
    Deno.exit(1);
  }
}