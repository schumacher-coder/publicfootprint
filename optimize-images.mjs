#!/usr/bin/env node
import { readdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const IMAGES_DIR = 'apps/main/public/images/visuals';
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

const imagesToOptimize = [
  'berlinwall.jpg',
  'moon.jpg',
  'stoneage.jpg',
  'windingroad.jpg'
];

async function optimizeImage(filename) {
  const inputPath = join(IMAGES_DIR, filename);
  const outputFilename = filename.replace(/\.jpg$/, '.webp');
  const outputPath = join(IMAGES_DIR, outputFilename);

  console.log(`\n📸 Optimizing: ${filename}`);

  try {
    const stats = await sharp(inputPath).metadata();
    console.log(`   Original: ${stats.width}x${stats.height}, ${stats.format}`);

    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const originalSize = (await sharp(inputPath).metadata()).size;
    const newSize = (await sharp(outputPath).metadata()).size;
    const savedPercent = Math.round(((originalSize - newSize) / originalSize) * 100);

    console.log(`   ✅ Saved to: ${outputFilename}`);
    console.log(`   📊 Size: ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(newSize / 1024).toFixed(0)} KB`);
    console.log(`   💾 Saved: ${savedPercent}%`);

    return { filename, originalSize, newSize, savedPercent };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`Settings: Max width ${MAX_WIDTH}px, WebP quality ${WEBP_QUALITY}`);

  const results = [];

  for (const filename of imagesToOptimize) {
    const result = await optimizeImage(filename);
    if (result) results.push(result);
  }

  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
    const totalSaved = Math.round(((totalOriginal - totalNew) / totalOriginal) * 100);

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Total optimized: ${(totalNew / 1024).toFixed(0)} KB`);
    console.log(`   Total saved: ${totalSaved}%`);
    console.log('='.repeat(50));
    console.log('\n✨ Done! Check the .webp files in:', IMAGES_DIR);
    console.log('\n💡 Next steps:');
    console.log('   1. Test the .webp images in your app');
    console.log('   2. If happy, delete the old .jpg files');
    console.log('   3. Update image references to .webp');
  }
}

main().catch(console.error);
