# Devclean

Devclean is a simple CLI-tool to clean up your development folders by removing all the unnecessary files and folders, like `node_modules`, `__pycache__`, `.DS_Store`, etc.

All you need to do is specify the path to the project you want cleaned, or a folder for reursive cleaning, and Devclean will take care of the rest.

## Installation
1. Compile to a binary using the following command:
```bash
deno task compile
```

2. Move the binary to a directory in your PATH, like `/usr/local/bin`:
```bash
mv out/devclean /usr/local/bin
```

## Usage
1. Run the tool and provide a project or a parent folder for recursive cleaning:
```bash
devclean <path>
```
2. Run through the prompts to confirm the deletion of the files and folders.


## Testing
The tests require --allow-read to properly test the file system operations.
To run the tests, use the following command:
```bash
deno test --allow-all
```