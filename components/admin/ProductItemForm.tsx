// ProductItemForm.tsx 상단
import { ProductItem } from "@/lib/productsData";
import { AdminToggle } from "./AdminToggle";
import { AdminInput } from "./AdminInput";
import { ProductImageList } from "./ProductImageList";
import { AdminDeleteButton } from "./AdminDeleteButton";

type ProductItemFormProps = {
    item: ProductItem;
    index: number;
    updateItem: (index: number, field: keyof ProductItem, value: any) => void;
    handleMainImageUpload: (index: number, file: File) => void;
    handleThumbnailUpload: (index: number, files: File[]) => void;
    handleDetailUpload: (index: number, files: File[]) => void;
    removeMainImage: (index: number) => void;
    removeThumbnailImage: (index: number, thumbIndex: number) => void;
    removeDetailImage: (index: number, detailIndex: number) => void;
    toggleDelete: (index: number) => void;
};

export default function ProductItemForm({
    item,
    index,
    updateItem,
    handleMainImageUpload,
    handleThumbnailUpload,
    handleDetailUpload,
    removeMainImage,
    removeThumbnailImage,
    removeDetailImage,
    toggleDelete,
}: ProductItemFormProps) {
    return (
        <>
            {/* 이미지 업로드 리스트 */}
            <ProductImageList
                index={index}
                mainImage={item.image}
                tempMainImage={item.tempMainImage}
                thumbnailImages={item.thumbnailImages}
                tempThumbnailFiles={item.tempThumbnailFiles}
                detailImages={item.detailImages}
                tempDetailFiles={item.tempDetailFiles}
                handleMainImageUpload={handleMainImageUpload}
                handleThumbnailUpload={handleThumbnailUpload}
                handleDetailUpload={handleDetailUpload}
                removeMainImage={removeMainImage}
                removeThumbnailImage={removeThumbnailImage}
                removeDetailImage={removeDetailImage}
            />

            <div className="col-span-6 flex flex-col gap-6">
                <div className="w-full flex gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-admin-body font-semibold">영어 제목</span>
                        <AdminInput
                            value={item.brandEn}
                            disabled={item.isDeleted}
                            onChange={(v) => updateItem(index, "brandEn", v)}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-admin-body font-semibold">한글 제목</span>
                        <AdminInput
                            value={item.brandKo}
                            disabled={item.isDeleted}
                            onChange={(v) => updateItem(index, "brandKo", v)}
                        />
                    </div>
                </div>

                <div className="w-full flex gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-admin-body font-semibold">카테고리</span>
                        <AdminInput
                            value={item.category}
                            disabled={item.isDeleted}
                            onChange={(v) => updateItem(index, "category", v)}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-admin-body font-semibold">구매 링크</span>
                        <AdminInput
                            value={item.purchaseLink}
                            disabled={item.isDeleted}
                            onChange={(v) => updateItem(index, "purchaseLink", v)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <span className="text-admin-body font-semibold">설명</span>
                    <AdminInput
                        value={item.desc}
                        disabled={item.isDeleted}
                        onChange={(v) => updateItem(index, "desc", v)}
                        textarea
                    />
                </div>
            </div>

            {/* 진열 상태 */}
            <div className="col-span-1 flex justify-center">
                <AdminToggle
                    value={item.isVisible}
                    disabled={item.isDeleted}
                    onToggle={() => updateItem(index, "isVisible", !item.isVisible)}
                />
            </div>

            {/* 삭제/복구 버튼 */}
            <div className="col-span-1 flex justify-center">
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