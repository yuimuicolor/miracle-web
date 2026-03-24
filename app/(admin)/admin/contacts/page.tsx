"use client";

import { CONTACT_STATUS_OPTIONS, ContactStatus } from "@/lib/contactsData";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";

const FILTER_OPTIONS = ["전체", ...CONTACT_STATUS_OPTIONS];
type FilterStatus = "전체" | ContactStatus;

export default function AdminContactsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") as FilterStatus;
  const [contacts, setContacts] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(initialStatus || "전체");
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // 페이징 & 정렬
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [totalCount, setTotalCount] = useState(0);

  // 선택 & 메모 편집
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [tempMemo, setTempMemo] = useState("");

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("contacts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: sortOrder === "asc" })
        .range(from, to);

      if (filter !== "전체") query = query.eq("status", filter);

      const { data, error, count } = await query;
      if (error) throw error;

      setContacts(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error("❌ 로드 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newStatus: FilterStatus) => {
    setFilter(newStatus); // 1. 내부 상태 변경 (fetchContacts가 자동으로 돌 거예요)

    // 2. 주소창 URL 조용히 변경 (404 방지)
    const params = new URLSearchParams(window.location.search);

    if (newStatus === "전체") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }

    // 주소창의 쿼리 스트링만 업데이트 (페이지 이동 없음)
    const newPath = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
    window.history.replaceState(null, "", newPath);
  };

  const updateStatus = async (id: number, newStatus: ContactStatus) => {
    const { error } = await supabase
      .from("contacts")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchContacts();
  };

  const saveMemo = async (id: number) => {
    const { error } = await supabase
      .from("contacts")
      .update({ admin_memo: tempMemo })
      .eq("id", id);
    if (!error) {
      setEditingMemoId(null);
      fetchContacts();
    }
  };

  const handleBulkUpdate = async (newStatus: ContactStatus) => {
    if (selectedIds.length === 0) return alert("선택된 항목이 없습니다.");
    if (!confirm(`${selectedIds.length}개를 '${newStatus}'로 변경할까요?`))
      return;
    const { error } = await supabase
      .from("contacts")
      .update({ status: newStatus })
      .in("id", selectedIds);
    if (!error) {
      setSelectedIds([]);
      fetchContacts();
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortOrder, itemsPerPage]);
  useEffect(() => {
    fetchContacts();
  }, [currentPage, filter, sortOrder, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 전체 합 100% 비율 세팅 (문의내용 25% 고정)
  const colCheck = "w-[4%] shrink-0 flex justify-center";
  const colDate = "w-[9%] shrink-0 flex flex-col";
  const colName = "w-[10%] shrink-0 flex flex-col";
  const colPhone = "w-[11%] shrink-0 flex flex-col";
  const colEmail = "w-[15%] shrink-0 flex flex-col";
  const colContent = "w-[25%] shrink-0 flex flex-col";
  const colStatus = "w-[9%] shrink-0 flex flex-col";
  const colMemo = "w-[17%] shrink-0 flex flex-col";

  const colBase = "p-6 items-start justify-start"; // 공통 패딩 & 상단정렬

  return (
    <div>
      <AdminHeader title="문의 관리" subtitle="Contact Us를 통해 접수된 고객 문의 관리 페이지입니다. 상태를 변경하거나 메모를 추가할 수 있습니다." tip="* 별도의 저장 없이 즉시 상태/메모가 반영됩니다." />
      <div className="flex justify-between items-end mt-6 mb-10">
        <div className="flex gap-3 overflow-x-auto">
          {FILTER_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status as FilterStatus)}
              className={`px-8 py-2 rounded-full text-admin-body font-semibold transition-all shadow-sm ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-admin-small font-bold px-3 text-gray-500">
            보기:
          </span>
          {[10, 30, 50, 100].map((num) => (
            <button
              key={num}
              onClick={() => setItemsPerPage(num)}
              className={`px-4 py-2 rounded-lg text-admin-small font-bold transition-all ${itemsPerPage === num ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-100"}`}
            >
              {num}개
            </button>
          ))}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-6 flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-in slide-in-from-top-2">
          <span className="text-admin-body font-bold text-blue-700">
            {selectedIds.length}개 선택됨
          </span>
          <div className="h-6 w-[1px] bg-blue-300 mx-2" />
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
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-800 text-admin-body font-bold border-b border-gray-300">
            <tr className="flex w-full items-center">
              <th className={`${colCheck} py-6`}>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked ? contacts.map((c) => c.id) : [],
                    )
                  }
                  checked={
                    selectedIds.length === contacts.length &&
                    contacts.length > 0
                  }
                  className="size-8 cursor-pointer"
                />
              </th>
              <th
                className={`${colBase} ${colDate} cursor-pointer hover:text-blue-600 flex-row items-center! gap-1`}
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                날짜
                <span className="text-admin-small text-blue-600">
                  {sortOrder === "asc" ? "▲" : "▼"}
                </span>
              </th>
              <th className={`${colBase} ${colName}`}>이름(회사)</th>
              <th className={`${colBase} ${colPhone}`}>연락처</th>
              <th className={`${colBase} ${colEmail}`}>이메일</th>
              <th className={`${colBase} ${colContent}`}>문의내용</th>
              <th className={`${colBase} ${colStatus}`}>상태</th>
              <th className={`${colBase} ${colMemo}`}>관리자 메모</th>
            </tr>
          </thead>

          <tbody className="block w-full">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="flex w-full hover:bg-blue-50/50 items-stretch border-b border-gray-300 last:border-0 transition-colors"
              >
                <td className={`${colCheck} pt-8`}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(contact.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(contact.id)
                          ? prev.filter((i) => i !== contact.id)
                          : [...prev, contact.id],
                      )
                    }
                    className="size-8 cursor-pointer"
                  />
                </td>

                {/* 날짜 */}
                <td
                  className={`${colBase} ${colDate} text-admin-body text-gray-400 font-medium pt-8`}
                >
                  {contact.created_at?.split("T")[0]}
                </td>

                {/* 이름(회사) */}
                <td className={`${colBase} ${colName} gap-2 pt-8`}>
                  <div className="font-bold text-admin-body text-gray-900">
                    {contact.name}
                  </div>
                  <div className="text-admin-small text-gray-400">
                    {contact.company || "-"}
                  </div>
                </td>

                {/* 연락처 */}
                <td
                  className={`${colBase} ${colPhone} text-admin-body font-medium text-blue-600 pt-8`}
                >
                  {contact.phone}
                </td>

                {/* 이메일 */}
                <td
                  className={`${colBase} ${colEmail} text-admin-small text-gray-600 break-all pt-8`}
                >
                  {contact.email}
                </td>

                {/* 문의내용 */}
                <td
                  className={`${colBase} ${colContent} text-admin-body leading-relaxed text-gray-700 pt-8`}
                >
                  {/* 1. 컨테이너를 block으로 두되, 내부 텍스트는 inline으로 흐르게 합니다. */}
                  <div className="block">
                    <span className="inline whitespace-pre-wrap break-all">
                      {!expandedIds.includes(contact.id) &&
                      contact.message?.length > 60
                        ? `${contact.message.slice(0, 60)}... `
                        : contact.message}
                    </span>

                    {/* 2. '더보기' 버튼을 inline-block으로 설정해서 글자 바로 옆에 붙입니다. */}
                    {contact.message?.length > 60 &&
                      !expandedIds.includes(contact.id) && (
                        <button
                          onClick={() =>
                            setExpandedIds([...expandedIds, contact.id])
                          }
                          className="inline-block ml-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        >
                          더보기
                        </button>
                      )}

                    {/* 3. 접기 버튼도 필요하면 똑같이 inline-block으로! */}
                    {expandedIds.includes(contact.id) && (
                      <button
                        onClick={() =>
                          setExpandedIds(
                            expandedIds.filter((id) => id !== contact.id),
                          )
                        }
                        className="inline-block ml-2 text-gray-300 hover:text-gray-500 text-admin-small underline"
                      >
                        접기
                      </button>
                    )}
                  </div>
                </td>

                {/* 상태 */}
                <td className={`${colBase} ${colStatus} items-center! pt-7`}>
                  <select
                    value={contact.status}
                    onChange={(e) =>
                      updateStatus(contact.id, e.target.value as ContactStatus)
                    }
                    className="border border-gray-300 rounded-xl px-2 py-3 text-admin-small w-full bg-white shadow-sm cursor-pointer focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    {CONTACT_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 관리자 메모 */}
                <td className={`${colBase} ${colMemo} gap-3 pt-7`}>
                  {editingMemoId === contact.id ? (
                    <div className="w-full flex flex-col gap-3">
                      <textarea
                        value={tempMemo}
                        onChange={(e) => setTempMemo(e.target.value)}
                        className="p-4 text-admin-small w-full min-h-[140px] resize-none bg-white border-2 border-blue-400 rounded-xl outline-none shadow-inner"
                        autoFocus
                      />
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => saveMemo(contact.id)}
                          className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-admin-small font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingMemoId(null)}
                          className="flex-1 py-3 bg-gray-200 text-gray-600 rounded-lg text-admin-small font-bold hover:bg-gray-300 active:scale-95 transition-all"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="group relative w-full min-h-[90px] p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden"
                      onClick={() => {
                        setEditingMemoId(contact.id);
                        setTempMemo(contact.admin_memo || "");
                      }}
                    >
                      <p className="text-admin-small text-gray-600 whitespace-pre-wrap leading-snug">
                        {contact.admin_memo || "메모 추가..."}
                      </p>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-3 py-1 rounded-md text-[1.2rem] font-bold shadow-sm">
                        수정
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="p-20 text-center text-admin-body animate-pulse text-gray-400">
            데이터를 동기화 중입니다...
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-6 mb-20">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-6 py-3 bg-white border border-gray-300 rounded-xl disabled:opacity-30 font-bold text-admin-body shadow-sm hover:bg-gray-50 transition-all"
        >
          이전
        </button>
        <div className="flex gap-3">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`size-14 rounded-xl font-bold text-admin-body transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white scale-110 shadow-lg" : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-6 py-3 bg-white border border-gray-300 rounded-xl disabled:opacity-30 font-bold text-admin-body shadow-sm hover:bg-gray-50 transition-all"
        >
          다음
        </button>
      </div>
    </div>
  );
}
