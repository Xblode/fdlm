import fs from 'fs/promises';
import path from 'path';

async function walkDir(dir) {
  let files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
      files = files.concat(await walkDir(fullPath));
    } else if (entry.isFile()) {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function run() {
  const files = await walkDir(process.cwd());
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const newContent = content.replace(/\.png/g, '.webp').replace(/\.jpg/g, '.webp').replace(/\.jpeg/g, '.webp');
    if (content !== newContent) {
      console.log(`Updating references in ${file}`);
      await fs.writeFile(file, newContent, 'utf-8');
    }
  }
}

run().catch(console.error);
