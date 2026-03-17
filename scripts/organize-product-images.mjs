import path from "node:path";
import { access, mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "lib", "productsData.ts");
const PUBLIC_PATH = path.join(ROOT, "public");

const PRODUCT_IMAGE_MIN_COUNT = 1;
const PRODUCT_IMAGE_MAX_COUNT = 10;
const PRODUCT_IMAGE_SET_REGEX =
  /\.\.\.buildProductImageSet\("(product-\d+)",\s*(\d+),\s*(\d+)\)/g;

const ensureImageCountInRange = (count, label) => {
  if (count < PRODUCT_IMAGE_MIN_COUNT || count > PRODUCT_IMAGE_MAX_COUNT) {
    throw new Error(
      `[products] ${label} count must be between ${PRODUCT_IMAGE_MIN_COUNT} and ${PRODUCT_IMAGE_MAX_COUNT}. Received: ${count}`,
    );
  }
};

const toLegacyFlatSourcePath = (productId) =>
  path.join(PUBLIC_PATH, "images", "products", `${productId}.webp`);

const toOutputPath = (productId, group, index) => {
  const fileName = `${String(index + 1).padStart(2, "0")}.webp`;
  return path.join(PUBLIC_PATH, "images", "products", productId, group, fileName);
};

async function fileExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function convertList({ productId, group, count }) {
  const targetDir = path.join(PUBLIC_PATH, "images", "products", productId, group);
  await mkdir(targetDir, { recursive: true });

  ensureImageCountInRange(count, `${productId}/${group}`);

  const fallbackSourcePath = toLegacyFlatSourcePath(productId);

  if (!(await fileExists(fallbackSourcePath))) {
    throw new Error(
      `[products] fallback source not found: ${fallbackSourcePath}. Keep legacy flat image to bootstrap missing files.`,
    );
  }

  for (let i = 0; i < count; i += 1) {
    const outputPath = toOutputPath(productId, group, i);

    if (await fileExists(outputPath)) {
      console.log(`[products] skip existing ${productId}/${group}/${String(i + 1).padStart(2, "0")}.webp`);
      continue;
    }

    await sharp(fallbackSourcePath)
      .rotate()
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);

    console.log(
      `[products] ${productId}/${group}/${String(i + 1).padStart(2, "0")}.webp <= ${path.basename(fallbackSourcePath)}`,
    );
  }
}

async function run() {
  const dataText = await readFile(DATA_PATH, "utf8");
  const products = [];
  let match;

  while ((match = PRODUCT_IMAGE_SET_REGEX.exec(dataText)) !== null) {
    const productId = match[1];
    const thumbnailCount = Number(match[2]);
    const detailCount = Number(match[3]);

    products.push({ productId, thumbnailCount, detailCount });
  }

  if (products.length === 0) {
    throw new Error("No product image sets found in lib/productsData.ts");
  }

  for (const product of products) {
    await convertList({
      productId: product.productId,
      group: "thumb",
      count: product.thumbnailCount,
    });

    await convertList({
      productId: product.productId,
      group: "detail",
      count: product.detailCount,
    });
  }

  console.log(`[products] organized ${products.length} products`);
}

run().catch((error) => {
  console.error("[products] organize failed", error);
  process.exit(1);
});
