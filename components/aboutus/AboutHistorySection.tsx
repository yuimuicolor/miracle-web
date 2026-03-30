

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/aboutus/SharedAboutPage";
import {
  ABOUT_PAGE_STYLE,
  ANCHOR_PADDING_TOP,
  HISTORY_STAGGER_MS,
  SECTION_REVEAL,
  SECTION_REVEAL_EFFECT} from "@/lib/constants/aboutPage";
import { getHistoryItemsByServer } from "@/lib/api/history";
import { supabaseServer } from "@/lib/supabase/server";

export default async function AboutHistorySection() {
  const history = await getHistoryItemsByServer(supabaseServer);

  const historyRows = Array.from(
    { length: Math.ceil(history.length / 2) },
    (_, rowIndex) => history.slice(rowIndex * 2, rowIndex * 2 + 2),
  );

  return (
    <section
      id="history"
      className={ABOUT_PAGE_STYLE.historySection}
      style={{ paddingTop: ANCHOR_PADDING_TOP }}
    >
      <ScrollReveal
        className={ABOUT_PAGE_STYLE.sectionHeading}
        durationMs={SECTION_REVEAL.durationMs}
        threshold={SECTION_REVEAL.threshold}
        rootMargin={SECTION_REVEAL.rootMargin}
        {...SECTION_REVEAL_EFFECT}
      >
        <SectionHeading
          headingEn="HISTORY"
          headingKo="연혁"
          description="미라클의 주요 연혁과 성과를 소개합니다."
        />
      </ScrollReveal>

      <div className={ABOUT_PAGE_STYLE.historyRows}>
        {historyRows.map((rowItems, rowIndex) => {
          const isOddRow = rowIndex % 2 === 0;
          const isLastRow = rowIndex === historyRows.length - 1;

          return (
            <div
              key={`history-row-${rowIndex}`}
              className={`${ABOUT_PAGE_STYLE.historyRow} ${isOddRow ? ABOUT_PAGE_STYLE.historyRowOdd : ABOUT_PAGE_STYLE.historyRowEven}`}
            >
              {!isOddRow ? (
                <ScrollReveal
                  delayMs={0}
                  durationMs={760}
                  threshold={0.12}
                  className={ABOUT_PAGE_STYLE.historyRowDividerBase}
                  hiddenClassName="opacity-100 scale-x-0"
                  visibleClassName="opacity-100 scale-x-100"
                />
              ) : null}
              {!isOddRow ? <div className={ABOUT_PAGE_STYLE.historyDividerGap} /> : null}

              {rowItems.map((item, cardIndex) => (
                <div key={`${item.year}-${item.date}`} className="contents">
                  <ScrollReveal
                    as="article"
                    delayMs={
                      (isOddRow ? cardIndex : cardIndex + 1) * HISTORY_STAGGER_MS
                    }
                    durationMs={820}
                    className={ABOUT_PAGE_STYLE.historyCard}
                  >
                    <div className={ABOUT_PAGE_STYLE.historyImageWrap}>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1279px) 15rem, 28rem"
                        className={ABOUT_PAGE_STYLE.historyImage}
                      />
                    </div>

                    <div className={ABOUT_PAGE_STYLE.historyTextCol}>
                      <span
                        className={`${ABOUT_PAGE_STYLE.historyYear} ${isOddRow ? ABOUT_PAGE_STYLE.historyYearOdd : ABOUT_PAGE_STYLE.historyYearEven}`}
                      >
                        {item.year}
                      </span>

                      <div className={ABOUT_PAGE_STYLE.historyMetaWrap}>
                        <p className={ABOUT_PAGE_STYLE.historyDate}>{item.date}</p>
                        <p className={ABOUT_PAGE_STYLE.historyTitle}>{item.title}</p>
                      </div>
                    </div>
                  </ScrollReveal>

                  {cardIndex < rowItems.length - 1 ? (
                    <div className={ABOUT_PAGE_STYLE.historyCardGap} />
                  ) : null}
                </div>
              ))}

              {isOddRow && !isLastRow ? (
                <div className={ABOUT_PAGE_STYLE.historyDividerGap} />
              ) : null}
              {isOddRow && !isLastRow ? (
                <ScrollReveal
                  delayMs={rowItems.length * HISTORY_STAGGER_MS}
                  durationMs={760}
                  threshold={0.12}
                  className={ABOUT_PAGE_STYLE.historyRowDividerBase}
                  hiddenClassName="opacity-100 scale-x-0"
                  visibleClassName="opacity-100 scale-x-100"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}