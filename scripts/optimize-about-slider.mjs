import path from "node:path";
import { readdir, stat, unlink } from "node:fs/promises";
import sharp from "sharp";

const ABOUT_DIR = path.join(process.cwd(), "public", "images", "about-slider");
const SOURCE_REGEX = /\.(png|jpe?g|avif|gif|webp)$/i;

async function convertToWebp() {
  const files = await readdir(ABOUT_DIR);
  const targets = files.filter((name) => SOURCE_REGEX.test(name));

  if (targets.length === 0) {
    console.log("[about-slider] convert target not found.");
    return;
  }

  for (const fileName of targets) {
    if (/\.webp$/i.test(fileName)) {
      console.log(`[about-slider] skip ${fileName} (already webp)`);
      continue;
    }

    const sourcePath = path.join(ABOUT_DIR, fileName);
    const parsed = path.parse(fileName);
    const outputPath = path.join(ABOUT_DIR, `${parsed.name}.webp`);

    const sourceInfo = await stat(sourcePath);
    await sharp(sourcePath)
      .rotate()
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);

    const outputInfo = await stat(outputPath);

    await unlink(sourcePath);

    console.log(
      `[about-slider] ${fileName} -> ${path.basename(outputPath)} (${Math.round(sourceInfo.size / 1024)}KB -> ${Math.round(outputInfo.size / 1024)}KB)`
    );
  }
}

convertToWebp().catch((error) => {
  console.error("[about-slider] webp convert failed", error);
  process.exit(1);
});
