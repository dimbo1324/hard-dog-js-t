import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(root, "src");
const importPattern = /import\s+(?:[^"']+?\s+from\s+)?["']([^"']+)["']/g;
const errors = [];

function listJavaScriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);

    if (statSync(path).isDirectory()) {
      return listJavaScriptFiles(path);
    }

    return extname(path) === ".js" ? [path] : [];
  });
}

for (const filePath of listJavaScriptFiles(sourceRoot)) {
  const content = readFileSync(filePath, "utf8");
  let match;

  while ((match = importPattern.exec(content)) !== null) {
    const importPath = match[1];

    if (!importPath.startsWith(".")) {
      continue;
    }

    const resolvedPath = resolve(dirname(filePath), importPath);

    if (!existsSync(resolvedPath)) {
      errors.push(`${filePath.replace(root + "/", "")}: missing ${importPath}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Import paths are valid.");
