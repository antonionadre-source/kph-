import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const PUBLIC_DIR = 'public';
const IMG_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif', '.bmp'];

// 1x1 transparent PNG base64
const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// 1x1 transparent WebP base64
const TINY_WEBP_BASE64 = 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAAAAAAAAAAAAQUxQSAwIAAAAAAFZQOCgAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';

function realType(buf: Buffer): string {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'webp';
  if (buf[0] === 0xef && buf[1] === 0xbf && buf[2] === 0xbd) return 'CORRUPTO';
  return 'ok';
}

const images = readdirSync(PUBLIC_DIR)
  .filter(n => IMG_EXT.includes(extname(n).toLowerCase()));

let fixedCount = 0;
for (const name of images) {
  const full = join(PUBLIC_DIR, name);
  const buf = readFileSync(full);
  const ext = extname(name).toLowerCase().slice(1);
  const tipo = realType(buf);

  if (tipo === 'CORRUPTO' || buf.length <= 100) {
    console.log(`Fixing corrupted file: ${name} (size: ${buf.length}B)`);
    if (ext === 'webp') {
      writeFileSync(full, Buffer.from(TINY_WEBP_BASE64, 'base64'));
    } else {
      writeFileSync(full, Buffer.from(TINY_PNG_BASE64, 'base64'));
    }
    fixedCount++;
  }
}

console.log(`Done! Fixed ${fixedCount} corrupted images.`);
