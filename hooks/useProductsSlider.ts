import { useEffect, useRef, useState } from "react";

const AUTO_SPEED = 1;
const MOBILE_AUTO_SPEED = 0.5;
const ARROW_SCROLL_DURATION = 420;

interface SliderOptions {
  isInfinite?: boolean;
  autoScroll?: boolean;
}

export function useProductsSlider(
  productsLength: number,
  options?: SliderOptions,
) {
  const { isInfinite = true, autoScroll = true } = options || {};

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  // 가속도 및 상태관리를 위한 Ref
  const rafRef = useRef<number>(0);
  const halfRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const modeRef = useRef<"auto" | "momentum">("auto");
  const momentumVRef = useRef(0);
  const autoCarryRef = useRef(0);
  const dragMovedRef = useRef(false);
  const isHoverPauseRef = useRef(false);
  const arrowAnimRef = useRef<number>(0);
  const autoScrollEnabledRef = useRef(true);
  const autoSpeedRef = useRef(AUTO_SPEED);

  // 내부 유틸리티 함수 (계산 로직)
  const normalizeScroll = (value: number) => {
    const half = halfRef.current;
    if (half <= 0) return value;
    return ((value % half) + half) % half;
  };

  const calcHalf = () => {
    if (trackRef.current && productsLength > 0) {
      halfRef.current = trackRef.current.scrollWidth / 2;
    }
  };

  // 윈도우 리사이즈 및 자동 스크롤 속도 조절
  useEffect(() => {
    const updateAutoSpeed = () => {
      autoSpeedRef.current =
        window.innerWidth < 768 ? MOBILE_AUTO_SPEED : AUTO_SPEED;
      calcHalf();
    };
    updateAutoSpeed();
    window.addEventListener("resize", updateAutoSpeed);
    return () => window.removeEventListener("resize", updateAutoSpeed);
  }, [productsLength]);

  // 메인 애니메이션 루프
  useEffect(() => {
    const container = trackRef.current;
    if (!container || productsLength === 0 || !autoScroll) return; // ❌ autoScroll이 false면 종료

    const loop = () => {
      if (!isDragging.current && !isHoverPauseRef.current) {
        const half = halfRef.current;
        if (half > 0) {
          if (container.scrollLeft >= half) container.scrollLeft -= half;

          if (modeRef.current === "momentum") {
            momentumVRef.current *= 0.86;
            if (Math.abs(momentumVRef.current) < 0.8) {
              modeRef.current = "auto";
              momentumVRef.current = 0;
            } else {
              container.scrollLeft = normalizeScroll(
                container.scrollLeft - momentumVRef.current,
              );
            }
          } else if (autoScrollEnabledRef.current) {
            autoCarryRef.current += autoSpeedRef.current;
            const movePx = Math.floor(autoCarryRef.current);
            if (movePx > 0) {
              container.scrollLeft = normalizeScroll(
                container.scrollLeft + movePx,
              );
              autoCarryRef.current -= movePx;
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [productsLength, autoScroll]);

  // 애니메이션 제어 함수
  const stopArrowAnimation = () => {
    if (!arrowAnimRef.current) return;
    cancelAnimationFrame(arrowAnimRef.current);
    arrowAnimRef.current = 0;
  };

  const animateScrollBy = (delta: number) => {
    const container = trackRef.current;
    if (!container) return;

    const startLeft = container.scrollLeft;
    const startTime = performance.now();

    stopArrowAnimation();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / ARROW_SCROLL_DURATION, 1);
      const eased = 1 - (1 - progress) ** 3;

      const targetLeft = startLeft + delta * eased;
      container.scrollLeft = isInfinite
        ? normalizeScroll(targetLeft)
        : targetLeft;

      if (progress < 1) {
        arrowAnimRef.current = requestAnimationFrame(tick);
      }
    };

    arrowAnimRef.current = requestAnimationFrame(tick);
  };

  // 외부 노출용 이벤트 핸들러
  const scrollByCard = (direction: "prev" | "next") => {
    const container = trackRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>(
      "[data-product-card='true']",
    );
    if (!firstCard) return;

    const gap =
      Number.parseFloat(getComputedStyle(container).columnGap || "0") || 0;

    const step = firstCard.offsetWidth + gap;

    animateScrollBy(direction === "next" ? step : -step);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = trackRef.current;
    if (!container) return;

    stopArrowAnimation();

    isDragging.current = true;
    dragMovedRef.current = false;
    setGrabbing(true);

    dragStartX.current = e.pageX - container.getBoundingClientRect().left;
    dragScrollLeft.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !trackRef.current) return;

    const now = Date.now();
    const dt = now - lastTimeRef.current; // 시간 차이
    const dx = e.pageX - lastXRef.current; // 이동 거리 차이

    if (dt > 0) {
      // 이동 거리를 시간으로 나눠서 속도 계산 (14는 적당한 가중치)
      velocityRef.current = (dx / dt) * 14;
    }

    // 다음 계산을 위해 현재 값들을 저장
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;

    const container = trackRef.current;
    if (!container) return;

    const x = e.pageX - container.getBoundingClientRect().left;

    if (Math.abs(x - dragStartX.current) > 6) {
      dragMovedRef.current = true;
    }

    container.scrollLeft =
      dragScrollLeft.current - (x - dragStartX.current) * 1.8;
  };

  const stopDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setGrabbing(false);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!dragMovedRef.current) return;
    e.preventDefault();
    dragMovedRef.current = false;
  };

  return {
    trackRef,
    grabbing,
    isHoverPauseRef,
    dragMovedRef,
    handleMouseDown,
    handleMouseMove,
    stopDrag,
    handleCardClick,
    scrollByCard,
  };
}
