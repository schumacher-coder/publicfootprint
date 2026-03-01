#!/usr/bin/env node
import { join } from 'path';
import sharp from 'sharp';
import { stat } from 'fs/promises';

const PORTRAITS_DIR = 'apps/main/public/images/portraits';
const MAX_WIDTH = 800; // Portraits brauchen keine 4K Auflösung!
const WEBP_QUALITY = 75; // Etwas höher für Portraits (Gesichtsdetails)

async function optimizePortrait() {
  const filename = 'thomas-portrait.jpg';
  const inputPath = join(PORTRAITS_DIR, filename);
  const outputPath = join(PORTRAITS_DIR, 'thomas-portrait.webp');

  console.log('📸 Optimizing portrait...\n');

  try {
    const originalStat = await stat(inputPath);
    const originalSize = originalStat.size;

    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const newStat = await stat(outputPath);
    const newSize = newStat.size;
    const savedPercent = Math.round(((originalSize - newSize) / originalSize) * 100);

    console.log(`   ✅ New size: ${(newSize / 1024).toFixed(0)} KB`);
    console.log(`   💾 Saved: ${savedPercent}%`);
    console.log('\n✨ Done! Portrait optimized from 4.0MB → ' + (newSize / 1024).toFixed(0) + 'KB! 🎉');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

optimizePortrait().catch(console.error);
