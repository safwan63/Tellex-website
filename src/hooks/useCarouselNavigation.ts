import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';

const SWIPE_THRESHOLD_PX = 48;

type Options = {
  autoPlayInterval?: number;
  paused?: boolean;
};

export function useCarouselNavigation(count: number, options: Options = {}) {
  const { autoPlayInterval = 5000, paused = false } = options;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count <= 0) return;
      setIndex(((nextIndex % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      touchStartX.current = null;
      touchStartY.current = null;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;

      if (deltaX > 0) prev();
      else next();
    },
    [next, prev]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(next, autoPlayInterval);
    return () => window.clearInterval(id);
  }, [paused, count, next, autoPlayInterval]);

  return {
    index,
    setIndex: goTo,
    next,
    prev,
    swipeHandlers: { onTouchStart, onTouchEnd },
  };
}
