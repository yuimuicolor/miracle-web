import { ProductItem, ImageSlot } from "@/lib/types/products";
import { AdminToggle } from "./AdminToggle";
import { AdminInput } from "./AdminInput";
import { ProductImageList } from "./ProductImageList";
import { AdminDeleteButton } from "./AdminDeleteButton";
import { DropResult } from "@hello-pangea/dnd";
import { useRef, useState } from "react";
import Image from "next/image";

type ProductItemFormProps = {
  item: ProductItem;
  index: number;
  updateItem: (index: number, field: keyof ProductItem, value: any) => void;
  toggleDelete: (id: number) => void;
  handleListUpload: (index: number, field: "thumbnailImages" | "detailImages", files: File[]) => void;
  handleRemoveImage: (index: number, field: "thumbnailImages" | "detailImages", id: string) => void;
  reorderImageList: (index: number, field: "thumbnailImages" | "detailImages", res: DropResult) => void;
  handleAddOption: (index: number, opt: string) => void;
  handleRemoveOption: (index: number, optIdx: number) => void;
};

export default function ProductItemForm({
  item,
  index,
  updateItem,
  toggleDelete,
  handleListUpload,
  handleRemoveImage,
  reorderImageList,
  handleAddOption,
  handleRemoveOption
}: ProductItemFormProps) {

  const [tempOptionInput, setTempOptionInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* 1 & 2. 이미지 섹션 (메인, 썸네일, 상세) */}
      <div className="col-span-3 flex flex-col gap-6">
        {/* 메인 이미지 (1개만) */}
        <div className="space-y-2">
          <span className="text-admin-small font-bold uppercase">Main Image <span className="text-blue-600">*</span></span>
          <div className="relative w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors">
            <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center">
              {item.tempMainFile || item.image ? (
                <Image
                  src={item.tempMainFile ? URL.createObjectURL(item.tempMainFile) : item.image}
                  className="w-full h-full object-cover"
                  fill
                  unoptimized={true}
                  loading="eager"
                  alt="Main Product Image"
                />
              ) : (
                <span className="text-slate-400 text-admin-small">이미지 업로드</span>
              )}
              <input type="file" className="hidden" onChange={(e) => updateItem(index, "tempMainFile", e.target.files?.[0])} />
            </label>
          </div>
        </div>

        {/* 썸네일 리스트 (여러개) */}
        <ProductImageList
          type="thumbnail"
          images={item.thumbnailImages}
          onUpload={(files) => handleListUpload(index, "thumbnailImages", files)}
          onRemove={(id) => handleRemoveImage(index, "thumbnailImages", id)}
          onReorder={(res) => reorderImageList(index, "thumbnailImages", res)}
        />

        {/* 상세 이미지 리스트 (여러개) */}
        <ProductImageList
          type="detail"
          images={item.detailImages}
          onUpload={(files) => handleListUpload(index, "detailImages", files)}
          onRemove={(id) => handleRemoveImage(index, "detailImages", id)}
          onReorder={(res) => reorderImageList(index, "detailImages", res)}
        />
      </div>

      {/* 3. 정보 입력 섹션 */}
      <div className="col-span-6 flex flex-col gap-4 px-4">

        <div className="grid grid-cols-2 gap-4">
        
          <div className="space-y-2">
            <span className="text-admin-body font-semibold">메인 제목 <span className="text-blue-600">*</span></span>
            <AdminInput
              value={item.mainTitle}
              placeholder="메인 제목을 입력하세요."
              disabled={item.isDeleted}
              onChange={(v) => updateItem(index, "mainTitle", v)}
            />
          </div>
            <div className="space-y-2">
            <span className="text-admin-body font-semibold">서브 제목</span>
            <AdminInput
              value={item.subTitle}
              placeholder="서브 제목을 입력하세요."
              disabled={item.isDeleted}
              onChange={(v) => updateItem(index, "subTitle", v)}
            />
          </div>
          <div className="space-y-2">
            <span className="text-admin-body font-semibold">카테고리</span>
            <AdminInput
              value={item.category}
              placeholder="카테고리를 입력하세요."
              disabled={item.isDeleted}
              onChange={(v) => updateItem(index, "category", v)}
            />
          </div>


          <div className="space-y-2">
            {/* 상단: 입력부 */}
            <div className="flex flex-col">
              <span className="text-admin-body font-bold">옵션</span>
              <div className="flex items-center gap-2">
                <AdminInput
                  ref={inputRef}
                  placeholder="입력 후 [추가] 버튼을 눌러주세요."
                  disabled={item.isDeleted}
                  value={tempOptionInput || ""}
                  onChange={(v) => setTempOptionInput(v)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tempOptionInput) {
                      handleAddOption(index, tempOptionInput);
                      setTempOptionInput("");
                      inputRef.current?.focus();
                    }
                  }}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg text-admin-small font-bold hover:bg-blue-600 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>

            {/* 하단: 옵션 리스트 (칩 모양) */}
            <div className="flex flex-wrap gap-2">
              {item.options?.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full w-fit hover:bg-white hover:border-blue-400 transition-all group"
                >
                  {/* 텍스트 내용만큼만 딱 줄어듬 */}
                  <span className="text-admin-small text-slate-700 leading-none">
                    {opt}
                  </span>

                  {/* 삭제 X 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index, optIdx)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-400 text-white group-hover:bg-red-400 transition-colors"
                  >
                    <span className="text-[12px] leading-none">✕</span>
                  </button>
                </div>
              ))}

              {/* 빈 상태 메시지 */}
              {(!item.options || item.options.length === 0) && (
                <p className="text-[14px] text-slate-400 italic">등록된 옵션이 없습니다.</p>
              )}
            </div>
          </div>

        </div>

        <div className="space-y-2">
          <span className="text-admin-body font-semibold">구매 링크</span>
          <AdminInput
            value={item.purchaseLink}
            placeholder="https:// 형태의 구매 링크를 입력하세요."
            disabled={item.isDeleted}
            onChange={(v) => updateItem(index, "purchaseLink", v)}
          />
        </div>

        <div className="space-y-2">
          <span className="text-admin-body font-semibold">설명</span>
          <AdminInput
            value={item.desc}
            disabled={item.isDeleted}
            placeholder="상품 설명을 입력하세요."
            onChange={(v) => updateItem(index, "desc", v)}
            textarea
          />
        </div>
      </div>

      {/* 4. 상태 및 액션 */}
      <div className="col-span-1 flex justify-center mt-8">
        <AdminToggle
          value={item.isVisible}
          disabled={item.isDeleted}
          onToggle={() => updateItem(index, "isVisible", !item.isVisible)}
        />
      </div>

      <div className="col-span-1 flex justify-center mt-8">
        <AdminDeleteButton
          isDeleted={item.isDeleted}
          onDelete={() => toggleDelete(item.id)}
          onRestore={() => toggleDelete(item.id)}
          canRestore
        />
      </div>
    </>
  );
}