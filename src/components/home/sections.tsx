"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { PAGE_PHOTOS } from "@/data/page-photos";
import { EXPERIENCES } from "@/data/experiences";
import { TRADITIONS } from "@/data/traditions";
import { INSTAGRAM_POSTS, sortedNews, upcomingEvents } from "@/data/sccs-content";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useLang } from "../sccs/i18n";
import { Photo, SchoolJaguar, buttonStyles } from "../sccs/sccs-shared";
import { JourneyTabs } from "../sccs/journey";
import { GlobeExplorer } from "../sccs/globe-explorer";
import { CATEGORY_LABEL } from "../sccs/campus-life";
import { InstagramGlyph } from "../sccs/footer";
import { AcceptancePosters, PrestigeMarquee } from "../sccs/credentials";
import { Aurora, CountFigure, Marquee, Words, gsap, useGSAP } from "./motion";

/* ───────── Shared pieces ───────── */

const wrap = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12";
const h2 = "font-display text-balance text-[2.5rem] font-bold leading-[1] sm:text-6xl lg:text-[4.25rem]";

function More({ href, children, dark }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-base font-semibold transition-colors",
        dark ? "text-amber-400 hover:text-white" : "text-navy-800 hover:text-crimson-600",
      )}
    >
      {children}
      <span className={cn("grid h-8 w-8 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1", dark ? "bg-white/10" : "bg-navy-800 text-white")}>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

/* ───────── Bento building blocks ───────── */

type PillTone = "light" | "navy";

/** The rounded outline pill used on every card ("Explore", "Learn more"). */
function Pill({ href, children, tone = "light", className }: { href: string; children: React.ReactNode; tone?: PillTone; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "pressable group inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors duration-300",
        tone === "light" ? "border-white/80 text-white hover:bg-white hover:text-navy-950" : "border-navy-800/40 text-navy-800 hover:border-navy-800 hover:bg-navy-800 hover:text-white",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

/** A photograph card with its words centred over a soft shade, like a video still. */
function PhotoCard({
  photo,
  sizes,
  className,
  children,
}: {
  photo: ReturnType<typeof reasonPhoto>;
  sizes: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-rise className={cn("group relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[1.75rem] bg-navy-900 p-8 text-center text-white", className)}>
      <Photo
        photo={photo}
        className="absolute inset-0 -z-10"
        sizes={sizes}
        imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 -z-10 bg-navy-950/50" aria-hidden="true" />
      <div className="flex max-w-xl flex-col items-center">{children}</div>
    </div>
  );
}

/** An ivory card: a small eyebrow over a few light, large words. */
function NoteCard({ eyebrow, children, className }: { eyebrow: string; children: React.ReactNode; className?: string }) {
  return (
    <div data-rise className={cn("flex flex-col items-center justify-center rounded-[1.75rem] bg-ivory p-6 text-center sm:p-8", className)}>
      <p className="text-sm text-mist">{eyebrow}</p>
      <div className="font-display mt-3 text-2xl font-light leading-snug text-navy-800 sm:text-[1.65rem]">{children}</div>
    </div>
  );
}

/* ───────── Highlights: the school at a glance, as a bento of cards ───────── */

// Read at render time: admin edits replace these photos after the module loads.
const reasonPhoto = (i: number) => {
  const h = PAGE_PHOTOS.home;
  return [h.whySccsTile1, h.whySccsTile2, h.whySccsTile3, h.whySccsTile4, h.whySccsTile5, h.whySccsTile6][i];
};

export function Stats() {
  const { t, tr } = useLang();
  const h = t.home;
  const [, university, english, vex, tradition, acres] = h.reasons;
  const [matric, years, twoDiplomas, campus] = t.stats;
  return (
    <section id="stats" className="py-4 sm:py-6">
      <div className={cn(wrap, "grid gap-4 lg:grid-cols-12 lg:gap-5")}>
        {/* 1 · The headline card */}
        <PhotoCard photo={reasonPhoto(0)} sizes="100vw" className="min-h-[26rem] lg:col-span-12 lg:min-h-[36rem]">
          <h2 className="font-display text-4xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">{h.advantageTitle}</h2>
          <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">{h.advantageBody}</p>
          <Pill href="/discover" className="mt-7">
            {h.advantageCta}
          </Pill>
        </PhotoCard>

        {/* 2 · Two diplomas  |  University */}
        <div data-rise className="flex flex-col items-center justify-center rounded-[1.75rem] bg-ivory p-8 text-center sm:p-12 lg:col-span-6">
          <p className="text-sm text-mist">{tr({ en: "Did you know?", es: "¿Sabías que?" })}</p>
          <h3 className="font-display mt-3 max-w-md text-3xl font-light leading-tight text-navy-800 sm:text-[2.6rem]">
            {tr({ en: "Every graduate can earn two diplomas:", es: "Cada graduado puede obtener dos diplomas:" })}
          </h3>
          <div className="mt-10 grid w-full max-w-md grid-cols-2 divide-x divide-navy-800/15">
            {[
              { kind: "us" as const, title: t.dualDiploma.usTitle },
              { kind: "bo" as const, title: t.dualDiploma.boTitle },
            ].map((d) => (
              <div key={d.kind} className="flex flex-col items-center gap-4 px-4">
                <Flag kind={d.kind} />
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-navy-800">{d.title}</p>
              </div>
            ))}
          </div>
        </div>
        <PhotoCard photo={reasonPhoto(1)} sizes="(min-width:1024px) 50vw, 100vw" className="lg:col-span-6">
          <p className="font-display text-7xl font-semibold leading-none sm:text-8xl">
            <CountFigure value={university.stat} />
          </p>
          <p className="font-display mt-3 text-3xl font-light sm:text-4xl">{university.label}</p>
          <p className="mt-3 text-base text-white/85">{university.line}</p>
          <Pill href="/learning/university-matriculation" className="mt-7">
            {t.matriculation.more}
          </Pill>
        </PhotoCard>

        {/* 3 · Robotics  |  Years of excellence */}
        <PhotoCard photo={reasonPhoto(3)} sizes="(min-width:1024px) 50vw, 100vw" className="lg:col-span-6">
          <p className="font-display text-4xl font-light leading-tight sm:text-5xl">
            {vex.stat} {vex.label}
          </p>
          <p className="mt-3 text-base text-white/85">{vex.line}</p>
          <Pill href="/campus-life/jaguar-experience/innovation-hub" className="mt-7">
            {t.campusLife.exploreAll}
          </Pill>
        </PhotoCard>
        <div data-rise className="flex flex-col items-center justify-center rounded-[1.75rem] bg-ivory p-8 text-center lg:col-span-6">
          <p
            className="font-display select-none text-[10rem] font-bold leading-none tracking-[-0.06em] text-transparent sm:text-[13rem]"
            style={{ WebkitTextStroke: "3px var(--color-navy-700)" }}
            aria-hidden="true"
          >
            <span data-count={years.value}>{years.value}</span>
            <span style={{ WebkitTextStroke: "3px var(--color-amber-500)" }}>{years.suffix}</span>
          </p>
          <p className="mt-4 max-w-xs text-lg text-navy-800">
            <span className="sr-only">
              {years.value}
              {years.suffix}{" "}
            </span>
            {years.label} · {years.note}
          </p>
        </div>

        {/* 4 · Four quick facts  |  Tradition */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:gap-5">
          <NoteCard eyebrow={matric.note}>
            <strong className="font-semibold">
              {matric.value}
              {matric.suffix}
            </strong>{" "}
            {matric.label}
          </NoteCard>
          <NoteCard eyebrow={twoDiplomas.note}>
            <strong className="font-semibold">{twoDiplomas.value}</strong> {twoDiplomas.label}
          </NoteCard>
          <NoteCard eyebrow={english.label}>
            <strong className="font-semibold">{english.stat}</strong> · {english.line}
          </NoteCard>
          <NoteCard eyebrow={campus.note}>
            <strong className="font-semibold">{campus.value}</strong> {campus.label}
          </NoteCard>
        </div>
        <PhotoCard photo={reasonPhoto(4)} sizes="(min-width:1024px) 50vw, 100vw" className="lg:col-span-6">
          <p className="font-display text-4xl font-light leading-tight sm:text-5xl">
            {tradition.stat} · {tradition.label}
          </p>
          <p className="mt-3 text-base text-white/85">{tradition.line}</p>
          <Pill href="/campus-life/beyond-the-classroom" className="mt-7">
            {t.campusLife.beyondCta}
          </Pill>
        </PhotoCard>

        {/* 5 · Campus  |  The Jaguar spirit */}
        <PhotoCard photo={reasonPhoto(5)} sizes="(min-width:1024px) 50vw, 100vw" className="lg:col-span-6">
          <p className="font-display text-4xl font-light leading-tight sm:text-5xl">
            {acres.stat} {acres.label}
          </p>
          <p className="mt-3 text-base text-white/85">{acres.line}</p>
          <Pill href="/discover/campus" className="mt-7">
            {tr({ en: "Tour the campus", es: "Recorre el campus" })}
          </Pill>
        </PhotoCard>
        <div data-rise className="relative isolate flex min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-navy-950 p-8 text-center text-white lg:col-span-6">
          <Aurora />
          <SchoolJaguar />
          <p className="font-display mt-8 text-3xl font-light leading-tight sm:text-4xl">{t.discover.jaguarKicker}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">{t.discover.jaguarBody}</p>
        </div>
      </div>
    </section>
  );
}

/* ───────── The SCCS Learner: four feature cards in alternating brand fields ───────── */

const FEATURE_TONES = [
  { card: "", title: "text-navy-800", body: "text-navy-900/75", pill: "navy" as PillTone },
  { card: "bg-amber-100", title: "text-navy-900", body: "text-navy-900/80", pill: "navy" as PillTone },
  { card: "bg-navy-800", title: "text-white", body: "text-white/80", pill: "light" as PillTone },
  { card: "", title: "text-crimson-600", body: "text-navy-900/75", pill: "navy" as PillTone },
];

export function Advantage() {
  const { t, tr } = useLang();
  return (
    <section id="discover" className="scroll-mt-24 py-24 sm:py-32">
      <div className={wrap}>
        <h2 className={cn(h2, "text-center text-navy-800")}>
          <Words text={t.home.learnerTitle} />
        </h2>
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:gap-5">
          {t.discover.learner.map((l, i) => {
            const tone = FEATURE_TONES[i % FEATURE_TONES.length];
            return (
              <li key={l.title} data-rise className={cn("flex flex-col rounded-[1.75rem] p-7 sm:p-10 lg:p-12", tone.card)}>
                <h3 className={cn("font-display text-3xl font-bold leading-[1.05] sm:text-4xl", tone.title)}>{l.title}</h3>
                <p className={cn("mt-5 max-w-lg text-lg leading-relaxed", tone.body)}>{l.line}</p>
                <div className="mt-8">
                  <Pill href="/discover" tone={tone.pill}>
                    {tr({ en: "Learn more", es: "Saber más" })}
                  </Pill>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Safety & Wellness: one photograph, one promise ───────── */

export function Safety() {
  const { t } = useLang();
  const h = t.home;
  return (
    <section className="panel my-4 bg-navy-950 py-24 text-white sm:py-32">
      <div className={cn(wrap, "grid items-center gap-14 lg:grid-cols-12")}>
        <div className="lg:col-span-5">
          <h2 className={h2}>
            <Words text={h.safetyTitle} />
          </h2>
          <p data-rise className="mt-8 max-w-xl text-xl leading-relaxed text-white/85">
            {h.safetyBody}
          </p>
          <ul data-rise className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-base text-white/85">
            {t.discover.safety.map((x) => (
              <li key={x.title} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                {x.title}
              </li>
            ))}
          </ul>
          <div data-rise className="mt-10">
            <More href="/discover/safety-wellness" dark>
              {h.safetyCta}
            </More>
          </div>
        </div>
        <div className="relative grid grid-cols-6 gap-4 lg:col-span-7">
          <div data-clip className="col-span-6 overflow-hidden rounded-[2rem] sm:col-span-4">
            <Photo photo={PAGE_PHOTOS.home.safetyLarge} className="aspect-[4/3] sm:aspect-[4/5]" sizes="(min-width:1024px) 38vw, 100vw" />
          </div>
          <div className="col-span-6 grid grid-cols-2 gap-4 sm:col-span-2 sm:grid-cols-1 sm:content-end">
            <div data-parallax="12" className="overflow-hidden rounded-[1.5rem]">
              <Photo photo={PAGE_PHOTOS.home.safetySmallLeft} className="aspect-square" sizes="(min-width:1024px) 18vw, 50vw" />
            </div>
            <div data-parallax="18" className="overflow-hidden rounded-[1.5rem]">
              <Photo photo={PAGE_PHOTOS.home.safetySmallRight} className="aspect-square" sizes="(min-width:1024px) 18vw, 50vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Dual Diploma: two credentials converge into one program ───────── */

function Flag({ kind }: { kind: "us" | "bo" }) {
  return kind === "us" ? (
    <svg viewBox="0 0 60 40" className="h-8 w-12 shrink-0 overflow-hidden rounded-md" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} y={i * 5.72} width="60" height="2.86" fill="#C8323A" />
      ))}
      <rect width="26" height="20" fill="#3A3D8C" />
    </svg>
  ) : (
    <svg viewBox="0 0 60 40" className="h-8 w-12 shrink-0 overflow-hidden rounded-md" aria-hidden="true">
      <rect width="60" height="13.4" fill="#D52B1E" />
      <rect y="13.3" width="60" height="13.4" fill="#F4E400" />
      <rect y="26.6" width="60" height="13.4" fill="#007934" />
    </svg>
  );
}

function Credential({ kind, title, points }: { kind: "us" | "bo"; title: string; points: string[] }) {
  return (
    <div data-credential={kind} className="rounded-[2rem] bg-white/[0.07] p-7 ring-1 ring-inset ring-white/15 backdrop-blur-xl sm:p-9">
      <Flag kind={kind} />
      <h3 className="font-display mt-6 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h3>
      <ul className="mt-6 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex gap-3 text-base leading-snug text-white/85">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DualDiplomaHome() {
  const { t } = useLang();
  const d = t.dualDiploma;
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const st = { trigger: "[data-credentials]", start: "top 85%", end: "top 35%", scrub: 0.6 };
        gsap.fromTo('[data-credential="us"]', { xPercent: -8, rotate: -2 }, { xPercent: 0, rotate: 0, ease: "none", scrollTrigger: st });
        gsap.fromTo('[data-credential="bo"]', { xPercent: 8, rotate: 2 }, { xPercent: 0, rotate: 0, ease: "none", scrollTrigger: st });
        gsap.from("[data-plus]", { scale: 0, rotate: -90, ease: "back.out(2)", duration: 0.9, scrollTrigger: { trigger: "[data-credentials]", start: "top 45%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section ref={ref} id="learning" className="panel relative isolate my-4 scroll-mt-24 py-24 text-white sm:py-32">
      <Aurora />
      <div className={wrap}>
        <div className="max-w-4xl">
          <h2 className={h2}>
            <Words text={d.title} />
          </h2>
          <p data-rise className="mt-8 max-w-2xl text-xl leading-relaxed text-white/85 sm:text-2xl">
            {t.home.dualBody}
          </p>
        </div>
        <div data-credentials className="relative mt-16 grid gap-5 lg:grid-cols-2 lg:gap-8">
          <Credential kind="us" title={d.usTitle} points={d.usPoints} />
          <span data-plus className="absolute left-1/2 top-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-amber-500 text-3xl font-semibold text-navy-950 shadow-[0_0_0_10px_rgba(20,20,58,0.6)] lg:grid" aria-hidden="true">
            +
          </span>
          <Credential kind="bo" title={d.boTitle} points={d.boPoints} />
        </div>
        <div data-rise className="mt-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-lg text-white/85">
            <span className="font-display mr-3 text-4xl font-semibold text-amber-400">99%</span>
            {d.globalBody.replace(/^99%\s*/, "")}
          </p>
          <More href="/learning/dual-diploma" dark>
            {d.more}
          </More>
        </div>
      </div>
    </section>
  );
}

/* ───────── One journey, three chapters ───────── */

export function JourneyHome() {
  const { t } = useLang();
  const j = t.journey;
  return (
    <section id="journey" className="scroll-mt-24 py-24 sm:py-32">
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h2 className={cn(h2, "text-navy-900")}>
              <Words text={j.title} />
            </h2>
            <p data-rise className="mt-6 text-xl text-navy-900/80">
              {t.home.journeyIntro}
            </p>
          </div>
          <div data-rise>
            <More href="/learning/academic-journey">{j.more}</More>
          </div>
        </div>
        <div data-rise className="mt-14">
          <JourneyTabs />
        </div>
      </div>
    </section>
  );
}

/* ───────── The Jaguar Experience ───────── */

const BENTO: { slug: string; cls: string; sizes: string }[] = [
  { slug: "friendship-games", cls: "sm:col-span-2 lg:col-span-7 lg:row-span-2", sizes: "(min-width:1024px) 58vw, 100vw" },
  { slug: "innovation-hub", cls: "lg:col-span-5", sizes: "(min-width:1024px) 42vw, 50vw" },
  { slug: "performing-arts-center", cls: "lg:col-span-5", sizes: "(min-width:1024px) 42vw, 50vw" },
  { slug: "athletics", cls: "lg:col-span-4", sizes: "(min-width:1024px) 33vw, 50vw" },
  { slug: "science-labs", cls: "lg:col-span-4", sizes: "(min-width:1024px) 33vw, 50vw" },
  { slug: "library", cls: "sm:col-span-2 lg:col-span-4", sizes: "(min-width:1024px) 33vw, 100vw" },
];

export function ExperienceHome() {
  const { t, tr } = useLang();
  const c = t.campusLife;
  return (
    <section id="campus-life" className="panel my-4 scroll-mt-24 bg-ivory py-24 sm:py-32">
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h2 className={cn(h2, "text-navy-900")}>
              <Words text={c.title} />
            </h2>
            <p data-rise className="mt-6 text-xl text-navy-900/80">
              {t.home.experienceIntro}
            </p>
          </div>
          <div data-rise>
            <More href="/campus-life/jaguar-experience">{c.exploreAll}</More>
          </div>
        </div>
        <div className="mt-14 grid auto-rows-[17rem] gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[19rem] lg:gap-5">
          {BENTO.map((b, i) => {
            const exp = EXPERIENCES.find((e) => e.slug === b.slug);
            if (!exp) return null;
            return (
              <Link
                key={b.slug}
                href={`/campus-life/jaguar-experience/${exp.slug}`}
                data-rise
                className={cn("group relative isolate overflow-hidden rounded-[1.75rem] bg-navy-900", b.cls)}
              >
                <Photo
                  photo={exp.hero}
                  className="absolute inset-0 -z-10"
                  sizes={b.sizes}
                  imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" aria-hidden="true" />
                <div className="flex h-full flex-col justify-end p-6 sm:p-8">
                  <p className={cn("font-display font-semibold leading-tight text-white", i === 0 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl")}>{tr(exp.title)}</p>
                  <p className="mt-2 max-w-md translate-y-2 text-base text-white/85 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
                    {tr(exp.tagline)}
                  </p>
                </div>
                <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-amber-500 group-hover:text-navy-950" aria-hidden="true">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────── Beyond the Classroom: a large, browsable rail of every tradition ───────── */

type TraditionTab = "all" | "clubs" | "academic" | "civic" | "family";

export function TraditionsMarquee() {
  const { t, tr } = useLang();
  const [tab, setTab] = useState<TraditionTab>("all");
  const [progress, setProgress] = useState(0);
  const rail = useRef<HTMLUListElement>(null);
  const list = tab === "all" ? TRADITIONS : TRADITIONS.filter((x) => x.group === tab);
  const tabs: TraditionTab[] = ["all", "clubs", "academic", "civic", "family"];

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
  };
  const scrollBy = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.75, behavior: "smooth" });
  const choose = (next: TraditionTab) => {
    setTab(next);
    rail.current?.scrollTo({ left: 0 });
    setProgress(0);
  };

  return (
    <section className="overflow-hidden py-24 sm:py-32" aria-labelledby="traditions-title">
      <div className={cn(wrap, "flex flex-col justify-between gap-8 lg:flex-row lg:items-end")}>
        <div className="max-w-3xl">
          <h2 id="traditions-title" className={cn(h2, "text-navy-900")}>
            <Words text={t.home.traditionsTitle} />
          </h2>
          <p data-rise className="mt-6 text-xl leading-relaxed text-navy-900/80">
            {t.home.traditionsIntro}
          </p>
        </div>
        <div data-rise>
          <More href="/campus-life/beyond-the-classroom">{t.campusLife.beyondCta}</More>
        </div>
      </div>

      <div className={cn(wrap, "mt-12 flex flex-wrap items-center justify-between gap-4")}>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.home.traditionsTitle}>
          {tabs.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => choose(k)}
              className={cn("pressable min-h-11 rounded-full px-5 text-sm font-semibold transition-colors", tab === k ? "bg-navy-800 text-white" : "bg-ivory text-navy-900 hover:bg-white")}
            >
              {t.home.traditionsTabs[k]}
            </button>
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scrollBy(-1)} className="pressable grid h-12 w-12 place-items-center rounded-full bg-ivory text-navy-900 hover:bg-white" aria-label={tr({ en: "Previous", es: "Anterior" })}>
            <ArrowRight className="h-5 w-5 rotate-180" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} className="pressable grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-white hover:bg-navy-700" aria-label={tr({ en: "Next", es: "Siguiente" })}>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={rail}
        onScroll={onScroll}
        // Cards start on the same edge as the heading above, however wide the window.
        style={{ paddingInline: "calc(max(0px, (100% - 90rem) / 2) + var(--gutter))", scrollPaddingInline: "calc(max(0px, (100% - 90rem) / 2) + var(--gutter))" }}
        className="ios-scroll mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [--gutter:1.25rem] [scrollbar-width:none] sm:[--gutter:2rem] lg:gap-6 lg:[--gutter:3rem] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((tr_) => (
          <li key={tr_.slug} className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[27%]">
            <Link href={`/campus-life/beyond-the-classroom/${tr_.slug}`} className="group relative isolate block aspect-[3/4] overflow-hidden rounded-[2rem] bg-navy-900">
              <Photo
                photo={tr_.image}
                className="absolute inset-0 -z-10"
                sizes="(min-width:1280px) 27vw, (min-width:1024px) 31vw, (min-width:640px) 46vw, 80vw"
                imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/45 via-50% to-transparent" aria-hidden="true" />
              <span className="absolute left-5 top-5 max-w-[calc(100%-6.25rem)] rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-900 backdrop-blur-sm">{tr(tr_.when)}</span>
              <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-amber-500 group-hover:text-navy-950" aria-hidden="true">
                <ArrowUpRight className="h-5 w-5" />
              </span>
              <div className="flex h-full flex-col justify-end p-7">
                <p className="text-sm font-semibold text-amber-400">{t.home.traditionsTabs[tr_.group]}</p>
                <h3 className="font-display mt-1 text-3xl font-semibold leading-tight text-white sm:text-4xl">{tr(tr_.title)}</h3>
                <p className="mt-3 text-base leading-relaxed text-white/85">{tr(tr_.tagline)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className={cn(wrap, "mt-6")} aria-hidden="true">
        <div className="h-[3px] overflow-hidden rounded-full bg-navy-900/10">
          <div className="h-full origin-left rounded-full bg-navy-800 transition-transform duration-300" style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} />
        </div>
      </div>

      <Marquee className="mt-12 -mb-6" seconds={60}>
        {TRADITIONS.map((tr_) => (
          <span key={tr_.slug} className="font-display shrink-0 whitespace-nowrap px-8 text-6xl font-semibold tracking-[-0.03em] text-navy-900/[0.07] sm:text-8xl">
            {tr(tr_.title)}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* ───────── University matriculation ───────── */

export function MatriculationHome() {
  const { t } = useLang();
  const m = t.matriculation;
  return (
    <section id="matriculation" className="panel relative isolate my-4 scroll-mt-24 py-24 text-white sm:py-32">
      <Aurora tone="dusk" />
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h2 className={h2}>
              <Words text={m.title} />
            </h2>
            <p data-rise className="mt-6 text-xl text-white/85">
              {m.intro}
            </p>
          </div>
          <div data-rise>
            <More href="/learning/university-matriculation" dark>
              {m.more}
            </More>
          </div>
        </div>
        <div data-rise className="mt-14">
          <GlobeExplorer />
        </div>
      </div>
    </section>
  );
}

/* ───────── Recent university acceptances ───────── */

export function AcceptancesHome() {
  const { t } = useLang();
  return (
    <section id="acceptances" className="panel my-4 scroll-mt-24 bg-ivory py-24 sm:py-32">
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h2 className={cn(h2, "text-navy-900")}>
              <Words text={t.home.prestigeTitle} />
            </h2>
            <p data-rise className="mt-6 text-xl text-navy-900/80">
              {t.home.prestigeIntro}
            </p>
          </div>
          <div data-rise>
            <More href="/discover/school-profile#acceptances">{t.home.acceptancesCta}</More>
          </div>
        </div>
      </div>
      <div data-rise className="mt-16">
        <PrestigeMarquee />
      </div>
      <div className={cn(wrap, "mt-28")}>
        <h3 data-rise className="font-display text-4xl font-semibold leading-tight text-navy-900 sm:text-5xl">
          {t.home.acceptancesTitle}
        </h3>
        <p data-rise className="mt-4 text-lg text-navy-900/75">
          {t.home.acceptancesIntro}
        </p>
        <div className="mt-8">
          <AcceptancePosters />
        </div>
      </div>
    </section>
  );
}

/* ───────── Life at SCCS: news, the calendar, and Instagram ───────── */

export function LifeHome() {
  const { t, tr, dateLocale } = useLang();
  const c = t.campusLife;
  const news = sortedNews();
  const lead = [...news.filter((n) => n.featured), ...news.filter((n) => !n.featured)].slice(0, 3);
  const events = upcomingEvents().slice(0, 4);
  return (
    <section id="events" className="scroll-mt-24 py-24 sm:py-32">
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <h2 className={cn(h2, "text-navy-900")}>
            <Words text={t.home.lifeTitle} />
          </h2>
          <div data-rise>
            <More href="/news">{c.allNews}</More>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-6">
          {lead.map((post) => (
            <Link key={post.slug} href={`/news/${post.slug}`} data-rise className="group block">
              <div className="overflow-hidden rounded-[1.75rem]">
                <Photo photo={post.image} className="aspect-[4/3]" sizes="(min-width:1024px) 33vw, 100vw" imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]" />
              </div>
              <p className="mt-5 text-sm font-semibold text-crimson-600">
                {tr(CATEGORY_LABEL[post.category])}
                <span className="font-normal text-navy-900/60"> · {format(parseISO(post.date), "MMMM d", { locale: dateLocale })}</span>
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold leading-snug text-navy-900 transition-colors group-hover:text-navy-600 sm:text-[1.7rem]">{tr(post.title)}</h3>
            </Link>
          ))}
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-12">
          <h3 data-rise className="font-display text-4xl font-semibold leading-tight text-navy-900 lg:col-span-4">
            {c.eventsTitle}
          </h3>
          <ul className="lg:col-span-8">
            {events.map((e) => {
              const d = parseISO(e.date);
              return (
                <li key={e.date + e.title.en} data-rise>
                  <Link href={e.href} className="group grid grid-cols-[5.5rem_1fr_auto] items-center gap-5 rounded-2xl px-2 py-5 transition-colors hover:bg-ivory sm:px-4">
                    <span className="font-display text-navy-900">
                      <span className="block text-4xl font-semibold leading-none">{format(d, "d", { locale: dateLocale })}</span>
                      <span className="mt-1 block text-sm font-semibold capitalize text-crimson-600">{format(d, "MMMM", { locale: dateLocale })}</span>
                    </span>
                    <span>
                      <span className="block text-lg font-semibold text-navy-900 sm:text-xl">{tr(e.title)}</span>
                      <span className="mt-1 block text-sm text-navy-900/65">{tr(e.desc)}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 text-navy-800 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-24">
        <div className={cn(wrap, "mb-8 flex items-center justify-between gap-4")}>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-3 text-lg font-semibold text-navy-900 hover:text-crimson-600">
            <InstagramGlyph className="h-6 w-6" />
            {c.followHandle}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
        <Marquee seconds={60}>
          {INSTAGRAM_POSTS.map((p) => (
            <a
              key={p.photo.src}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mx-2 block h-64 w-64 shrink-0 overflow-hidden rounded-[1.5rem] sm:h-80 sm:w-80"
              aria-label={`${tr(p.caption)} · ${t.page.viewOnInstagram}`}
            >
              <Photo photo={p.photo} className="absolute inset-0" sizes="320px" imgClassName="transition-transform duration-700 group-hover:scale-105" />
            </a>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* ───────── Admissions ───────── */

export function AdmissionsHome() {
  const { t } = useLang();
  const a = t.admissions;
  return (
    <section id="admissions" className="panel my-4 scroll-mt-24 bg-amber-100 py-24 sm:py-32">
      <div className={cn(wrap, "grid gap-14 lg:grid-cols-12")}>
        <div className="lg:col-span-6">
          <h2 className={cn(h2, "text-navy-900")}>
            <Words text={a.title} />
          </h2>
          <p data-rise className="mt-6 text-xl text-navy-900/80">
            {t.home.admissionsIntro}
          </p>
          <div data-rise className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/admissions#inquire" className={cn(buttonStyles.primary, "h-14 px-8 text-base")}>
              {t.home.admissionsCta}
            </Link>
            <Link href="/admissions" className={cn(buttonStyles.outline, "h-14 px-8 text-base")}>
              {a.more}
            </Link>
          </div>
        </div>
        <ol className="space-y-4 lg:col-span-6">
          {a.steps.map((s) => (
            <li key={s.title} data-rise className="rounded-[1.75rem] bg-white p-7 sm:p-9">
              <p className="text-sm font-semibold text-crimson-600">{s.phase}</p>
              <h3 className="font-display mt-2 text-3xl font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-3 text-base text-navy-900/75">{s.points.join(" · ")}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── Close ───────── */

export function FinalCtaHome() {
  const { t } = useLang();
  return (
    <section className="panel relative isolate my-4 py-28 text-center text-white sm:py-40">
      <Aurora />
      <div className={wrap}>
        <div data-rise>
          <SchoolJaguar />
        </div>
        <h2 className={cn(h2, "mx-auto mt-10 max-w-5xl")}>
          <Words text={t.cta.title} />
        </h2>
        <p data-rise className="mx-auto mt-6 max-w-xl text-xl text-white/85">
          {t.cta.subtitle}
        </p>
        <div data-rise className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/admissions#inquire" className={cn(buttonStyles.gold, "h-14 px-9 text-base")}>
            {t.cta.primary}
          </Link>
          <Link href="/contact" className={cn(buttonStyles.glass, "h-14 px-8 text-base")}>
            {t.cta.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
