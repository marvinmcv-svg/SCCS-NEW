"use client";

import { useEffect } from "react";

/**
 * Re-tints the fixed navigation to match the section under it.
 * Sections declare `data-color="field|rose|lgrey|grey|navy|card"`; the colour of the
 * section crossing the nav's bottom edge is written to `<body data-menu>`, and the
 * nav reads `--nav-bg` / `--nav-ink` from there (see globals.css).
 */
export function useSectionTint(deps: unknown[] = []) {
  useEffect(() => {
    const body = document.body;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-color]"));
    if (!sections.length) {
      body.dataset.menu = "field";
      return;
    }
    // The nav height only changes with the viewport, so read it once per resize, not per frame.
    let navHeight = 60;
    const readNavH = () => (navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 60);
    readNavH();
    const navH = () => navHeight;
    const pick = () => {
      const line = navH() - 1;
      let current: string | undefined;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = s.dataset.color;
      }
      body.dataset.menu = current ?? "field";
    };
    // An observer whose band is the nav's bottom edge re-picks when a section crosses it; a
    // frame-throttled scroll check backs it up, so even a long jump lands on the right colour.
    const io = new IntersectionObserver(pick, { rootMargin: `-${navH() - 1}px 0px -${window.innerHeight - navH()}px 0px` });
    sections.forEach((s) => io.observe(s));
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pick();
      });
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      readNavH();
      pick();
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Marks the body as loaded after hydration, which starts the `.fade` entrances. */
export function useLoaded() {
  useEffect(() => {
    const id = requestAnimationFrame(() => (document.body.dataset.loaded = ""));
    return () => cancelAnimationFrame(id);
  }, []);
}
