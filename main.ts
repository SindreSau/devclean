// main.ts
import cleanup from "./src/cleanup.ts";
import showHelp from "./src/utils/help.ts";
import setupAssistant from "./src/utils/setupAssistant.ts";
import { validateArgs } from "./src/utils/validateArgs.ts";

if (import.meta.main) {
  try {
    const args = Deno.args;

    // Check if the user requested help
    if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
      showHelp();
      Deno.exit(0); // Exit the program
    }

    // Validate the provided arguments
    if (!validateArgs(args)) {
      console.error("Argument validation failed.");
      Deno.exit(1);
    }

    // Run throguh setup assistant
    const config = await setupAssistant();

    // Clean up the specified directory
    const path = args[0];
    await cleanup(path, config);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error occurred.");
    }
    Deno.exit(1);
  }
}
