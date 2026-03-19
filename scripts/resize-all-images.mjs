import path from "node:path";
import { readdir, unlink, rename, mkdir } from "node:fs/promises"; // 비동기 함수 추가
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1600;

async function resizeWebp(filePath) {
  try {
    // 1. sharp 인스턴스를 만들고 metadata 읽기
    const image = sharp(filePath);
    const metadata = await image.metadata();

    if (metadata.width && metadata.width > MAX_WIDTH) {
      const tmpPath = filePath + ".tmp";

      // 2. 변환 후 파일 저장 (toBuffer나 toFile 사용)
      // .webp({ quality: 80 }) 설정을 추가하면 용량이 훨씬 더 최적화됩니다.
      await image
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 }) // 품질 설정 추가 (effort는 압축 효율)
        .toFile(tmpPath);

      // 3. 파일 교체 (비동기 처리 및 sharp 인스턴스 해제 보장)
      // sharp는 내부적으로 파일을 점유할 수 있으므로 작업 완료 후 교체하는 것이 안전합니다.
      await unlink(filePath);
      await rename(tmpPath, filePath);

      console.log(`✅ [webp-resize] ${path.basename(filePath)} 변환 완료 (1600px)`);
    } else {
      console.log(`⏩ [webp-resize] ${path.basename(filePath)} 건너뜀 (이미 작음)`);
    }
  } catch (err) {
    console.error(`❌ [webp-resize] 실패 - ${filePath}:`, err.message);
  }
}

// walk 함수는 누나가 작성하신 방식이 아주 좋습니다! 그대로 유지하되 비동기 제어만 확인하세요.
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.name.toLowerCase().endsWith('.webp')) {
      await resizeWebp(fullPath);
    }
  }
}

console.log("🚀 이미지 최적화 시작...");
walk(ROOT)
  .then(() => console.log("✨ 모든 WebP 이미지 처리가 끝났어요, 유이 누나!"))
  .catch((err) => {
    console.error("🚨 치명적 에러:", err);
    process.exit(1);
  });