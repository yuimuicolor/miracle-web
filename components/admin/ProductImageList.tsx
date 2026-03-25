import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ImageSlot } from "@/lib/productsData";
import Image from "next/image";

interface Props {
  type: "thumbnail" | "detail";
  images: ImageSlot[];
  onUpload: (files: File[]) => void;
  onRemove: (id: string) => void;
  onReorder: (result: DropResult) => void;
}

export function ProductImageList({ type, images, onUpload, onRemove, onReorder }: Props) {

  const getFileName = (url: string) => {
    try {
      const decodeUrl = decodeURIComponent(url); // 한글 파일명 대응
      const parts = decodeUrl.split("/");
      return parts[parts.length - 1].split("?")[0]; // 쿼리 스트링 제거 후 파일명만 반환
    } catch (e) {
      return "기존 이미지";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-admin-small font-bold">{type === "thumbnail" ? <>썸네일 <span className="text-blue-600">*</span></> : "상세 이미지"}</span>
        <label className="cursor-pointer text-[14px] font-semibold bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
          추가
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onUpload(Array.from(e.target.files))}
          />
        </label>
      </div>

      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId={`list-${type}`}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
              {images.map((img, i) => (
                <Draggable key={img.id} draggableId={img.id} index={i}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className="group flex items-center gap-2 bg-slate-50 p-1.5 rounded-md border border-transparent hover:border-slate-200"
                    >
                      <Image
                        src={img?.file ? URL.createObjectURL(img.file) : (img.url || "/fallback-image.png")}
                        width={32}  // Image 태그는 width, height가 필수예요! (w-8 = 32px)
                        height={32}
                        className="w-8 h-8 object-cover rounded shadow-sm"
                        alt="preview"
                        // 2. 임시 URL(blob)일 때는 최적화를 꺼서 에러를 방지해요
                        unoptimized={true}
                      />
                      <span className="flex-1 text-[1.4rem] truncate text-slate-600">
                        {img?.file ? img.file.name : getFileName(img.url || "")}
                      </span>
                      <button
                        onClick={() => onRemove(img.id)}
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity px-1"
                      >
                        ✕
                      </button>
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
  );
}