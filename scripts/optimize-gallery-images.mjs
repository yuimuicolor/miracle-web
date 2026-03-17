import path from "node:path";
import { readdir, stat, unlink } from "node:fs/promises";
import sharp from "sharp";

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const SOURCE_REGEX = /\.(png|jpe?g|avif|gif|webp)$/i;

const isWebp = (name) => /\.webp$/i.test(name);
const getBaseName = (name) => name.replace(/\.[^.]+$/, "");

async function convertToWebp() {
  const files = await readdir(GALLERY_DIR);
  const targets = files.filter((name) => SOURCE_REGEX.test(name));

  if (targets.length === 0) {
    console.log("[gallery] convert target not found.");
    return;
  }

  const existingWebpBases = new Set(
    targets.filter((name) => isWebp(name)).map((name) => getBaseName(name)),
  );

  for (const fileName of targets) {
    if (isWebp(fileName)) {
      console.log(`[gallery] skip ${fileName} (already webp)`);
      continue;
    }

    const sourcePath = path.join(GALLERY_DIR, fileName);
    const parsed = path.parse(fileName);
    const outputPath = path.join(GALLERY_DIR, `${parsed.name}.webp`);

    // If a webp with the same basename already exists, drop the legacy source.
    if (existingWebpBases.has(parsed.name)) {
      await unlink(sourcePath);
      console.log(`[gallery] remove duplicate source ${fileName} (webp exists)`);
      continue;
    }

    const sourceInfo = await stat(sourcePath);

    await sharp(sourcePath)
      .rotate()
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);

    const outputInfo = await stat(outputPath);
    await unlink(sourcePath);
    existingWebpBases.add(parsed.name);

    console.log(
      `[gallery] ${fileName} -> ${path.basename(outputPath)} (${Math.round(sourceInfo.size / 1024)}KB -> ${Math.round(outputInfo.size / 1024)}KB)`,
    );
  }
}

convertToWebp().catch((error) => {
  console.error("[gallery] webp convert failed", error);
  process.exit(1);
});