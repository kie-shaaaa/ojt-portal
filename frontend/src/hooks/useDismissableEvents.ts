import { RefObject, useEffect } from "react";

export function useEscapeKey(
  onEscape: () => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [enabled, onEscape]);
}

export function useOutsidePointerDown<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsidePointerDown: () => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      const current = ref.current;

      if (!current || !target || current.contains(target)) {
        return;
      }

      onOutsidePointerDown();
    };

    document.addEventListener("mousedown", handlePointerDown, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [enabled, onOutsidePointerDown, ref]);
}
