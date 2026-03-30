export const CONTACT_STATUS_OPTIONS = [
  '미확인',
  '진행중',
  '진행취소',
  '진행완료',
  '보류',
] as const;
export type ContactStatus = (typeof CONTACT_STATUS_OPTIONS)[number];

export const FILTER_OPTIONS = ["전체", ...CONTACT_STATUS_OPTIONS];
export type FilterStatus = "전체" | ContactStatus;

export interface ContactItem {
  idx: number;          // 고유 인덱스
  id: number;           // ID
  createdAt: string;   // 생성일 (ISO string)
  name: string;         // 이름
  phone: string;        // 연락처
  email: string;        // 이메일
  company: string;      // 회사명
  message: string;      // 문의 내용
  status: ContactStatus; // 상태 (정의한 유니온 타입 사용)
  adminMemo: string;   // 관리자 메모
}

export type ContactUpdatePayload = Partial<Pick<ContactItem, 'status' | 'adminMemo'>>;

export type ContactInput = Pick<
  ContactItem,
  "name" | "phone" | "email" | "company" | "message"
>;