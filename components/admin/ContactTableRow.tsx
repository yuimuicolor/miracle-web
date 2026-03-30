import { CONTACT_STATUS_OPTIONS, ContactStatus } from "@/lib/types/contact";

export default function ContactTableRow({ contact,
    COL_WIDTHS, selectedIds, setSelectedIds, expandedIds, setExpandedIds,
    updateStatus, editingMemoId, setEditingMemoId, tempMemo, setTempMemo, saveMemo }: any) {

    return (
          <tr
                key={contact.id}
                className="flex w-full hover:bg-blue-50/50 items-stretch border-b border-gray-300 last:border-0 transition-colors"
              >
                <td className={`${COL_WIDTHS.check} pt-8`}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(contact.id)}
                    onChange={() =>
                      setSelectedIds((prev: any) =>
                        prev.includes(contact.id)
                          ? prev.filter((i: any) => i !== contact.id)
                          : [...prev, contact.id],
                      )
                    }
                    className="size-8 cursor-pointer"
                  />
                </td>

                {/* 날짜 */}
                <td
                  className={`${COL_WIDTHS.base} ${COL_WIDTHS.date} text-admin-body text-gray-400 font-medium pt-8`}
                >
                  {contact.createdAt?.split("T")[0]}
                </td>

                {/* 이름(회사) */}
                <td className={`${COL_WIDTHS.base} ${COL_WIDTHS.name} gap-2 pt-8`}>
                  <div className="font-bold text-admin-body text-gray-900">
                    {contact.name}
                  </div>
                  <div className="text-admin-small text-gray-400">
                    {contact.company || "-"}
                  </div>
                </td>

                {/* 연락처 */}
                <td
                  className={`${COL_WIDTHS.base} ${COL_WIDTHS.phone} text-admin-body font-medium text-blue-600 pt-8`}
                >
                  {contact.phone}
                </td>

                {/* 이메일 */}
                <td
                  className={`${COL_WIDTHS.base} ${COL_WIDTHS.email} text-admin-small text-gray-600 break-all pt-8`}
                >
                  {contact.email}
                </td>

                {/* 문의내용 */}
                <td
                  className={`${COL_WIDTHS.base} ${COL_WIDTHS.content} text-admin-body leading-relaxed text-gray-700 pt-8`}
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
                            expandedIds.filter((id:any) => id !== contact.id),
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
                <td className={`${COL_WIDTHS.base} ${COL_WIDTHS.status} items-center! pt-7`}>
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
                <td className={`${COL_WIDTHS.base} ${COL_WIDTHS.memo} gap-3 pt-7`}>
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
                      className={`group relative w-full min-h-[90px] p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden`}
                      onClick={() => {
                        setEditingMemoId(contact.id);
                        setTempMemo(contact.adminMemo || "");
                      }}
                    >
                      <p className="text-admin-small text-gray-600 whitespace-pre-wrap leading-snug">
                        {contact.adminMemo || "메모 추가..."}
                      </p>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-3 py-1 rounded-md text-[1.2rem] font-bold shadow-sm">
                        수정
                      </div>
                    </div>
                  )}
                </td>

              </tr>
    )
}