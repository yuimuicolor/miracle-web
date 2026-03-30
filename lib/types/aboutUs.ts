export interface HistoryItem {
  id: number;
  year: string;
  date: string;
  title: string;
  imageUrl: string;
  previewUrl?: string; // 새로 업로드한 이미지 미리보기용
  tempFile?: File; // 새로 업로드한 이미지 파일
  isVisible: boolean; // 진열 여부
  displayOrder: number; // 진열 순서
  isNew?: boolean; // 새로 추가된 아이템 여부 (백엔드에 저장되지 않은 상태)
  isDeleted?: boolean; // 삭제 토글 상태
}

export interface CertificateItem {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
  previewUrl?: string; // 새로 업로드한 이미지 미리보기용
  tempFile?: File; // 새로 업로드한 이미지 파일
  isVisible: boolean; // 진열 여부
  displayOrder: number; // 진열 순서
  isNew?: boolean; // 새로 추가된 아이템 여부 (백엔드에 저장되지 않은 상태)
  isDeleted?: boolean; // 삭제 토글 상태
}
