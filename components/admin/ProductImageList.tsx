import Image from "next/image";
import { useState } from "react";

type ProductImageListProps = {
    index: number;
    mainImage?: string;
    thumbnailImages: string[];
    detailImages: string[];
    handleMainImageUpload: (index: number, file: File) => void;
    handleThumbnailUpload: (index: number, file: File) => void;
    handleDetailUpload: (index: number, file: File) => void;
    removeThumbnailImage?: (index: number, i: number) => void;
    removeDetailImage?: (index: number, i: number) => void;
    removeMainImage?: (index: number) => void;
};

export function ProductImageList({
    index,
    mainImage,
    thumbnailImages,
    detailImages,
    handleMainImageUpload,
    handleThumbnailUpload,
    handleDetailUpload,
    removeMainImage,
    removeThumbnailImage,
    removeDetailImage,
}: ProductImageListProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const getFileName = (url: string) => url.split("/").pop();

    return (
        <div className="col-span-2 flex flex-col gap-4">
            <div className="border-b border-slate-200 pb-2">
                <div className="flex justify-between items-center">
                    <span className="text-admin-small font-semibold">대표 이미지</span>
                    <label className="cursor-pointer px-2 py-1 bg-purple-600 text-white rounded text-admin-small hover:bg-purple-700 transition">
                        사진 선택
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                                e.target.files && handleMainImageUpload(index, e.target.files[0])
                            }
                        />
                    </label>

                </div>
                {mainImage && (
                    <div className="flex items-center gap-2 mt-1">
                        <img
                            src={mainImage}
                            alt="preview"
                            className="w-5 h-5 object-cover cursor-pointer rounded"
                            onClick={() => setPreviewImage(mainImage)}
                        />
                        <span className="text-admin-small">{getFileName(mainImage)}</span>
                        {removeMainImage && (
                            <button
                                className="text-red-500 text-admin-small"
                                onClick={() => removeMainImage(index)}
                            >
                                X
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* 썸네일 이미지 */}
            <div className="border-b border-slate-200 pb-2">
                <div className="flex justify-between items-center">
                    <span className="text-admin-small font-semibold">썸네일 이미지</span>
                    <label className="ml-auto cursor-pointer px-2 py-1 bg-slate-200 rounded text-admin-small hover:bg-slate-300 transition">
                        사진 선택
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                                e.target.files &&
                                handleThumbnailUpload(index, e.target.files[0])
                            }
                        />
                    </label>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                    {thumbnailImages.map((img, i) => (
                        <div key={i} className="flex items-center gap-2 text-admin-small">
                            <img
                                src={img}
                                alt=""
                                className="w-5 h-5 object-cover cursor-pointer rounded"
                                onClick={() => setPreviewImage(img)}
                            />
                            <span className="text-admin-small">{getFileName(img)}</span>
                            {removeThumbnailImage && (
                                <button
                                    className="text-red-500 text-admin-small"
                                    onClick={() => removeThumbnailImage(index, i)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 상세 이미지 */}
            <div className="border-b border-slate-200 pb-2">
                <div className="flex justify-between items-center">
                    <span className="text-admin-small font-semibold">상세 이미지</span>
                    <label className="ml-auto cursor-pointer px-2 py-1 bg-slate-200 rounded text-admin-small hover:bg-slate-300 transition">
                        사진 선택
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                                e.target.files && handleDetailUpload(index, e.target.files[0])
                            }
                        />
                    </label>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                    {detailImages.map((img, i) => (
                        <div key={i} className="flex items-center gap-2 text-admin-small">
                            <img
                                src={img}
                                alt=""
                                className="w-5 h-5 object-cover cursor-pointer rounded"
                                onClick={() => setPreviewImage(img)}
                            />
                            <span className="text-admin-small">{getFileName(img)}</span>
                            {removeDetailImage && (
                                <button
                                    className="text-red-500 text-admin-small"
                                    onClick={() => removeDetailImage(index, i)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 이미지 모달 */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setPreviewImage(null)}
                >
                    <img src={previewImage} className="max-w-[90%] max-h-[90%] rounded" />
                </div>
            )}
        </div>
    );
}