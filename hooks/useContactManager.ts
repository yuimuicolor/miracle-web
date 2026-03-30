import { useState, useEffect } from "react";
import { ContactInput, ContactStatus, FilterStatus } from "@/lib/types/contact";
import {
  getContacts,
  updateContactsApi,
  createContact,
} from "@/lib/api/contacts";

export const useContactsManager = (initialFilter: FilterStatus) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filter, setFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [tempMemo, setTempMemo] = useState("");

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const result = await getContacts({
        status: filter,
        page: currentPage,
        limit: itemsPerPage,
        sortOrder,
      });
      setContacts(result.data || []);
      setTotalCount(result.count || 0);
    } catch (error) {
      console.error("로드 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, filter, sortOrder, itemsPerPage]);

  const handleUpdateStatus = async (
    idOrIds: number | number[],
    newStatus: ContactStatus,
  ) => {
    try {
      const payload = Array.isArray(idOrIds)
        ? { ids: idOrIds, updates: { status: newStatus } }
        : { id: idOrIds, updates: { status: newStatus } };

      await updateContactsApi(payload);
      if (Array.isArray(idOrIds)) setSelectedIds([]);
      fetchContacts();
    } catch (error) {
      alert("상태 변경 실패!");
    }
  };
  
const handleBulkUpdate = async (newStatus: ContactStatus) => {
  if (selectedIds.length === 0) return alert("선택된 항목이 없습니다.");
  if (!confirm(`${selectedIds.length}개를 '${newStatus}'로 변경할까요?`)) return;
  await handleUpdateStatus(selectedIds, newStatus);
};

  const saveMemo = async (id: number) => {
    try {
      await updateContactsApi({
        id,
        updates: { adminMemo: tempMemo },
      });

      setEditingMemoId(null);
      await fetchContacts(); // 메모 저장 후 리스트 새로고침
    } catch (error) {
      alert("메모 저장 실패!");
    }
  };

  const sendContactEmail = async (submitData: ContactInput) => {
    try {
      const res = await createContact(submitData);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "처리 중 오류가 발생했습니다.");
      }

      return { success: true };
    } catch (error) {
      console.error("Action Error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "알 수 없는 오류",
      };
    }
  };

  return {
    contacts,
    filter,
    setFilter,
    loading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalCount,
    sortOrder,
    setSortOrder,
    selectedIds,
    setSelectedIds,
    expandedIds,
    setExpandedIds,
    editingMemoId,
    setEditingMemoId,
    tempMemo,
    setTempMemo,
    updateStatus: (id: number, status: ContactStatus) =>
      handleUpdateStatus(id, status),
    saveMemo,
    handleBulkUpdate,
    sendContactEmail,
    fetchContacts,
  };
};
