import { ProductItem, ImageSlot } from "@/lib/productsData";
import { AdminToggle } from "./AdminToggle";
import { AdminInput } from "./AdminInput";
import { ProductImageList } from "./ProductImageList";
import { AdminDeleteButton } from "./AdminDeleteButton";
import { DropResult } from "@hello-pangea/dnd";

type ProductItemFormProps = {
  item: ProductItem;
  index: number;
  updateItem: (index: number, field: keyof ProductItem, value: any) => void;
  toggleDelete: (id: number) => void;
};

export default function ProductItemForm({
  item,
  index,
  updateItem,
  toggleDelete,
}: ProductItemFormProps) {
  
  // 1. 메인 이미지 변경 (무조건 1개)
  const handleMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateItem(index, "tempMainFile", e.target.files[0]);
    }
  };

  // 2. 리스트(썸네일/상세) 이미지 추가
  const handleListUpload = (field: "thumbnailImages" | "detailImages", files: File[]) => {
    const newSlots: ImageSlot[] = files.map(file => ({
      id: crypto.randomUUID(),
      file
    }));
    updateItem(index, field, [...(item[field] || []), ...newSlots]);
  };

  // 3. 이미지 삭제
  const handleRemoveImage = (field: "thumbnailImages" | "detailImages", id: string) => {
    const filtered = item[field].filter(img => img.id !== id);
    updateItem(index, field, filtered);
  };

  // 4. 리스트 내 순서 변경 (DnD)
  const handleReorder = (field: "thumbnailImages" | "detailImages", result: DropResult) => {
    if (!result.destination) return;
    const list = Array.from(item[field]);
    const [moved] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, moved);
    updateItem(index, field, list);
  };

  return (
    <>
      {/* 1 & 2. 이미지 섹션 (메인, 썸네일, 상세) */}
      <div className="col-span-3 flex flex-col gap-6">
        {/* 메인 이미지 (1개만) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Main Image</span>
          <div className="relative w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors">
            <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center">
              {item.tempMainFile || item.image ? (
                <img 
                  src={item.tempMainFile ? URL.createObjectURL(item.tempMainFile) : item.image} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-slate-400 text-sm">이미지 업로드</span>
              )}
              <input type="file" className="hidden" onChange={handleMainChange} />
            </label>
          </div>
        </div>

        {/* 썸네일 리스트 (여러개) */}
        <ProductImageList
          type="thumbnail"
          images={item.thumbnailImages}
          onUpload={(files) => handleListUpload("thumbnailImages", files)}
          onRemove={(id) => handleRemoveImage("thumbnailImages", id)}
          onReorder={(res) => handleReorder("thumbnailImages", res)}
        />

        {/* 상세 이미지 리스트 (여러개) */}
        <ProductImageList
          type="detail"
          images={item.detailImages}
          onUpload={(files) => handleListUpload("detailImages", files)}
          onRemove={(id) => handleRemoveImage("detailImages", id)}
          onReorder={(res) => handleReorder("detailImages", res)}
        />
      </div>

      {/* 3. 정보 입력 섹션 */}
      <div className="col-span-6 flex flex-col gap-4 px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-admin-body font-semibold">브랜드(EN)</span>
            <AdminInput
              value={item.brandEn}
              disabled={item.isDeleted}
              onChange={(v) => updateItem(index, "brandEn", v)}
            />
          </div>
          <div className="space-y-2">
            <span className="text-admin-body font-semibold">브랜드(KO)</span>
            <AdminInput
              value={item.brandKo}
              disabled={item.isDeleted}
              onChange={(v) => updateItem(index, "brandKo", v)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-admin-body font-semibold">구매 링크</span>
          <AdminInput
            value={item.purchaseLink}
            disabled={item.isDeleted}
            onChange={(v) => updateItem(index, "purchaseLink", v)}
          />
        </div>

        <div className="space-y-2">
          <span className="text-admin-body font-semibold">설명</span>
          <AdminInput
            value={item.desc}
            disabled={item.isDeleted}
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