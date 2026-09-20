export type RafBatcher = {
  schedule: () => void;
  cancel: () => void;
};

export const createRafBatcher = (flush: () => void): RafBatcher => {
  let rafId: number | null = null;
  return {
    schedule: () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        flush();
      });
    },
    cancel: () => {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    },
  };
};

export type ScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

export const isNearBottom = (metrics: ScrollMetrics, thresholdPx: number = 40): boolean => {
  const remaining = metrics.scrollHeight - metrics.clientHeight - metrics.scrollTop;
  return remaining <= thresholdPx;
};

/**
 * Detect whether the current client is a mobile device or small touch screen.
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const hasTouch = typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || (hasTouch && isSmallScreen);
};

