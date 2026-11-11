"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { PILLARS, type NavPillar } from "@/data/nav";
import { cn } from "@/lib/utils";
import { useLang } from "./i18n";
import { Crest } from "./sccs-shared";
import { openPalette } from "./command-palette";

/* ───────── Pieces ───────── */

function LangToggle({ className }: { className?: string }) {
  const { lang, toggleLang, t } = useLang();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={`${t.misc.localeLabel}: ${lang === "en" ? "English" : "Español"}`}
      className={cn("link-grow inline-flex min-h-11 items-center gap-1 text-[length:var(--fs-nav)] font-medium", className)}
    >
      <span className={cn(lang !== "en" && "opacity-50")}>EN</span>
      <span className="opacity-40">/</span>
      <span className={cn(lang !== "es" && "opacity-50")}>ES</span>
    </button>
  );
}

/** Four flat shapes in the brand colours that drop into the mega-menu. */
function MegaShapes() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 h-full w-[28%]" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="mega-shape mega-shape-triangle absolute left-[12%] top-[43%] w-[10vw] min-w-16">
        <path d="M50 6 96 94H4Z" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 100 100" className="mega-shape mega-shape-square absolute left-[56%] top-[32%] w-[10vw] min-w-16">
        <rect x="6" y="6" width="88" height="88" rx="14" fill="var(--color-amber-400)" />
      </svg>
      <svg viewBox="0 0 200 100" className="mega-shape mega-shape-combined absolute bottom-0 left-[10%] w-[20vw] min-w-32">
        <path d="M0 100V50a50 50 0 0 1 100 0v50Z" fill="var(--color-rose)" />
        <rect x="100" y="20" width="100" height="80" fill="var(--color-navy-800)" />
      </svg>
      <svg viewBox="0 0 100 100" className="mega-shape mega-shape-circle absolute bottom-0 left-[66%] w-[9.3vw] min-w-14">
        <circle cx="50" cy="50" r="46" fill="var(--color-crimson-600)" />
      </svg>
    </div>
  );
}

function MegaMenu({ pillar, open, onClose, id }: { pillar: NavPillar | null; open: boolean; onClose: () => void; id: string }) {
  const { tr } = useLang();
  return (
    <div
      id={id}
      data-open={open}
      aria-hidden={!open}
      className={cn(
        "fixed inset-x-0 top-0 z-[55] hidden h-[max(26rem,32.64vw)] overflow-hidden bg-slate text-white transition-[transform,visibility] duration-500 lg:block",
        open ? "visible translate-y-0" : "invisible -translate-y-full",
      )}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {pillar && (
        <nav aria-label={tr(pillar.label)} className="flex h-full flex-col pb-[4vw] pl-[15.28vw] pr-[30%] pt-[calc(var(--nav-h)+3vw)]">
          <Link href={pillar.href} onClick={onClose} tabIndex={open ? 0 : -1} className="t-label mb-[1.2vw] opacity-80 hover:opacity-100">
            {tr(pillar.label)} →
          </Link>
          <ul className="flex min-h-0 flex-1 flex-col flex-wrap content-start gap-x-[4vw]">
            {pillar.children.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  className="link-grow inline-block text-[length:var(--fs-subnav)] leading-[2] opacity-90 transition-opacity hover:opacity-100"
                >
                  {tr(c.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <MegaShapes />
    </div>
  );
}

/* ───────── Header ───────── */

export function Header() {
  const { t, tr } = useLang();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const megaId = useId();
  const sheetId = useId();
  const [submenu, setSubmenu] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [heroLogoVisible, setHeroLogoVisible] = useState(isHome);
  const headerRef = useRef<HTMLElement>(null);

  // On the home page the small nav logo waits until the big hero logo has scrolled away.
  useEffect(() => {
    if (!isHome) {
      setHeroLogoVisible(false);
      return;
    }
    const el = document.getElementById("hero-logo");
    if (!el) {
      setHeroLogoVisible(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setHeroLogoVisible(e.isIntersecting), { rootMargin: "-60px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [isHome]);

  // Close menus on route change.
  useEffect(() => {
    setSubmenu(null);
    setSheetOpen(false);
    setExpanded(null);
  }, [pathname]);

  // The open mega-menu re-tints the bar; Esc and outside clicks close it.
  useEffect(() => {
    if (submenu) document.body.dataset.submenu = submenu;
    else delete document.body.dataset.submenu;
    if (!submenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSubmenu(null);
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (headerRef.current?.contains(target) || document.getElementById(megaId)?.contains(target)) return;
      setSubmenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [submenu, megaId]);

  // Lock scroll while the mobile sheet is open; Esc closes it.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const activeId =
    PILLARS.find((p) => pathname.startsWith(p.href) || p.children.some((c) => pathname === c.href.split("#")[0]))?.id ??
    (pathname.startsWith("/news") ? "campus-life" : pathname.startsWith("/contact") ? "community" : null);
  const openPillar = PILLARS.find((p) => p.id === submenu) ?? null;

  return (
    <>
      <MegaMenu pillar={openPillar} open={!!submenu} onClose={() => setSubmenu(null)} id={megaId} />

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-[60] flex h-[var(--nav-h)] items-center bg-[var(--nav-bg)] px-[var(--gutter-page)] text-[var(--nav-ink)] backdrop-blur-md transition-[color,background-color] duration-300"
      >
        <Link
          href="/"
          aria-label="Santa Cruz Cooperative School — home"
          className={cn("shrink-0 transition-opacity duration-300", heroLogoVisible && !submenu ? "pointer-events-none opacity-0" : "opacity-100")}
          tabIndex={heroLogoVisible ? -1 : 0}
        >
          <Crest mono={!!submenu} className="h-[max(35px,2.43vw)] w-[max(35px,2.43vw)]" />
        </Link>

        <nav aria-label="Primary" className="ml-[6.6vw] hidden flex-1 items-center justify-between gap-4 lg:flex">
          {PILLARS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-expanded={submenu === p.id}
              aria-controls={megaId}
              data-active={activeId === p.id}
              onClick={() => setSubmenu((s) => (s === p.id ? null : p.id))}
              className="link-grow min-h-11 whitespace-nowrap text-[length:var(--fs-nav)] leading-[2]"
            >
              {tr(p.label)}
            </button>
          ))}
          <Link href="/contact" data-active={pathname === "/contact"} className="link-grow whitespace-nowrap text-[length:var(--fs-nav)] leading-[2]">
            {tr({ en: "Contact", es: "Contacto" })}
          </Link>
          <span className="flex items-center gap-5">
            <button type="button" onClick={openPalette} aria-label={t.nav.search} className="link-grow inline-flex min-h-11 items-center">
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <LangToggle />
            <Link href="/admissions#inquire" className="btn-outline min-h-9 px-5 text-[length:var(--fs-nav)] leading-[1.9]">
              {t.nav.apply}
            </Link>
          </span>
        </nav>

        {/* Mobile */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <button type="button" onClick={openPalette} aria-label={t.nav.search} className="grid h-11 w-11 place-items-center">
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setSheetOpen((o) => !o)}
            aria-label={sheetOpen ? t.nav.close : t.misc.openMenu}
            aria-expanded={sheetOpen}
            aria-controls={sheetId}
            className="burger relative z-[71] grid h-11 w-11 place-items-center"
          >
            <span className="block w-6">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile sheet: slides in from the right on the field colour. */}
      <div
        id={sheetId}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        aria-hidden={!sheetOpen}
        className={cn(
          "fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-field text-field-ink shadow-[0_0_15px_rgba(0,0,0,0.15)] transition-[transform,visibility] duration-500 lg:hidden",
          sheetOpen ? "visible translate-x-0" : "invisible translate-x-full",
        )}
      >
        <div className="flex h-[var(--nav-h)] shrink-0 items-center justify-between px-[var(--gutter-page)]">
          <Crest className="h-9 w-9" />
          <button type="button" onClick={() => setSheetOpen(false)} aria-label={t.nav.close} className="grid h-11 w-11 place-items-center text-2xl">
            ×
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 px-[10.4vw] pb-10 pt-[6vw]">
          <ul>
            {PILLARS.map((p) => {
              const isOpen = expanded === p.id;
              const dimmed = expanded !== null && !isOpen;
              return (
                <li key={p.id} className={cn("transition-all duration-300", dimmed && "opacity-75")}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`${t.nav.explore} ${tr(p.label)}`}
                    onClick={() => setExpanded((e) => (e === p.id ? null : p.id))}
                    className={cn("flex min-h-11 w-full items-center gap-3 text-left font-bold transition-[font-size] duration-300", dimmed ? "text-[max(15px,4.17vw)]" : "text-[min(28px,6.6vw)]")}
                    tabIndex={sheetOpen ? 0 : -1}
                  >
                    <span className="w-[1ch] shrink-0" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                    {tr(p.label)}
                  </button>
                  {isOpen && (
                    <ul className="pb-3 pl-[calc(1ch+0.75rem)]">
                      {p.children.map((c) => (
                        <li key={c.href} className="mb-[0.6em]">
                          <Link href={c.href} className="text-[min(22px,5.2vw)]" tabIndex={sheetOpen ? 0 : -1}>
                            {tr(c.label)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className={cn("transition-all duration-300", expanded !== null && "opacity-75")}>
              <Link
                href="/contact"
                className={cn("flex min-h-11 items-center gap-3 font-bold transition-[font-size] duration-300", expanded !== null ? "text-[max(15px,4.17vw)]" : "text-[min(28px,6.6vw)]")}
                tabIndex={sheetOpen ? 0 : -1}
              >
                <span className="w-[1ch]" aria-hidden="true" />
                {tr({ en: "Contact", es: "Contacto" })}
              </Link>
            </li>
          </ul>
          <div className="mt-10 flex items-center gap-6">
            <LangToggle />
            <Link href="/admissions#inquire" className="btn-cta" tabIndex={sheetOpen ? 0 : -1}>
              {t.nav.apply}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
