// ProductItemForm.tsx 상단
import { ProductItem } from "@/lib/productsData";
import Image from "next/image";
import { AdminToggle } from "./AdminToggle";
import { AdminInput } from "./AdminInput";
import { ProductImageList } from "./ProductImageList";
import { AdminDeleteButton } from "./AdminDeleteButton";

type ProductItemFormProps = {
    item: ProductItem;
    index: number;
    updateItem: (index: number, field: keyof ProductItem, value: any) => void;
    handleMainImageUpload: (index: number, file: File) => void;
    handleThumbnailUpload: (index: number, file: File) => void;
    handleDetailUpload: (index: number, file: File) => void;
    toggleDelete: (index: number) => void;
};

export default function ProductItemForm({
    item,
    index,
    updateItem,
    handleMainImageUpload,
    handleThumbnailUpload,
    handleDetailUpload,
    toggleDelete,
}: ProductItemFormProps) {
    return (
        <>

            {/* 이미지 업로드 리스트 */}
            <ProductImageList
                index={index}
                mainImage={item.image}
                thumbnailImages={item.thumbnailImages}
                detailImages={item.detailImages}
                handleMainImageUpload={handleMainImageUpload}
                handleThumbnailUpload={handleThumbnailUpload}
                handleDetailUpload={handleDetailUpload}
            />

            {/* 영어 제목 */}
            <div className="col-span-2 flex justify-center">
                <AdminInput
                    value={item.brandEn}
                    disabled={item.isDeleted}
                    onChange={(value) => updateItem(index, "brandEn", value)}
                />
            </div>

            {/* 한글 제목 */}
            <div className="col-span-2 flex justify-center">
                <AdminInput
                    value={item.brandKo}
                    disabled={item.isDeleted}
                    onChange={(value) => updateItem(index, "brandKo", value)}
                />
            </div>

            {/* 카테고리 */}
            <div className="col-span-1 flex justify-center">
                <AdminInput
                    value={item.category}
                    disabled={item.isDeleted}
                    onChange={(value) => updateItem(index, "category", value)}
                />
            </div>

            {/* 구매 링크 */}
            <div className="col-span-2 flex justify-center">
                <AdminInput
                    value={item.purchaseLink}
                    disabled={item.isDeleted}
                    onChange={(value) => updateItem(index, "purchaseLink", value)}
                />
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