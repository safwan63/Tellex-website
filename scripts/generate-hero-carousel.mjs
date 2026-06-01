/**
 * Optional: centre-crop desktop PNGs into mobile-ratio PNGs.
 * Prefer exporting mobile art manually at 780×676 or 1560×1352 (390∶338).
 */
import sharp from 'sharp';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../public/images');

const MOBILE_W = 1560;
const MOBILE_H = 1352;

for (const name of ['b1', 'b2', 'b3']) {
  const input = path.join(imagesDir, `${name}.png`);
  const output = path.join(imagesDir, `${name}-mobile.png`);

  if (!existsSync(input)) {
    console.warn(`Skip ${name}: missing ${input}`);
    continue;
  }

  await sharp(input)
    .resize(MOBILE_W, MOBILE_H, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toFile(output);

  const meta = await sharp(output).metadata();
  console.log(`✓ ${name}-mobile.png → ${meta.width}×${meta.height}`);
}

console.log('\nMobile ratio: 390∶338. Desktop ratio: 1336∶409.');
