"use client";

import { CONTACT_STATUS_OPTIONS, ContactStatus } from "@/lib/contactsData";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const FILTER_OPTIONS = ["전체", ...CONTACT_STATUS_OPTIONS];
type FilterStatus = "전체" | ContactStatus;

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("전체");
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "전체") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error("❌ 로드 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: ContactStatus) => {
    const { error } = await supabase
      .from("contacts")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchContacts();
  };

  const updateMemo = async (id: number, memo: string) => {
    await supabase.from("contacts").update({ admin_memo: memo }).eq("id", id);
  };

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  // 비율 계산용 클래스
  const colBase = "p-6 flex items-center "; // 패딩을 조금 더 늘려 가독성 확보
  const col1 = "w-[8.33%]";
  const col2 = "w-[16.66%]";
  const col3 = "w-[25%]";

  return (
    <div className="min-h-screen p-10 bg-gray-50 text-black">
      {/* 타이틀: 3.5rem (35px) */}
      <h1 className="text-admin-font-title font-extrabold mb-10">
        문의 내역 관리
      </h1>

      {/* 필터 탭: 2rem (20px) */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-4">
        {FILTER_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as FilterStatus)}
            className={`px-8 py-4 rounded-full text-admin-font-body font-semibold transition-all shadow-sm ${
              filter === status
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 데이터 테이블 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          {/* 헤더: 2rem (20px) */}
          <thead className="bg-gray-100 text-gray-800 text-admin-font-body font-bold">
            <tr className="flex w-full">
              <th className={`${colBase} ${col1}`}>날짜</th>
              <th className={`${colBase} ${col1}`}>이름(회사)</th>
              <th className={`${colBase} ${col2}`}>연락처</th>
              <th className={`${colBase} ${col2}`}>이메일</th>
              <th className={`${colBase} ${col3}`}>문의내용</th>
              <th className={`${colBase} ${col1} justify-center`}>상태</th>
              <th className={`${colBase} ${col2}`}>관리자 메모</th>
            </tr>
          </thead>
          <tbody className="block w-full max-h-[65vh] overflow-y-auto">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="flex w-full hover:bg-blue-50 items-stretch transition-colors border-b border-gray-300 last:border-0"
                /* 👆 items-stretch를 써야 옆 칸이 길어져도 내 칸 높이가 같이 늘어나서 안 깨져요! */
              >
                {/* 1. 날짜 */}
                <td
                  className={`${colBase} ${col1} flex-col !items-start !justify-start text-[var(--admin-font-small)] text-gray-400`}
                >
                  <span className="mt-2">
                    {contact.created_at?.split("T")[0]}
                  </span>
                </td>

                {/* 2. 이름/회사 */}
                <td
                  className={`${colBase} ${col1} flex-col !items-start !justify-start gap-2`}
                >
                  <div className="font-bold text-[var(--admin-font-body)] text-gray-900 mt-1">
                    {contact.name}
                  </div>
                  <div className="text-[var(--admin-font-small)] text-gray-400">
                    {contact.company || "-"}
                  </div>
                </td>

                {/* 3. 연락처 */}
                <td
                  className={`${colBase} ${col2} flex-col !items-start !justify-start text-[var(--admin-font-body)] font-medium text-blue-600`}
                >
                  <span className="mt-1">{contact.phone}</span>
                </td>

                {/* 4. 이메일 */}
                <td
                  className={`${colBase} ${col2} flex-col !items-start !justify-start text-[var(--admin-font-small)] break-all text-gray-600`}
                >
                  <span className="mt-1">{contact.email}</span>
                </td>

                {/* 5. 문의내용 (가장 길어질 수 있는 곳) */}
                <td
                  className={`${colBase} ${col3} flex-col !items-start !justify-start text-[var(--admin-font-body)] whitespace-pre-wrap break-all leading-relaxed text-gray-700`}
                >
                  <p className="mt-1">{contact.message}</p>
                </td>

                {/* 6. 상태 (셀렉트 박스) */}
                <td
                  className={`${colBase} ${col1} flex-col !items-center !justify-start`}
                >
                  <select
                    value={contact.status}
                    onChange={(e) =>
                      updateStatus(contact.id, e.target.value as ContactStatus)
                    }
                    className="rounded-xl p-3 text-[var(--admin-font-body)] w-full bg-white shadow-sm mt-1"
                  >
                    {CONTACT_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 7. 관리자 메모 */}
                <td
                  className={`${colBase} ${col2} flex-col !items-start !justify-start`}
                >
                  <textarea
                    defaultValue={contact.admin_memo}
                    onBlur={(e) => updateMemo(contact.id, e.target.value)}
                    className="px-4 py-3 text-admin-font-small size-full min-h-[100px] resize-none bg-gray-100 focus:bg-gray-300 outline-none transition-all mt-1"
                    placeholder="메모..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="p-20 text-center text-gray-400 text-admin-font-subtitle animate-pulse">
            데이터를 불러오는 중입니다...
          </div>
        )}
      </div>
    </div>
  );
}
