import { ensureDir, ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

/**
 * Set up a dummy folder structure for testing purposes.
 * This function will create a random folder structure with a mix of files and directories.
 *
 * @param basePath The base path where the structure should be created.
 */
export async function setUpDummyFolderStructureForTesting(
  basePath: string,
): Promise<void> {
  // We'll create an array of common project structures that we can randomly mix and match
  const projectTypes = [
    {
      name: "node-project",
      files: [
        "package.json",
        "package-lock.json",
        ".env",
        ".env.local",
        "README.md",
        ".eslintrc",
        "tsconfig.json",
      ],
      dirs: [
        "node_modules/lodash",
        "node_modules/express",
        "dist",
        "build",
        ".next",
        "coverage",
      ],
      gitignore: [
        "node_modules/",
        "dist/",
        "build/",
        ".next/",
        "coverage/",
        ".env.local",
        "*.log",
      ],
    },
    {
      name: "python-project",
      files: [
        "requirements.txt",
        "setup.py",
        ".env",
        "README.md",
        "pytest.ini",
      ],
      dirs: [
        "__pycache__",
        ".venv",
        "dist",
        ".pytest_cache",
        ".mypy_cache",
      ],
      gitignore: [
        "__pycache__/",
        ".venv/",
        "dist/",
        ".pytest_cache/",
        "*.pyc",
        "*.pyo",
      ],
    },
    {
      name: "rust-project",
      files: [
        "Cargo.toml",
        "Cargo.lock",
        "README.md",
      ],
      dirs: [
        "target/debug",
        "target/release",
      ],
      gitignore: [
        "target/",
        "Cargo.lock",
        "**/*.rs.bk",
      ],
    },
  ];

  // Helper function to create random content for files
  function generateRandomContent(): string {
    const contents = [
      "// This is a generated file\n",
      "# Configuration file\n",
      "/* Random content */\n",
      "// TODO: Update this file\n",
    ];
    return contents[Math.floor(Math.random() * contents.length)];
  }

  // Helper function to randomly decide whether to include something
  function shouldInclude(probability = 0.7): boolean {
    return Math.random() < probability;
  }

  // Helper function to create nested structure
  async function createNestedStructure(
    currentPath: string,
    depth: number = 0,
  ): Promise<void> {
    if (depth > 3) return; // Limit nesting depth

    // Randomly select a project type
    const projectType =
      projectTypes[Math.floor(Math.random() * projectTypes.length)];

    // Create .gitignore with project-specific patterns
    if (shouldInclude()) {
      await ensureFile(join(currentPath, ".gitignore"));
      await Deno.writeTextFile(
        join(currentPath, ".gitignore"),
        projectType.gitignore.join("\n"),
      );
    }

    // Create random files from the project type
    for (const file of projectType.files) {
      if (shouldInclude(0.6)) {
        await ensureFile(join(currentPath, file));
        await Deno.writeTextFile(
          join(currentPath, file),
          generateRandomContent(),
        );
      }
    }

    // Create directories and potentially nest more projects
    for (const dir of projectType.dirs) {
      if (shouldInclude(0.8)) {
        const dirPath = join(currentPath, dir);
        await ensureDir(dirPath);

        // Create some random files in the directory
        if (shouldInclude(0.7)) {
          await ensureFile(join(dirPath, "index.js"));
          await Deno.writeTextFile(
            join(dirPath, "index.js"),
            generateRandomContent(),
          );
        }
      }
    }

    // Create some nested project directories
    const subProjectNames = [
      "frontend",
      "backend",
      "lib",
      "core",
      "utils",
      "services",
    ];
    for (const subProject of subProjectNames) {
      if (shouldInclude(0.4)) { // Lower probability for nested projects
        const subPath = join(currentPath, subProject);
        await ensureDir(subPath);
        await createNestedStructure(subPath, depth + 1);
      }
    }

    // Add some log files randomly throughout the structure
    if (shouldInclude(0.3)) {
      const logFiles = ["debug.log", "error.log", "app.log", "test.log"];
      for (const logFile of logFiles) {
        if (shouldInclude(0.5)) {
          await ensureFile(join(currentPath, logFile));
          await Deno.writeTextFile(
            join(currentPath, logFile),
            `Log file created at ${new Date().toISOString()}\n`,
          );
        }
      }
    }
  }

  // Start creating the structure
  await ensureDir(basePath);
  await createNestedStructure(basePath);
}
