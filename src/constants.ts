import chalk from "chalk";

export const LANGUAGES = {
  javascript: {
    dirs: [
      "node_modules",
      "dist",
      "build",
      ".next",
      "out",
      ".nuxt",
      ".output",
      ".cache",
      "coverage",
      ".turbo",
      ".svelte-kit",
      "storybook-static",
      ".angular",
      ".expo",
      ".yarn",
    ],
    color: chalk.yellow,
    icon: "🟨",
  },
  python: {
    dirs: [
      "__pycache__",
      "dist",
      "build",
      ".tox",
      ".pytest_cache",
      ".mypy_cache",
      ".coverage",
      "venv",
      ".venv",
      ".ipynb_checkpoints",
    ],
    color: chalk.cyan,
    icon: "🐍",
  },
  java: {
    dirs: [
      "target",
      "build",
      "out",
      ".gradle",
      "bin",
      ".settings",
      ".classpath",
      ".project",
      "*.class",
    ],
    color: chalk.red,
    icon: "☕",
  },
  rust: {
    dirs: [
      "target",
      "Cargo.lock",
      "debug",
      "release",
    ],
    color: chalk.magenta,
    icon: "🦀",
  },
  go: {
    dirs: [
      "bin",
      "pkg",
      "vendor",
      "dist",
    ],
    color: chalk.cyan,
    icon: "🐹",
  },
  common: {
    dirs: [
      ".DS_Store",
      ".env.local",
      ".env.*.local",
      "tmp",
      "temp",
      "logs",
      "*.log",
      ".history",
    ],
    color: chalk.gray,
    icon: "📁",
  },
};

export const ILLEGAL_PATHS = [
  "/", // Root directory
  "/bin", // System binaries
  "/boot", // Bootloader files
  "/dev", // Device files
  "/etc", // System configuration files
  "/home", // Home directories
  "/lib", // Shared libraries
  "/lib64", // 64-bit libraries
  "/mnt", // Mount points
  "/opt", // Optional software
  "/proc", // Process files
  "/root", // Root user directory
  "/run", // Runtime data
  "/sbin", // System binaries
  "/srv", // Server data
  "/sys", // System files
  "/tmp", // Temporary files
  "/usr", // User programs
  "/var", // Variable data

  //Apple specific
  "/Applications", // Applications
  "/Library", // System library
  "/Network", // Network mounts
  "/System", // System files
  "/Users", // User directories
  "/Volumes", // Mounted volumes
];
