import { assertEquals, assertRejects, assertThrows } from "@std/assert";
import { formatSize, getFileSize } from "./src/utils/size.ts";
import { pathIsLegal, validateArgs } from "./src/utils/validateArgs.ts";

Deno.test("Correct args handling", async (t) => {
  await t.step("throws error if no args provided", () => {
    assertThrows(
      () => validateArgs([]),
      Error,
      "No arguments provided. Please provide a path.",
    );
  });

  await t.step("throws error if too many args provided", () => {
    assertThrows(
      () => validateArgs(["path1", "path2"]),
      Error,
      "Too many arguments provided. Please provide only one path.",
    );
  });

  await t.step("returns true on valid path", () => {
    assertEquals(validateArgs(["."]), true);
  });

  await t.step("throws error on invalid path", () => {
    assertThrows(
      () => validateArgs(["invalid_path"]),
      Error,
      "Path validation failed: Invalid path: Directory does not exist",
    );
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

Deno.test("getSize", async (t) => {
  await t.step("returns the correct size of a file", async () => {
    // Setup test folder and file
    const testDir = "./.test-dir";
    const testFile = `${testDir}/test.txt`;
    await Deno.mkdir(testDir);
    await Deno.writeTextFile(testFile, "test");

    // Test
    const size = await getFileSize(testFile);
    assertEquals(size, 4);

    // Cleanup
    await Deno.remove(testDir, { recursive: true });
  });
});

// Creating test directory in home for valid path tests
Deno.test("Path safety checks", async (t) => {
  const testDir = "./.test-dir";
  const sshDir = "./.ssh-test";

  // Setup
  try {
    await Deno.mkdir(testDir);
    await Deno.mkdir(sshDir);
  } catch {
    // Ignore
  }

  await t.step("allows paths within home directory", () => {
    assertEquals(pathIsLegal(testDir), true);
  });

  await t.step("blocks sensitive config directories", () => {
    assertThrows(
      () => pathIsLegal(sshDir),
      Error,
      "Path validation failed: Access denied: Cannot clean system configuration files",
    );
  });

  // Cleanup
  try {
    await Deno.remove(testDir, { recursive: true });
    await Deno.remove(sshDir, { recursive: true });
  } catch {
    // Ignore
  }
});
