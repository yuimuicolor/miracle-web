export const CONTACT_STATUS_OPTIONS = [
  '미확인',
  '진행중',
  '진행취소',
  '진행완료',
  '보류',
] as const;

export type ContactStatus = (typeof CONTACT_STATUS_OPTIONS)[number];

export interface ContactData {
  idx: number;          // 고유 인덱스
  id: number;           // ID
  created_at: string;   // 생성일 (ISO string)
  updated_at: string;   // 수정일 (ISO string)
  name: string;         // 이름
  phone: string;        // 연락처
  email: string;        // 이메일
  company: string;      // 회사명
  message: string;      // 문의 내용
  status: ContactStatus; // 상태 (정의한 유니온 타입 사용)
  admin_memo: string;   // 관리자 메모
}

/**
 * 데이터 업데이트 시 사용할 수 있는 Partial 타입
 * (업데이트 시 특정 필드만 넘길 때 유용함)
 */
export type ContactUpdatePayload = Partial<Pick<ContactData, 'status' | 'admin_memo'>>;