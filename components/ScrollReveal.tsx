"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface ScrollRevealProps {
  children?: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  rootMargin?: string;
  as?: ElementType;
  hiddenClassName?: string;
  visibleClassName?: string;
}

export default function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  durationMs = 950,
  threshold = 0.2,
  rootMargin = "0px 0px 28% 0px",
  as,
  hiddenClassName,
  visibleClassName,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        // Tunable per-section trigger window.
        rootMargin,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const Component = (as ?? "div") as ElementType;
  const style: CSSProperties = {
    transitionDelay: `${delayMs}ms`,
    transitionDuration: `${durationMs}ms`,
  };

  return (
    <Component
      ref={targetRef}
      style={style}
      className={[
        className,
        "transition-[opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
        isVisible
          ? (visibleClassName ?? "opacity-100 translate-y-0 blur-0")
          : (hiddenClassName ?? "opacity-0 translate-y-[2.4rem] blur-[6px]"),
      ].join(" ")}
    >
      {children}
    </Component>
  );
}
