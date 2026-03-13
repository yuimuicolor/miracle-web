import React from 'react'
import Link from 'next/link'
import MoreButton from '../MoreButton'
import SectionTitle from './common/SectionTitle'

const STYLE = {
  section: 'h-screen flex flex-col justify-center px-20 bg-bg-dark border-t border-white/5',
  grid: 'w-[50rem] mx-auto grid grid-cols-3 grid-rows-2 gap-10',
  gridItem: 'aspect-square bg-gray-500',
  buttonWrap: 'mt-10 flex justify-center',
};

export default function GallerySection() {
  return (
    <section className={STYLE.section}>
      {/* 제목란 */}
      <SectionTitle title="Gallery" color="white" />
      
      {/* 사진 그리드 레이아웃 */}
      <div className={STYLE.grid}>
        {/* Placeholder for photos - 6 divs for 3x2 grid */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={STYLE.gridItem}></div>
        ))}
      </div>
      
      {/* 버튼 */}
      <div className={STYLE.buttonWrap}>
        <Link href="/gallery">
          <MoreButton text="전체보기" size="L" mode="light" />
        </Link>
      </div>
    </section>
  )
}
