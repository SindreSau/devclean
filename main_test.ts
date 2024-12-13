import { assertEquals, assertThrows } from "@std/assert";
import { formatSize } from "./src/utils/size.ts";
import validateArgs from "./src/utils/validateArgs.ts";

Deno.test("Correct args handling", async (t) => {
  await t.step("throws error if no args provided", () => {
    assertThrows(() => validateArgs([]), Error, "No arguments provided. Please provide a path.");
  });

  await t.step("throws error if too many args provided", () => {
    assertThrows(() => validateArgs(["path1", "path2"]), Error, "Too many arguments provided. Please provide only one path.");
  });
  
  await t.step("returns true on valid path", () => {
    assertEquals(validateArgs(["."]), true);
  });

  await t.step("throws error on invalid path", () => {
    assertThrows(() => validateArgs(["invalid_path"]), Error, "Invalid path provided: invalid_path. Please provide a valid directory path.");
  });
});

Deno.test("formatSize", async (t) => {
  await t.step("formats bytes correctly", () => {
    assertEquals(formatSize(1024), "1.0KB");
    assertEquals(formatSize(1024 * 1024), "1.0MB");
    assertEquals(formatSize(500), "500.0B");
    assertEquals(formatSize(0), "0B");
  });
});