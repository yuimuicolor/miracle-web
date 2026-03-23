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
  
  // 1. 추가 기능용 상태들
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // 날짜 정렬
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // 일괄 선택
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null); // 현재 수정 중인 메모 ID
  const [tempMemo, setTempMemo] = useState(""); // 수정 중인 임시 텍스트

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: sortOrder === "asc" });

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

  // 2. 상태 변경 (단일)
  const updateStatus = async (id: number, newStatus: ContactStatus) => {
    const { error } = await supabase.from("contacts").update({ status: newStatus }).eq("id", id);
    if (!error) fetchContacts();
  };

  // 3. 일괄 상태 변경
  const handleBulkUpdate = async (newStatus: ContactStatus) => {
    if (selectedIds.length === 0) return alert("선택된 항목이 없습니다.");
    if (!confirm(`${selectedIds.length}개의 항목을 '${newStatus}' 상태로 변경할까요?`)) return;

    const { error } = await supabase.from("contacts").update({ status: newStatus }).in("id", selectedIds);
    if (!error) {
      setSelectedIds([]);
      fetchContacts();
    }
  };

  // 4. 메모 저장 기능
  const saveMemo = async (id: number) => {
    const { error } = await supabase.from("contacts").update({ admin_memo: tempMemo }).eq("id", id);
    if (!error) {
      setEditingMemoId(null);
      fetchContacts();
    }
  };

  useEffect(() => { fetchContacts(); }, [filter, sortOrder]);

  // 체크박스 핸들러
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const colBase = "p-6 flex ";
  const colCheck = "w-[4%]"; // 체크박스용
  const col1 = "w-[8.33%]";
  const col2 = "w-[16.66%]";
  const col3 = "w-[21%]"; // 비율 조정

  return (
    <div className="min-h-screen p-10 text-black">
      <h2 className="text-admin-title font-bold mb-10">문의 내역 관리</h2>
      <div className="flex flex-col gap-6 mb-10">
        {/* 필터 탭 */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {FILTER_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as FilterStatus)}
              className={`px-8 py-2 rounded-full text-admin-body font-semibold transition-all shadow-sm ${
                filter === status ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* 일괄 작업 도구 바 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-in fade-in slide-in-from-top-2">
            <span className="text-admin-body font-bold text-blue-700">{selectedIds.length}개 선택됨</span>
            <div className="h-6 w-[1px] bg-blue-300 mx-2" />
            <span className="text-admin-small text-blue-600 mr-2">상태 일괄 변경:</span>
            {CONTACT_STATUS_OPTIONS.map((s) => (
              <button 
                key={s} 
                onClick={() => handleBulkUpdate(s)}
                className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-admin-small hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-800 text-admin-body font-bold">
            <tr className="flex w-full">
              <th className={`${colBase} ${colCheck} justify-center items-center`}>
                <input 
                  type="checkbox" 
                  onChange={(e) => setSelectedIds(e.target.checked ? contacts.map(c => c.id) : [])}
                  checked={selectedIds.length === contacts.length && contacts.length > 0}
                  className="size-8 cursor-pointer"
                />
              </th>
              <th 
                className={`${colBase} ${col1} cursor-pointer hover:text-blue-600 transition-colors`}
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              >
                날짜<span className="pl-2 text-blue-600">{sortOrder === "asc" ? "▲" : "▼"}</span>
              </th>
              <th className={`${colBase} ${col1}`}>이름(회사)</th>
              <th className={`${colBase} ${col2}`}>연락처</th>
              <th className={`${colBase} ${col2}`}>이메일</th>
              <th className={`${colBase} ${col3}`}>문의내용</th>
              <th className={`${colBase} ${col1}`}>상태</th>
              <th className={`${colBase} ${col2}`}>관리자 메모</th>
            </tr>
          </thead>
          
          <tbody className="block w-full">
            {contacts.map((contact) => (
              <tr key={contact.id} className="flex w-full hover:bg-blue-50 items-stretch border-b border-gray-300 last:border-0">
                <td className={`${colBase} ${colCheck} justify-center items-start pt-8`}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(contact.id)}
                    onChange={() => toggleSelect(contact.id)}
                    className="size-8 cursor-pointer"
                  />
                </td>
                <td className={`${colBase} ${col1} flex-col items-start justify-start text-admin-small text-gray-400`}>
                  <span className="mt-2">{contact.created_at?.split("T")[0]}</span>
                </td>
                <td className={`${colBase} ${col1} flex-col items-start justify-start gap-2`}>
                  <div className="font-bold text-admin-body text-gray-900 mt-1">{contact.name}</div>
                  <div className="text-admin-small text-gray-400">{contact.company || "-"}</div>
                </td>
                <td className={`${colBase} ${col2} items-start justify-start text-admin-body font-medium text-blue-600 pt-7`}>
                  {contact.phone}
                </td>
                <td className={`${colBase} ${col2} items-start justify-start text-admin-small break-all text-gray-600 pt-7`}>
                  {contact.email}
                </td>
                <td className={`${colBase} ${col3} items-start justify-start text-admin-body whitespace-pre-wrap break-all leading-relaxed text-gray-700 pt-7`}>
                  {contact.message}
                </td>
                <td className={`${colBase} ${col1} flex-col items-center justify-start`}>
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus(contact.id, e.target.value as ContactStatus)}
                    className="border border-gray-300 rounded-xl p-3 text-admin-body w-full bg-white shadow-sm mt-1"
                  >
                    {CONTACT_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                {/* 📝 메모 수정 섹션 */}
                <td className={`${colBase} ${col2} flex-col items-start justify-start gap-3`}>
                  {editingMemoId === contact.id ? (
                    <div className="w-full flex flex-col gap-2">
                      <textarea
                        value={tempMemo}
                        onChange={(e) => setTempMemo(e.target.value)}
                        className="px-4 py-3 text-admin-small w-full min-h-[120px] resize-none bg-white border-2 border-blue-400 rounded-xl outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => saveMemo(contact.id)}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-admin-small font-bold shadow-md active:scale-95 transition-transform"
                        >
                          저장
                        </button>
                        <button 
                          onClick={() => setEditingMemoId(null)}
                          className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg text-admin-small font-bold active:scale-95 transition-transform"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="group relative w-full min-h-[80px] px-4 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                      onClick={() => {
                        setEditingMemoId(contact.id);
                        setTempMemo(contact.admin_memo || "");
                      }}
                    >
                      <p className="text-admin-small text-gray-600 whitespace-pre-wrap">
                        {contact.admin_memo || "메모가 없습니다. 클릭하여 추가..."}
                      </p>
                      <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-blue-500 font-bold text-[1.2rem]">수정</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-20 text-center text-admin-small animate-pulse text-white">데이터 처리 중...</div>}
      </div>
    </div>
  );
}