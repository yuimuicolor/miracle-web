import path from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises"; // readFile, writeFile 추가
import { existsSync } from "node:fs";
import sharp from "sharp";

// 1. 설정값
const INPUT_ROOT = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1600;
const QUALITY = 80;

// Sharp 캐시를 꺼서 파일 점유 문제를 원천 차단합니다.
sharp.cache(false);

async function processImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    // 처리 가능한 확장자 체크
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

    // [핵심] 파일을 Buffer로 먼저 읽어서 sharp와 파일 시스템 간의 연결을 끊습니다.
    const inputBuffer = await readFile(filePath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    // 너비가 1600px보다 큰 경우에만 리사이징
    if (metadata.width && metadata.width > MAX_WIDTH) {
      let pipeline = image
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true });

      // 포맷별 최적화 설정
      if (ext === '.png') {
        pipeline = pipeline.png({ quality: QUALITY, palette: true });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: QUALITY });
      } else {
        pipeline = pipeline.jpeg({ quality: QUALITY, progressive: true });
      }

      // [핵심] 결과물도 Buffer로 받은 뒤, 파일을 직접 덮어씁니다.
      const outputBuffer = await pipeline.toBuffer();
      await writeFile(filePath, outputBuffer);

      console.log(`✅ [성공] ${path.relative(INPUT_ROOT, filePath)} (최적화 완료)`);
    } else {
      console.log(`⏩ [스킵] ${path.relative(INPUT_ROOT, filePath)} (이미 최적화됨)`);
    }
  } catch (err) {
    console.error(`❌ [에러] ${path.relative(INPUT_ROOT, filePath)}:`, err.message);
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // 'optimized' 같은 임시 폴더가 있다면 제외 (무한 루프 방지)
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        await walk(fullPath);
      }
    } else {
      await processImage(fullPath);
    }
  }
}

// 스크립트 실행
console.log("🚀 이미지 최적화 작업을 시작합니다 (Buffer 모드)...");

if (existsSync(INPUT_ROOT)) {
  walk(INPUT_ROOT)
    .then(() => {
      console.log("\n✨ 모든 이미지 처리가 끝났어요.");
    })
    .catch((err) => {
      console.error("🚨 실행 중 치명적 오류 발생:", err);
    });
} else {
  console.error(`🚨 경로를 찾을 수 없습니다: ${INPUT_ROOT}`);
}