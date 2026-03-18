import path from "node:path";
import { readdir, stat, unlink } from "node:fs/promises";
import sharp from "sharp";

const ABOUT_DIR = path.join(process.cwd(), "public", "images", "about-us");
const SOURCE_REGEX = /\.(png|jpe?g|avif|gif)$/i;

async function convertToWebp() {
  const files = await readdir(ABOUT_DIR);
  const targets = files.filter((name) => SOURCE_REGEX.test(name));

  if (targets.length === 0) {
    console.log("[about-images] convert target not found.");
    return;
  }

  for (const fileName of targets) {
    const sourcePath = path.join(ABOUT_DIR, fileName);
    const parsed = path.parse(fileName);
    const outputPath = path.join(ABOUT_DIR, `${parsed.name}.webp`);

    const sourceInfo = await stat(sourcePath);
    await sharp(sourcePath)
      .rotate()
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    const outputInfo = await stat(outputPath);
    const saving = (
      ((sourceInfo.size - outputInfo.size) / sourceInfo.size) *
      100
    ).toFixed(1);
    console.log(
      `[about-images] ${fileName} → ${parsed.name}.webp  (${saving}% smaller)`
    );

    await unlink(sourcePath);
    console.log(`[about-images] deleted original: ${fileName}`);
  }

  console.log("[about-images] done.");
}

convertToWebp().catch((err) => {
  console.error("[about-images] error:", err);
  process.exit(1);
});
