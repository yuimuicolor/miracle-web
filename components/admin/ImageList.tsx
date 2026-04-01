import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ImageSlot } from "@/lib/types/products";
import Image from "next/image";
import { getFileNameFromUrl } from "@/lib/utils/storage";

interface Props {
  type: "thumbnail" | "detail" | "imageSlider";
  images: ImageSlot[];
  onUpload: (files: File[]) => void;
  onRemove: (id: string) => void;
  onReorder: (result: DropResult) => void;
}

export function ImageList({ type, images, onUpload, onRemove, onReorder }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-admin-small font-bold">
          {type === "thumbnail" ? <>썸네일 <span className="text-blue-600">*</span></> : type === "detail" ? "상세 이미지" : "메인 이미지 슬라이더"}
        </span>
        <label className="cursor-pointer text-[12px] font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
          파일 추가
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && onUpload(Array.from(e.target.files))}
          />
        </label>
      </div>

      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId={`list-${type}`}>
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="space-y-1 min-h-[40px] bg-slate-50/50 rounded-lg p-1"
            >
              {images.map((img, i) => (
                <Draggable key={img.id} draggableId={img.id} index={i}>
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`group flex items-center gap-2 p-1.5 rounded-md border transition-all ${
                        snapshot.isDragging ? "bg-white shadow-lg border-blue-400 z-50" : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={img?.file ? URL.createObjectURL(img.file) : (img.url || "/fallback-image.png")}
                          fill
                          className="object-cover rounded shadow-sm"
                          alt="preview"
                          unoptimized
                        />
                      </div>
                      <span className="flex-1 text-[1.2rem] truncate text-slate-600 font-medium">
                        {img?.file ? img.file.name : getFileNameFromUrl(img.url || "")}
                      </span>
                      <button
                        type="button" // ⭐ 기본 submit 방지
                        onClick={() => onRemove(img.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors px-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {/* ⭐ 이미지가 없을 때 보여줄 문구 */}
              {images.length === 0 && (
                <div className="text-center py-4 text-[12px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  이미지를 추가해주세요.
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}