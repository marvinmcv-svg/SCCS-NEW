"use client";

import Link from "next/link";
import { useLang } from "./i18n";
import { Crest } from "./sccs-shared";
import { PORTALS } from "@/data/pages";
import { SITE } from "@/lib/site";

/** Anchors on /legal, in the order of the footer's legal labels (Privacy, Terms, Accessibility). */
const LEGAL_ANCHORS = ["privacy", "terms", "accessibility"];

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
export { InstagramGlyph };

export function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  const explore = [
    { href: "/admissions", label: lang === "en" ? "Admissions" : "Admisiones" },
    { href: "/learning/dual-diploma", label: lang === "en" ? "Academic Excellence" : "Excelencia Académica" },
    { href: "/learning/university-matriculation", label: lang === "en" ? "University Outcomes" : "Resultados Universitarios" },
    { href: "/campus-life/jaguar-experience", label: lang === "en" ? "The Jaguar Experience" : "La Experiencia Jaguar" },
    { href: "/discover/careers", label: lang === "en" ? "Work at SCCS" : "Trabaja en SCCS" },
    { href: "/discover/school-profile", label: lang === "en" ? "School Profile" : "Perfil Escolar" },
  ];
  const families = [
    { href: "/news", label: "Jaguar News" },
    { href: "/campus-life#events", label: lang === "en" ? "School Calendar" : "Calendario Escolar" },
    { href: "/community#parent-hub", label: lang === "en" ? "Student & Parent Handbooks" : "Manuales de Estudiantes y Padres" },
    { href: "/learning/student-support", label: lang === "en" ? "The Hub · Student Support" : "The Hub · Apoyo Estudiantil" },
    { href: "/community#dining", label: lang === "en" ? "Catering · La Palette" : "Comedor · La Palette" },
  ];

  const col = "flex flex-col";
  // Phones get a full 44px tap row per link; desktop keeps the spec's tight list.
  const link = "link-grow inline-flex min-h-11 items-center self-start leading-[1.4] md:mb-[0.75em] md:block md:min-h-0";
  return (
    <footer id="footer" data-color="field" className="tabbar-safe mt-auto bg-field px-[var(--gutter-page)] py-[max(56px,8.33vw)] text-field-ink t-small md:px-[1.74vw]">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-12 md:flex-row">
        {/* Logo column: 35%, logo set to the right of it */}
        <div className="flex md:w-[35%] md:justify-end md:pr-[10%]">
          <Link href="/" aria-label="SCCS home" className="inline-flex items-start gap-3">
            <Crest className="h-[max(64px,5.5vw)] w-[max(64px,5.5vw)] shrink-0" />
            <span className="font-brand pt-1 font-bold uppercase leading-[1.05] tracking-[0.02em]">
              <span className="block text-[max(17px,1.35vw)]">Santa Cruz</span>
              <span className="block text-[max(12px,0.95vw)] tracking-[0.04em]">Cooperative School</span>
            </span>
          </Link>
        </div>

        {/* Three stacked link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:w-[65%] md:grid-cols-3 md:gap-x-[4vw]">
          <nav aria-label={t.footer.explore} className={col}>
            {explore.map((l) => (
              <Link key={l.href} href={l.href} className={link}>
                {l.label}
              </Link>
            ))}
            {families.map((l) => (
              <Link key={l.href} href={l.href} className={link}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className={col}>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {t.footer.address}
            </a>
            <a href={SITE.phoneHref} className={link}>
              {t.footer.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className={link}>
              {t.footer.email}
            </a>
            <span className="flex min-h-11 items-center opacity-80 md:mb-[0.75em] md:block md:min-h-0">{t.footer.hours}</span>
            {t.footer.legal.map((l, i) => (
              <Link key={l} href={`/legal#${LEGAL_ANCHORS[i] ?? "privacy"}`} className={link}>
                {l}
              </Link>
            ))}
          </div>
          <div className={col}>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className={link}>
              Instagram
            </a>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={link}>
              Facebook
            </a>
            {PORTALS.slice(0, 4).map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className={link}>
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Extra room on phones so the Carlita button never sits on top of the last line. */}
      <p className="mx-auto mt-[max(40px,4vw)] max-w-[110rem] pb-20 opacity-70 sm:pb-0 md:pl-[35%]">
        © {year} {t.footer.rights}
      </p>
    </footer>
  );
}
