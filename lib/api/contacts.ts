import { ContactInput, ContactStatus, FilterStatus } from "@/lib/types/contact";

interface ContactsResponse {
  data: any[];
  count: number;
}

export const getContacts = async (params: {
  status: FilterStatus;
  page: number;
  limit: number;
  sortOrder: "asc" | "desc";
}): Promise<ContactsResponse> => {
  const queryParams = new URLSearchParams({
    status: params.status,
    page: String(params.page),
    limit: String(params.limit),
    sortOrder: params.sortOrder,
  });

  const res = await fetch(`/api/contacts?${queryParams}`);
  if (!res.ok) throw new Error("문의 목록을 불러오는데 실패했습니다.");
  return res.json();
};

// 2. PATCH: 단일 업데이트와 일괄 업데이트를 하나의 함수로 통합
export const updateContactsApi = async (payload: {
  id?: number;
  ids?: number[];
  updates: {
    status?: ContactStatus;
    adminMemo?: string;
    [key: string]: any; 
  };
}) => {
  const res = await fetch("/api/contacts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("수정에 실패했습니다.");
  return res.json();
};

// 3. POST: 신규 등록
export const createContact = async (formData: ContactInput, token: string) => {
  const res = await fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, status: "미확인" as ContactStatus, token }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "처리 중 오류가 발생했습니다.");
  }
  return res.json();
};