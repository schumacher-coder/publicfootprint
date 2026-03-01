#!/usr/bin/env node
import { join } from 'path';
import sharp from 'sharp';

const IMAGES_DIR = 'apps/main/public/images/visuals';
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 65; // Noch niedriger für Hero-Bilder!

const webpToReoptimize = [
  'stoneage.webp',
  'windingroad.webp',
  'moon.webp',
  'berlinwall.webp'
];

async function reoptimizeWebP(filename) {
  const inputPath = join(IMAGES_DIR, filename);
  const tempPath = join(IMAGES_DIR, filename + '.tmp');

  console.log(`\n📸 Re-optimizing: ${filename}`);

  try {
    const originalStats = await sharp(inputPath).metadata();
    const originalSize = originalStats.size;

    console.log(`   Original: ${(originalSize / 1024).toFixed(0)} KB`);

    // Re-optimize with lower quality
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(tempPath);

    const newStats = await sharp(tempPath).metadata();
    const newSize = newStats.size;
    const savedPercent = Math.round(((originalSize - newSize) / originalSize) * 100);

    console.log(`   ✅ New size: ${(newSize / 1024).toFixed(0)} KB`);
    console.log(`   💾 Saved: ${savedPercent}%`);

    // Replace original
    await sharp(tempPath).toFile(inputPath);

    // Delete temp file
    const { unlink } = await import('fs/promises');
    await unlink(tempPath);

    return { filename, originalSize, newSize, savedPercent };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Re-optimizing WebP images for better mobile performance...\n');
  console.log(`Settings: Max width ${MAX_WIDTH}px, WebP quality ${WEBP_QUALITY}`);

  const results = [];

  for (const filename of webpToReoptimize) {
    const result = await reoptimizeWebP(filename);
    if (result) results.push(result);
  }

  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
    const totalSaved = Math.round(((totalOriginal - totalNew) / totalOriginal) * 100);

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   Total original: ${(totalOriginal / 1024).toFixed(0)} KB`);
    console.log(`   Total optimized: ${(totalNew / 1024).toFixed(0)} KB`);
    console.log(`   Total saved: ${totalSaved}%`);
    console.log('='.repeat(50));
    console.log('\n✨ Done! Your Hero images should now load MUCH faster on mobile! 🚀');
  }
}

main().catch(console.error);
