import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration: folders to scan inside `public`
const publicDir = path.resolve(__dirname, '..', 'public');
const scanDirs = [
  'images',
  'audio',
  'videos',
  'gallery'
];

const imageExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const videoExt = ['.mp4', '.webm', '.ogg', '.mov'];
const audioExt = ['.mp3', '.wav', '.ogg', '.m4a'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function relativeUrl(filePath) {
  // Make URL relative to public root (leading slash)
  const rel = path.relative(publicDir, filePath).split(path.sep).join('/');
  return `/${rel}`;
}

const assets = [];

scanDirs.forEach((dir) => {
  const abs = path.join(publicDir, dir);
  if (!fs.existsSync(abs)) return;
  const files = walk(abs);
  files.forEach((f) => {
    const ext = path.extname(f).toLowerCase();
    let type = null;
    if (imageExt.includes(ext)) type = 'image';
    else if (videoExt.includes(ext)) type = 'video';
    else if (audioExt.includes(ext)) type = 'audio';
    if (!type) return;
    assets.push({
      url: relativeUrl(f),
      name: path.basename(f),
      type,
      size: fs.statSync(f).size
    });
  });
});

// Ensure public/gallery directory exists
const galleryPublicDir = path.join(publicDir, 'gallery');
if (!fs.existsSync(galleryPublicDir)) fs.mkdirSync(galleryPublicDir, { recursive: true });

const outPath = path.join(galleryPublicDir, 'index.json');
fs.writeFileSync(outPath, JSON.stringify(assets, null, 2), 'utf8');
console.log(`Wrote ${assets.length} assets to ${outPath}`);
