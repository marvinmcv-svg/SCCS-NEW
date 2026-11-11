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
    const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 60;
    const pick = () => {
      const line = navH() - 1;
      let current: string | undefined;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = s.dataset.color;
      }
      body.dataset.menu = current ?? "field";
    };
    // An observer whose band is the nav's bottom edge: any section entering or leaving it re-picks.
    const io = new IntersectionObserver(pick, { rootMargin: `-${navH() - 1}px 0px -${window.innerHeight - navH()}px 0px` });
    sections.forEach((s) => io.observe(s));
    pick();
    window.addEventListener("resize", pick);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", pick);
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
