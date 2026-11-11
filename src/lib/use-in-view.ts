"use client";

import { useEffect, useState } from "react";

/**
 * Whether `ref` is within `margin` (a fraction of the viewport height) of the screen;
 * `initial` is the value before the first measurement.
 * Continuous animations use it to stop while off screen. An IntersectionObserver drives
 * it, with a frame-throttled scroll check as backup: an observer alone can miss its
 * callback while the page is busy.
 */
export function useInView(ref: React.RefObject<Element | null>, margin = 0, initial = true) {
  const [inView, setInView] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      const pad = window.innerHeight * margin;
      setInView(r.bottom > -pad && r.top < window.innerHeight + pad);
    };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    };
    const io = new IntersectionObserver(check, { rootMargin: `${margin * 100}% 0px` });
    io.observe(el);
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, margin]);
  return inView;
}
