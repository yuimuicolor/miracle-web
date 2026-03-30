"use client"

import { AdminHeader } from "@/components/admin/AdminHeader";
import ContactTableRow from "@/components/admin/ContactTableRow";
import { useContactsManager } from "@/hooks/useContactManager"
import { CONTACT_STATUS_OPTIONS, ContactStatus, FILTER_OPTIONS, FilterStatus } from "@/lib/types/contact";
import { useSearchParams } from "next/navigation";


const COL_WIDTHS = {
  check: "w-[4%] shrink-0 flex justify-center",
  date: "w-[9%] shrink-0 flex flex-col",
  name: "w-[10%] shrink-0 flex flex-col",
  phone: "w-[11%] shrink-0 flex flex-col",
  email: "w-[15%] shrink-0 flex flex-col",
  content: "w-[25%] shrink-0 flex flex-col",
  status: "w-[9%] shrink-0 flex flex-col",
  memo: "w-[17%] shrink-0 flex flex-col",
  base: "p-6 items-start justify-start"
}

export default function AdminContactsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "전체";
  
  const {
    contacts, filter, setFilter, loading, currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage, totalCount, sortOrder, setSortOrder,
    selectedIds, setSelectedIds, updateContact, bulkUpdateStatus,
    expandedIds, setExpandedIds, editingMemoId, setEditingMemoId, tempMemo, setTempMemo,
    updateStatus, saveMemo, handleBulkUpdate
  } = useContactsManager(initialStatus);

  // URL 변경 로직만 컴포넌트에 유지
  const handleFilterChange = (newStatus: string) => {
    setFilter(newStatus);
    const params = new URLSearchParams(window.location.search);
    newStatus === "전체" ? params.delete("status") : params.set("status", newStatus);
    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
  };


  const totalPages = Math.ceil(totalCount / itemsPerPage);




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
              <th className={`${COL_WIDTHS.check} py-6`}>
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
                className={`${COL_WIDTHS.base} ${COL_WIDTHS.date} cursor-pointer hover:text-blue-600 flex-row items-center! gap-1`}
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                날짜
                <span className="text-admin-small text-blue-600">
                  {sortOrder === "asc" ? "▲" : "▼"}
                </span>
              </th>
              <th className={`${COL_WIDTHS.base} ${COL_WIDTHS.name}`}>이름(회사)</th>
              <th className={`${COL_WIDTHS.base} ${COL_WIDTHS.phone}`}>연락처</th>
              <th className={`${COL_WIDTHS.base} ${COL_WIDTHS.email}`}>이메일</th>
              <th className={`${COL_WIDTHS.base} ${COL_WIDTHS.content}`}>문의내용</th>
              <th className={`${COL_WIDTHS.base} ${COL_WIDTHS.status}`}>상태</th>
              <th className={`${COL_WIDTHS.base} ${COL_WIDTHS.memo}`}>관리자 메모</th>
            </tr>
          </thead>

          <tbody className="block w-full">
            {contacts.map((contact) => (
              <ContactTableRow
                key={contact.id}
                contact={contact}
                COL_WIDTHS={COL_WIDTHS}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                expandedIds={expandedIds}
                setExpandedIds={setExpandedIds}
                updateStatus={updateStatus}
                editingMemoId={editingMemoId}
                setEditingMemoId={setEditingMemoId}
                tempMemo={tempMemo}
                setTempMemo={setTempMemo}
                saveMemo={saveMemo}
              />
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
