import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

type ProductImageListProps = {
    index: number;
    mainImage?: string;
    tempMainImage?: File;
    thumbnailImages: string[];
    tempThumbnailFiles?: File[];
    detailImages: string[];
    tempDetailFiles?: File[];
    handleMainImageUpload: (index: number, file: File) => void;
    handleThumbnailUpload: (index: number, files: File[]) => void;
    handleDetailUpload: (index: number, files: File[]) => void;
    removeMainImage?: (index: number) => void;
    removeThumbnailImage?: (index: number, i: number) => void;
    removeDetailImage?: (index: number, i: number) => void;
};

export function ProductImageList({
    index,
    mainImage,
    tempMainImage,
    thumbnailImages,
    tempThumbnailFiles,
    detailImages,
    tempDetailFiles,
    handleMainImageUpload,
    handleThumbnailUpload,
    handleDetailUpload,
    removeMainImage,
    removeThumbnailImage,
    removeDetailImage,
}: ProductImageListProps) {
    const [previewImage, setPreviewImage] = useState<string | null | undefined>(null);

    // **UI 렌더용 로컬 state**
    const [thumbList, setThumbList] = useState<(string | File)[]>([]);
    const [detailList, setDetailList] = useState<(string | File)[]>([]);

    // props가 바뀔 때 로컬 state 초기화
    useEffect(() => {
        setThumbList(tempThumbnailFiles?.length ? tempThumbnailFiles : thumbnailImages);
    }, [tempThumbnailFiles, thumbnailImages]);

    useEffect(() => {
        setDetailList(tempDetailFiles?.length ? tempDetailFiles : detailImages);
    }, [tempDetailFiles, detailImages]);


    const getFileName = (url: string | undefined) => url?.split("/").pop();


    // 드래그 후 순서 변경 처리
    const handleDragEnd = (
        result: DropResult,
        list: (string | File)[],
        setList: (newList: (string | File)[]) => void
    ) => {
        if (!result.destination) return;
        const updated = Array.from(list);
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        setList(updated);
    };

    return (
        <div className="col-span-3 flex flex-col gap-4">
            {/* 대표 이미지 */}
            <div className="border-b border-slate-200 pb-2">
                <div className="flex justify-between items-center">
                    <span className="text-admin-small font-semibold">대표 이미지</span>
                    <label className="cursor-pointer px-2 py-1 bg-purple-600 text-white rounded text-admin-small hover:bg-purple-700 transition">
                        사진 선택
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files && handleMainImageUpload(index, e.target.files[0])}
                        />
                    </label>
                </div>

                {(mainImage || tempMainImage) && (
                    <div className="flex items-center gap-2 mt-1">
                        <img
                            src={tempMainImage ? URL.createObjectURL(tempMainImage) : mainImage}
                            alt="preview"
                            className="w-5 h-5 object-cover cursor-pointer rounded"
                        />
                        <span className="text-admin-small">
                            {tempMainImage ? tempMainImage.name : getFileName(mainImage)}
                        </span>
                        {removeMainImage && (
                            <button className="text-red-500 text-admin-small" onClick={() => removeMainImage(index)}>X</button>
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
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files);
                handleThumbnailUpload(index, files); // items state 업데이트
                setThumbList(prev => [...prev, ...files]); // UI용 로컬 state 업데이트
              }}
            />
          </label>
        </div>

        <DragDropContext onDragEnd={(res) => handleDragEnd(res, thumbList, setThumbList)}>
          <Droppable droppableId={`thumb-${index}`} direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-1 mt-1">
                {thumbList.map((fileOrUrl, i) => (
                  <Draggable key={i} draggableId={`thumb-${index}-${i}`} index={i}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                        className="flex items-center gap-2 text-admin-small">
                        <img
                          src={fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl}
                          className="w-5 h-5 object-cover cursor-pointer rounded"
                        />
                        <span>{fileOrUrl instanceof File ? fileOrUrl.name : getFileName(fileOrUrl)}</span>
                        {removeThumbnailImage && (
                          <button
                            className="text-red-500 text-admin-small"
                            onClick={() => {
                              removeThumbnailImage(index, i);
                              setThumbList(prev => prev.filter((_, idx) => idx !== i));
                            }}
                          >X</button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* 상세 이미지 */}
      <div className="pb-2">
        <div className="flex justify-between items-center">
          <span className="text-admin-small font-semibold">상세 이미지</span>
          <label className="ml-auto cursor-pointer px-2 py-1 bg-slate-200 rounded text-admin-small hover:bg-slate-300 transition">
            사진 선택
            <input
              type="file"
              className="hidden"
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files);
                handleDetailUpload(index, files);
                setDetailList(prev => [...prev, ...files]); // UI용 로컬 state 업데이트
              }}
            />
          </label>
        </div>

        <DragDropContext onDragEnd={(res) => handleDragEnd(res, detailList, setDetailList)}>
          <Droppable droppableId={`detail-${index}`} direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-1 mt-1">
                {detailList.map((fileOrUrl, i) => (
                  <Draggable key={i} draggableId={`detail-${index}-${i}`} index={i}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="flex items-center gap-2 text-admin-small">
                        <img
                          src={fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl}
                          alt=""
                          className="w-5 h-5 object-cover cursor-pointer rounded"
                          onClick={() => setPreviewImage(fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl)}
                        />
                        <span>{fileOrUrl instanceof File ? fileOrUrl.name : getFileName(fileOrUrl)}</span>
                        {removeDetailImage && (
                          <button
                            className="text-red-500 text-admin-small"
                            onClick={() => {
                              removeDetailImage(index, i);
                              setDetailList(prev => prev.filter((_, idx) => idx !== i));
                            }}
                          >
                            X
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* 이미지 모달 */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} className="max-w-[90%] max-h-[90%] rounded" />
        </div>
      )}
    </div>
  );
}