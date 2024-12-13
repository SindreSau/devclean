# Devclean

Devclean is a simple CLI-tool to clean up your development folders by removing all the unnecessary files and folders, like `node_modules`, `__pycache__`, `.DS_Store`, etc.

All you need to do is specify the path to the project you want cleaned, or a folder for reursive cleaning, and Devclean will take care of the rest.

## Installation
1. Compile to a binary using the following command:
```bash
deno compile --allow-read --allow-write -o devclean main.ts
```

2. Move the binary to a directory in your PATH, like `/usr/local/bin`:
```bash
mv devclean /usr/local/bin
```

## Usage
```bash
devclean <path>
```