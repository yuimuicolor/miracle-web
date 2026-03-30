import { useState, useEffect } from "react";
import { ContactInput, ContactStatus } from "@/lib/types/contact";

export const useContactsManager = (initialFilter: string) => {
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
      const params = new URLSearchParams({
        status: filter,
        page: String(currentPage),
        limit: String(itemsPerPage),
        sortOrder,
      });
      const res = await fetch(`/api/contacts?${params}`);
      const result = await res.json();
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

  const updateContact = async (id: number, updates: any) => {
    const res = await fetch("/api/contacts", {
      method: "PATCH",
      body: JSON.stringify({ id, updates }),
    });
    if (res.ok) fetchContacts();
  };

  const bulkUpdateStatus = async (ids: number[], newStatus: ContactStatus) => {
    const res = await fetch("/api/contacts", {
      method: "PATCH",
      body: JSON.stringify({ ids, updates: { status: newStatus } }),
    });
    if (res.ok) {
      setSelectedIds([]);
      fetchContacts();
    }
  };

  const updateStatus = async (id: number, newStatus: ContactStatus) => {
    const res = await fetch("/api/contacts", {
      method: "PATCH",
      body: JSON.stringify({ id, updates: { status: newStatus } }),
    });
    if (res.ok) fetchContacts();
  };

  const saveMemo = async (id: number) => {
    const res = await fetch("/api/contacts", {
      method: "PATCH",
      body: JSON.stringify({ id, updates: { admin_memo: tempMemo } }),
    });
    if (res.ok) {
      setEditingMemoId(null);
      fetchContacts();
    }
  };

  const handleBulkUpdate = async (newStatus: ContactStatus) => {
    if (selectedIds.length === 0) return alert("선택된 항목이 없습니다.");
    if (!confirm(`${selectedIds.length}개를 '${newStatus}'로 변경할까요?`))
      return;

    const res = await fetch("/api/contacts", {
      method: "PATCH",
      body: JSON.stringify({
        ids: selectedIds,
        updates: { status: newStatus },
      }),
    });
    if (res.ok) {
      setSelectedIds([]);
      fetchContacts();
    }
  };

  const sendContactEmail = async (submitData: ContactInput) => {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submitData, status: "미확인" }),
      });

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
    updateContact,
    bulkUpdateStatus,
    fetchContacts,
    expandedIds,
    setExpandedIds,
    editingMemoId,
    setEditingMemoId,
    tempMemo,
    setTempMemo,
    updateStatus,
    saveMemo,
    handleBulkUpdate,
    sendContactEmail,
  };
};
