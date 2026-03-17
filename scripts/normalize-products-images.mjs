import path from "node:path";
import { readdir, stat, unlink, rename, writeFile } from "node:fs/promises";
import sharp from "sharp";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "images", "products");
const PRODUCTS_DATA_FILE = path.join(process.cwd(), "lib", "productsData.ts");
const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|avif|gif)$/i;

const pad = (num) => String(num).padStart(2, "0");

const buildProductsData = (count) => {
  const items = Array.from({ length: count }, (_, index) => {
    const order = pad(index + 1);
    return `  {\n    id: "product-${order}",\n    brandEn: "BRAND ${order}",\n    brandKo: "브랜드${order}",\n    image: "/images/products/product-${order}.webp",\n  },`;
  }).join("\n");

  return `export interface ProductItem {\n  id: string;\n  brandEn: string;\n  brandKo: string;\n  image: string;\n}\n\nexport const PRODUCTS: ProductItem[] = [\n${items}\n];\n`;
};

async function main() {
  const entries = await readdir(PRODUCTS_DIR);
  const imageFiles = entries
    .filter((file) => IMAGE_EXT_REGEX.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (imageFiles.length === 0) {
    console.log("[products] no image files found");
    return;
  }

  const tempTargets = [];

  for (const [index, file] of imageFiles.entries()) {
    const order = pad(index + 1);
    const mappedName = `product-${order}`;
    const sourcePath = path.join(PRODUCTS_DIR, file);
    const tempPath = path.join(PRODUCTS_DIR, `__tmp__${mappedName}.webp`);

    const srcInfo = await stat(sourcePath);

    await sharp(sourcePath)
      .rotate()
      .webp({ quality: 82, effort: 4 })
      .toFile(tempPath);

    tempTargets.push({ sourcePath, tempPath, mappedName, originalFile: file, srcInfo });
  }

  for (const item of tempTargets) {
    await unlink(item.sourcePath);
  }

  for (const item of tempTargets) {
    const finalPath = path.join(PRODUCTS_DIR, `${item.mappedName}.webp`);
    await rename(item.tempPath, finalPath);

    const outInfo = await stat(finalPath);

    console.log(`[products] ${item.originalFile} -> ${item.mappedName}.webp (${Math.round(item.srcInfo.size / 1024)}KB -> ${Math.round(outInfo.size / 1024)}KB)`);
  }

  const productsDataContent = buildProductsData(tempTargets.length);
  await writeFile(PRODUCTS_DATA_FILE, productsDataContent, "utf8");
  console.log(`[products] generated productsData.ts with ${tempTargets.length} items`);
}

main().catch((error) => {
  console.error("[products] normalize failed", error);
  process.exit(1);
});
