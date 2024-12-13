// src/utils/progress.ts
import cliProgress from "npm:cli-progress";
import chalk from "chalk";

export class CleanupProgress {
  private bar: cliProgress.SingleBar;

  constructor() {
    // Create a professional-looking progress bar with a detailed format
    this.bar = new cliProgress.SingleBar({
      format: `${chalk.blue("Cleanup Progress")} |${
        chalk.cyan("{bar}")
      }| {percentage}% || {value}/{total} Entries || {state}`,
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    }, cliProgress.Presets.shades_classic);
  }

  // Start the progress bar with a total number of items
  start(total: number, initialState: string = "Starting...") {
    this.bar.start(total, 0, { state: initialState });
  }

  // Update progress and state message
  update(current: number, state: string) {
    this.bar.update(current, { state });
  }

  // Increment progress by 1
  increment(state: string) {
    this.bar.increment(1, { state });
  }

  // Complete the progress bar
  finish(state: string = "Complete!") {
    this.bar.update(this.bar.getTotal(), { state });
    this.bar.stop();
  }

  // Stop the progress bar (for errors)
  stop() {
    this.bar.stop();
  }
}
