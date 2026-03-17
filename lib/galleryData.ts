import path from "node:path";
import { readdirSync } from "node:fs";

export interface GalleryImageItem {
  src: string;
  alt: string;
  fileName: string;
  subtitle: string;
  mainTitle: string;
}

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const IMAGE_FILE_REGEX = /\.(png|jpe?g|webp|avif|gif)$/i;

const GALLERY_TITLE_MAP: Record<string, { subtitle: string; mainTitle: string }> = {
  "anatoly-semenov-hCA4TCLW_60-unsplash": {
    subtitle: "ARCHIVE 01",
    mainTitle: "Stone Frame View",
  },
  "edgar-7Wk3JkfoiCw-unsplash": {
    subtitle: "ARCHIVE 02",
    mainTitle: "Soft Light Facade",
  },
  "eugenia-pan-kiv-alNEmvrLNC8-unsplash": {
    subtitle: "ARCHIVE 03",
    mainTitle: "Quiet Window Mood",
  },
  "khanh-do-uovcY2G02kU-unsplash": {
    subtitle: "ARCHIVE 04",
    mainTitle: "Blue Roof Line",
  },
  "krists-luhaers-FQltYYGT7xQ-unsplash": {
    subtitle: "ARCHIVE 05",
    mainTitle: "Garden Texture",
  },
  "lightman-qian-LnmdWBiTqLQ-unsplash": {
    subtitle: "ARCHIVE 06",
    mainTitle: "Still Exterior Form",
  },
  "livio-raschle-Giq-siiMv50-unsplash": {
    subtitle: "ARCHIVE 07",
    mainTitle: "Open Sky Angle",
  },
  "pesce-huang-8qrKdwezqS0-unsplash": {
    subtitle: "ARCHIVE 08",
    mainTitle: "Material Contrast Study",
  },
  "toxic-smoker-b38cJ0CCl4w-unsplash": {
    subtitle: "ARCHIVE 09",
    mainTitle: "Urban Passage Cut",
  },
  "yuri-krupenin-wSRuljSPrwQ-unsplash": {
    subtitle: "ARCHIVE 10",
    mainTitle: "Symmetric Front Scene",
  },
};

const formatAltFromFileName = (fileName: string) => {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const cleaned = baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `MIRACLE gallery ${cleaned}`;
};

const formatFallbackTitle = (fileName: string) => {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const cleaned = baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned
    .split(" ")
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getGalleryImages = (limit?: number): GalleryImageItem[] => {
  try {
    const files = readdirSync(GALLERY_DIR)
      .filter((fileName) => IMAGE_FILE_REGEX.test(fileName))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const selectedFiles = typeof limit === "number" ? files.slice(0, limit) : files;

    return selectedFiles.map((fileName) => {
      const baseName = fileName.replace(/\.[^.]+$/, "");
      return {
        subtitle: GALLERY_TITLE_MAP[baseName]?.subtitle ?? "MIRACLE ARCHIVE",
        mainTitle: GALLERY_TITLE_MAP[baseName]?.mainTitle ?? formatFallbackTitle(fileName),
        src: `/images/gallery/${fileName}`,
        alt: formatAltFromFileName(fileName),
        fileName,
      };
    });
  } catch {
    return [];
  }
};