import { useEffect, useMemo, useRef, useState } from "react";

type UseVirtualizedRowsOptions = {
  itemCount: number;
  rowHeight: number;
  overscan?: number;
  enabled?: boolean;
  resetKey?: string | number;
};

export function useVirtualizedRows({
  itemCount,
  rowHeight,
  overscan = 4,
  enabled = true,
  resetKey,
}: UseVirtualizedRowsOptions) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(rowHeight * 8);

  useEffect(() => {
    const node = scrollRef.current;

    if (!node || !enabled) return;

    const updateViewport = () => {
      setViewportHeight(node.clientHeight || rowHeight * 8);
      setScrollTop(node.scrollTop);
    };

    updateViewport();

    const observer = new ResizeObserver(updateViewport);
    observer.observe(node);

    const handleScroll = () => {
      setScrollTop(node.scrollTop);
    };

    node.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      node.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [enabled, rowHeight]);

  useEffect(() => {
    const node = scrollRef.current;

    if (node) {
      node.scrollTop = 0;
    }
  }, [resetKey]);

  const totalHeight = itemCount * rowHeight;
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const startIndex = enabled
    ? Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    : 0;
  const endIndex = enabled
    ? Math.min(itemCount, startIndex + visibleCount)
    : itemCount;

  const windowedRange = useMemo(
    () => ({
      startIndex,
      endIndex,
      topSpacerHeight: enabled ? startIndex * rowHeight : 0,
      bottomSpacerHeight: enabled
        ? Math.max(0, totalHeight - endIndex * rowHeight)
        : 0,
      totalHeight,
    }),
    [enabled, endIndex, rowHeight, startIndex, totalHeight],
  );

  return {
    scrollRef,
    windowedRange,
    shouldVirtualize: enabled,
  };
}
