"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { EXPERIENCES } from "@/data/experiences";
import { TRADITIONS } from "@/data/traditions";
import { INSTAGRAM_POSTS, sortedNews, upcomingEvents } from "@/data/sccs-content";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useLang } from "../sccs/i18n";
import { Photo } from "../sccs/sccs-shared";
import { JourneyTabs } from "../sccs/journey";
import { GlobeExplorer } from "../sccs/globe-explorer";
import { CATEGORY_LABEL } from "../sccs/campus-life";
import { InstagramGlyph } from "../sccs/footer";
import { AcceptancePosters, PrestigeMarquee } from "../sccs/credentials";
import { Aurora, Marquee, Words } from "./motion";

/* ───────── Shared pieces ───────── */

const wrap = "mx-auto w-full max-w-[110rem] px-[var(--gutter-grid)]";
const h2 = "t-display text-balance";

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

/* ───────── One journey, three chapters ───────── */

export function JourneyHome() {
  const { t } = useLang();
  const j = t.journey;
  return (
    <section id="journey" data-color="field" className="scroll-mt-24 bg-field py-[max(56px,6.6vw)]">
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
    <section id="campus-life" data-color="card" className="scroll-mt-24 bg-card py-[max(56px,6.6vw)]">
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
                className={cn("group relative isolate overflow-hidden rounded-[var(--radius-card)] bg-navy-900", b.cls)}
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
    <section data-color="field" className="overflow-hidden bg-field py-[max(56px,6.6vw)]" aria-labelledby="traditions-title">
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
            <Link href={`/campus-life/beyond-the-classroom/${tr_.slug}`} className="group relative isolate block aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-navy-900">
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
    <section id="matriculation" data-color="navy" className="relative isolate scroll-mt-24 overflow-hidden py-[max(56px,6.6vw)] text-white">
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
    <section id="acceptances" data-color="card" className="scroll-mt-24 overflow-hidden bg-card py-[max(56px,6.6vw)]">
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
    <section id="events" data-color="field" className="scroll-mt-24 bg-field py-[max(56px,6.6vw)]">
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
              <div className="overflow-hidden rounded-[var(--radius-card)]">
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
