import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", "node_modules", "assets"]);
const scannedExtensions = new Set([".js", ".html", ".css", ".md", ".json", ".example"]);
const findings = [];

const suspiciousPatterns = [
  { name: "possible private key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "hardcoded token", pattern: /(?:token|secret|password|api[_-]?key)\s*[:=]\s*["'][^"']{8,}["']/i },
  { name: "inline event handler", pattern: /\son[a-z]+\s*=\s*["']/i },
  { name: "dangerous eval", pattern: /\beval\s*\(/ },
  { name: "innerHTML assignment", pattern: /\.innerHTML\s*=/ },
];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) {
      continue;
    }

    const path = resolve(directory, entry);

    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }

    const extension = extname(path);

    if (!scannedExtensions.has(extension) && !entry.endsWith(".example")) {
      continue;
    }

    const content = readFileSync(path, "utf8");

    suspiciousPatterns.forEach(({ name, pattern }) => {
      if (pattern.test(content)) {
        findings.push(`${path.replace(root + "/", "")}: ${name}`);
      }
    });
  }
}

walk(root);

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log("Basic security scan passed.");
