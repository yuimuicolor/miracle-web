import { ABOUT_PAGE_STYLE } from "@/lib/constants/aboutPage";
import { SectionHeadingProps } from "@/lib/types/aboutUs";
import { ReactNode } from "react";

export function SectionHeading({
  headingEn,
  headingKo,
  description,
}: SectionHeadingProps) {
  return (
    <>
      <p className={ABOUT_PAGE_STYLE.sectionHeadingEn}>{headingEn}</p>
      <h3 className={ABOUT_PAGE_STYLE.sectionHeadingKr}>{headingKo}</h3>
      <p className={ABOUT_PAGE_STYLE.sectionHeadingDesc}>{description}</p>
    </>
  );
}

export function renderMultilineText(text: string): ReactNode {
  return text.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}