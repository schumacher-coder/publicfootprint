#!/usr/bin/env node
import { join } from 'path';
import sharp from 'sharp';
import { stat } from 'fs/promises';

const IMAGES_DIR = 'apps/main/public/images/visuals';
const MAX_WIDTH = 1024; // Noch kleiner für Mobile!
const WEBP_QUALITY = 55; // Ultra-aggressiv!

async function optimizeStoneage() {
  const filename = 'stoneage.webp';
  const inputPath = join(IMAGES_DIR, filename);
  const tempPath = join(IMAGES_DIR, filename + '.tmp');

  console.log('🎯 ULTRA-aggressive optimization for stoneage.webp...\n');
  console.log(`Settings: Max width ${MAX_WIDTH}px, WebP quality ${WEBP_QUALITY}\n`);

  try {
    const originalStat = await stat(inputPath);
    const originalSize = originalStat.size;

    console.log(`   Original: ${(originalSize / 1024).toFixed(0)} KB`);

    // Ultra-aggressive optimization
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

    console.log('\n✨ Done! stoneage.webp is now mobile-optimized! 🚀');
    console.log(`🎯 Target achieved: ${(newSize / 1024).toFixed(0)}KB (was ${(originalSize / 1024).toFixed(0)}KB)`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

optimizeStoneage().catch(console.error);
