import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function walkDir(dir) {
  let files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await walkDir(fullPath));
    } else {
      if (fullPath.toLowerCase().endsWith('.png') || fullPath.toLowerCase().endsWith('.jpg') || fullPath.toLowerCase().endsWith('.jpeg')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function run() {
  const publicDir = path.join(process.cwd(), 'public');
  const files = await walkDir(publicDir);
  
  for (const file of files) {
    const parsed = path.parse(file);
    const newPath = path.join(parsed.dir, `${parsed.name}.webp`);
    console.log(`Converting ${file} to ${newPath}`);
    await sharp(file).webp({ quality: 80 }).toFile(newPath);
    await fs.unlink(file);
  }
}

run().catch(console.error);
