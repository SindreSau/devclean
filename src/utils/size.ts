/**
 * Format the size of a file in bytes to a human-readable format.
 * 
 * @param bytes The size of the file in bytes.
 */
function formatSize(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + sizes[i];
}

export { formatSize };