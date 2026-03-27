export interface GalleryItem {
  id: number;
  createdAt?: string;
  subtitle: string;
  mainTitle: string;
  imageUrl: string; // DB에 저장된 실제 경로 또는 URL
  isVisible: boolean;
  displayOrder: number;
  // 관리자 UI 전용 상태 (Optional)
  isDeleted?: boolean;
  isNew?: boolean;
  previewUrl?: string;
  tempFile?: File;
}


export interface GalleryPageGridItem {
  imageUrl: string;
  subtitle: string;
  mainTitle: string;
}
