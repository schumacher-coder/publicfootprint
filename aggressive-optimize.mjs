#!/usr/bin/env node
import { join } from 'path';
import sharp from 'sharp';
import { stat } from 'fs/promises';

const IMAGES_DIR = 'apps/main/public/images/visuals';
const MAX_WIDTH = 1280; // Kleiner für Mobile!
const WEBP_QUALITY = 60; // Aggressiv komprimiert!

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
    const originalStat = await stat(inputPath);
    const originalSize = originalStat.size;

    console.log(`   Original: ${(originalSize / 1024).toFixed(0)} KB`);

    // Re-optimize with aggressive settings
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(tempPath);

    const newStat = await stat(tempPath);
    const newSize = newStat.size;
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
  console.log('🚀 AGGRESSIVE mobile optimization...\n');
  console.log(`Settings: Max width ${MAX_WIDTH}px, WebP quality ${WEBP_QUALITY}`);
  console.log('🎯 Target: <200KB per image!\n');

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
    console.log('\n✨ Done! Hero images are now mobile-optimized! 🚀📱');
  }
}

main().catch(console.error);
