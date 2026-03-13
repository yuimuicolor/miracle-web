import React from 'react'
import Link from 'next/link'

export default function GallerySection() {
  return (
    <section className="h-screen flex flex-col justify-center px-20 bg-bg-dark border-t border-white/5">
      {/* 제목란 */}
      <div className="flex flex-row justify-center items-center mb-10 w-full">
        <h2 className="font-gilda text-[80px] text-white mr-4">GALLERY <span className="text-point-light">*</span></h2>
        <div className="flex-1 h-[2px] bg-white"></div>
      </div>
      
      {/* 사진 그리드 레이아웃 */}
      <div className="w-200 mx-auto grid grid-cols-3 grid-rows-2 gap-10">
        {/* Placeholder for photos - 6 divs for 3x2 grid */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square bg-gray-500"></div>
        ))}
      </div>
      
      {/* 버튼 */}
      <div className="mt-10 flex justify-center">
        <Link href="/gallery">
          <button className="px-6 py-3 bg-point-light text-black font-pretendard uppercase hover:bg-opacity-80 transition">
            전체보기
          </button>
        </Link>
      </div>
    </section>
  )
}
