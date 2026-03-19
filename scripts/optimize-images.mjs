import path from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import sharp from "sharp";

/**
 * Image Optimization Constants
 */
const INPUT_ROOT = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1600;
const QUALITY = 80;

// Disable sharp cache to prevent file system locking issues
sharp.cache(false);

/**
 * Processes individual image files for resizing and compression.
 * @param {string} filePath - Absolute path to the image file.
 */
async function processImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
    
    if (!supportedFormats.includes(ext)) return;

    // Use Buffer to decouple file stream from processing
    const inputBuffer = await readFile(filePath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    if (metadata.width && metadata.width > MAX_WIDTH) {
      let pipeline = image
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true });

      // Format-specific optimization settings
      if (ext === '.png') {
        pipeline = pipeline.png({ quality: QUALITY, palette: true });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: QUALITY });
      } else {
        pipeline = pipeline.jpeg({ quality: QUALITY, progressive: true });
      }

      const outputBuffer = await pipeline.toBuffer();
      await writeFile(filePath, outputBuffer);

      console.log(`[SUCCESS] Optimized: ${path.basename(filePath)} (Resized to ${MAX_WIDTH}px)`);
    } else {
      console.log(`[SKIP] Already Optimized: ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error(`[ERROR] Processing failed for ${filePath}:`, err.message);
  }
}

/**
 * Recursively scans directory for image files (Manual mode).
 * @param {string} dir - Directory path to scan.
 */
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        await walk(fullPath);
      }
    } else {
      await processImage(fullPath);
    }
  }
}

/**
 * Main execution logic.
 * Supports both CLI arguments (lint-staged) and full directory scan.
 */
async function run() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    console.log(`[INFO] Processing ${args.length} staged images...`);
    for (const file of args) {
      const absolutePath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
      await processImage(absolutePath);
    }
  } else {
    console.log("[INFO] Starting full directory image optimization...");
    if (existsSync(INPUT_ROOT)) {
      await walk(INPUT_ROOT);
    } else {
      console.error(`[ERROR] Root directory not found: ${INPUT_ROOT}`);
    }
  }
  console.log("[INFO] Optimization process completed.");
}

run().catch((err) => {
  console.error("[FATAL] Unhandled Exception:", err);
  process.exit(1);
});