"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { HERO_SLIDES } from "@/data/home";
import { PAGE_PHOTOS } from "@/data/page-photos";
import { JOBS, JOB_GROUP_LABEL } from "@/data/careers";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Photo as PhotoT } from "@/data/media";
import { useLang } from "../sccs/i18n";
import { Crest, Photo, SchoolJaguar } from "../sccs/sccs-shared";
import { AccreditationLogos } from "../sccs/credentials";
import { CountFigure, gsap, useGSAP } from "../home/motion";
import { LearnMoreModal } from "./modal";

/* Shared layout widths */
const gutterGrid = "px-[var(--gutter-grid)]";

/** The flag pair used on the "two diplomas" card. */
function Flag({ kind }: { kind: "us" | "bo" }) {
  return kind === "us" ? (
    <svg viewBox="0 0 60 40" className="h-[max(28px,2.6vw)] w-auto overflow-hidden rounded-md" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} y={i * 5.72} width="60" height="2.86" fill="#C8323A" />
      ))}
      <rect width="26" height="20" fill="#3A3D8C" />
    </svg>
  ) : (
    <svg viewBox="0 0 60 40" className="h-[max(28px,2.6vw)] w-auto overflow-hidden rounded-md" aria-hidden="true">
      <rect width="60" height="13.4" fill="#D52B1E" />
      <rect y="13.3" width="60" height="13.4" fill="#F4E400" />
      <rect y="26.6" width="60" height="13.4" fill="#007934" />
    </svg>
  );
}

function PillArrow() {
  return (
    <span className="grid h-[max(18px,1.39vw)] w-[max(18px,1.39vw)] place-items-center rounded-full border border-current" aria-hidden="true">
      <ArrowRight className="h-[60%] w-[60%]" />
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   §4.1 Hero
   ════════════════════════════════════════════════════════════════════════ */

const SLIDE_SECONDS = 7;

export function Hero() {
  const { t, tr } = useLang();
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const slides = HERO_SLIDES;

  // Slide change: crossfade, a slow pull-back on the incoming photo, and the timer bar.
  useGSAP(
    () => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-slide]");
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      frames.forEach((f, i) => gsap.to(f, { autoAlpha: i === index ? 1 : 0, duration: reduce ? 0 : 1.4, ease: "power2.inOut" }));
      bars.forEach((b, i) => gsap.set(b, { scaleX: i < index ? 1 : 0 }));
      if (reduce) {
        gsap.set(bars[index], { scaleX: 1 });
        return;
      }
      const img = frames[index]?.querySelector("img");
      if (img) gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: SLIDE_SECONDS + 1.5, ease: "none" });
      gsap.fromTo(bars[index], { scaleX: 0 }, { scaleX: 1, duration: SLIDE_SECONDS, ease: "none", onComplete: () => setIndex((i) => (i + 1) % slides.length) });
    },
    { scope: root, dependencies: [index, slides.length], revertOnUpdate: true },
  );

  return (
    // On laptops and desktops the hero fits one screen, from the nav to the bottom of the photo.
    <section
      ref={root}
      id="top"
      data-color="field"
      className="relative bg-field text-field-ink md:flex md:h-[100svh] md:max-h-[64rem] md:min-h-[38rem] md:items-stretch md:justify-between md:pt-[max(84px,min(9.03vw,13vh))]"
    >
      {/* Left column: logo, headline, eyebrow + CTA, trust card */}
      <div className={cn("flex flex-col pt-[calc(var(--nav-h)+8vw)] md:w-[55%] md:pt-0", "pl-[var(--gutter-page)] pr-[var(--gutter-page)] md:pr-0")}>
        <Link id="hero-logo" href="/" aria-label="Santa Cruz Cooperative School" className="flex items-center gap-[0.9vw] self-start">
          <Crest className="h-[max(64px,min(6.25vw,10vh))] w-[max(64px,min(6.25vw,10vh))]" />
          <span className="font-brand font-bold uppercase leading-[1.05] tracking-[0.02em]">
            <span className="block text-[max(20px,min(1.95vw,3.1vh))]">Santa Cruz</span>
            <span className="block text-[max(13px,min(1.3vw,2.1vh))] tracking-[0.04em]">Cooperative School</span>
          </span>
        </Link>

        <h1 className="fade mt-[max(28px,min(3.8vw,5.5vh))] text-balance text-[12.5vw] font-bold leading-[0.95] tracking-[-0.02em] md:text-[min(var(--fs-display),8.5vh)]">
          {t.hero.title}.
        </h1>
        <p className="fade fade-15 mt-[max(14px,min(1.4vw,2vh))] t-body opacity-90 md:text-[min(var(--fs-body),3.2vh)]">{t.hero.sub}</p>

        <div className="fade fade-15 mt-[max(20px,min(2.4vw,3.5vh))] flex flex-col gap-[max(14px,min(1.4vw,2vh))]">
          <Link href="/discover" className="eyebrow-rule min-h-11 hover:opacity-80">
            {tr({ en: "Discover SCCS", es: "Descubre SCCS" })}
          </Link>
          <div>
            <Link href="/admissions#inquire" className="btn-cta">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Trust card: cream, pulled slightly left; logos 20% / words 80% */}
        <div className="fade fade-25 mb-[max(20px,2vh)] mt-[max(28px,3vh)] flex items-center gap-[1.5vw] rounded-[var(--radius-card)] bg-card px-[max(18px,2.2vw)] py-[max(14px,min(1.4vw,2vh))] md:-ml-[2.43vw] md:mt-auto">
          <AccreditationLogos size="sm" className="w-[22%] min-w-[84px] shrink-0 flex-col !items-start !gap-0 md:!gap-[max(6px,0.7vh)] [&_a]:flex [&_a]:min-h-11 [&_a]:items-center md:[&_a]:min-h-0 [&_img]:!h-[max(30px,min(2.6vw,4.4vh))]" />
          <div>
            <h2 className="text-[max(20px,min(var(--fs-h2-sm),4.2vh))] font-normal leading-[1.15] text-field-ink">
              {tr({ en: "An accredited American international school", es: "Un colegio internacional americano acreditado" })}
            </h2>
            <p className="mt-[0.6em] text-[max(13px,min(1.18vw,1.9vh))] leading-snug text-slate">{t.home.accreditedLine}</p>
          </div>
        </div>
      </div>

      {/* Right column: the portrait, sitting on the bottom edge */}
      <div
        data-hero-controls
        className="relative isolate mx-[var(--gutter-page)] mb-6 mt-4 aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-navy-900 md:mx-0 md:mb-0 md:mr-[var(--gutter-grid)] md:mt-0 md:aspect-auto md:w-[38%] md:self-stretch md:rounded-b-none"
      >
        <div className="absolute inset-0 -z-20">
          {slides.map((s, i) => (
            <div key={s.photo.src + i} data-slide className={cn("absolute inset-0", i !== 0 && "invisible opacity-0")}>
              <Image
                src={s.photo.src}
                alt={i === index ? tr(s.photo.alt) : ""}
                fill
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? undefined : "eager"}
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy-950/60 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-6">
          <p className="text-sm font-medium text-white" aria-live="polite">
            {tr(slides[index].caption)}
          </p>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button key={s.photo.src + i} type="button" onClick={() => setIndex(i)} className="group relative h-8 flex-1" aria-label={tr(s.caption)} aria-current={i === index}>
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/35 transition-colors group-hover:bg-white/55">
                  <span data-bar className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   §4.2 Bento grid
   ════════════════════════════════════════════════════════════════════════ */

const reasonPhoto = (i: number) => {
  const h = PAGE_PHOTOS.home;
  return [h.whySccsTile1, h.whySccsTile2, h.whySccsTile3, h.whySccsTile4, h.whySccsTile5, h.whySccsTile6][i];
};

/** Banner / media card: full-bleed photo, white words centred near the bottom, a white pill. */
function BannerCard({ area, photo, title, href, cta, sizes }: { area: string; photo: PhotoT; title: React.ReactNode; href: string; cta: string; sizes: string }) {
  return (
    <div data-rise className="card group text-center text-white" style={{ gridArea: area }}>
      <Photo
        photo={photo}
        className="absolute inset-0"
        sizes={sizes}
        imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/5" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col items-center justify-end px-[8%] pb-[12%]">
        <h3 className="t-card-hero mb-[0.75em] max-w-[16ch] text-balance [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">{title}</h3>
        <Link href={href} className="btn-media">
          {cta}
          <PillArrow />
        </Link>
      </div>
    </div>
  );
}

/** Statement card: a grey eyebrow over a few light, large words with one bold phrase. */
function StatementCard({ area, eyebrow, children }: { area: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div data-rise className="card flex flex-col justify-center px-[10%] text-center md:block md:pt-[14%]" style={{ gridArea: area }}>
      <p className="t-label mb-[1.4em] text-slate">{eyebrow}</p>
      <p className="t-card-text text-field-ink [&_strong]:font-semibold">{children}</p>
    </div>
  );
}

export function Stats() {
  const { t, tr } = useLang();
  const h = t.home;
  const [, university, english, vex, tradition] = h.reasons;
  const [matric, years, twoDiplomas, campus] = t.stats;
  return (
    <section id="stats" data-color="field" className="bg-field pb-[var(--gap-grid)] pt-[max(24px,2vw)]">
      <div className="bento">
        {/* k · the headline banner */}
        <BannerCard area="k" photo={reasonPhoto(0)} sizes="100vw" title={h.advantageTitle} href="/discover" cta={h.advantageCta} />

        {/* e · logos card: two diplomas */}
        <div data-rise className="card flex flex-col items-center px-[8%] pt-[12%] text-center" style={{ gridArea: "e" }}>
          <p className="t-label text-slate">{tr({ en: "Did you know?", es: "¿Sabías que?" })}</p>
          <h3 className="t-card-hero mt-[0.4em] text-field-ink">{tr({ en: "Every graduate can earn two diplomas:", es: "Cada graduado puede obtener dos diplomas:" })}</h3>
          <div className="mt-auto mb-[12%] grid w-full grid-cols-2 px-[4%]">
            {[
              { kind: "us" as const, title: t.dualDiploma.usTitle },
              { kind: "bo" as const, title: t.dualDiploma.boTitle },
            ].map((d, i) => (
              <figure key={d.kind} className={cn("flex flex-col items-center gap-[1vw] px-[6%]", i === 0 && "border-r border-slate/50")}>
                <Flag kind={d.kind} />
                <figcaption className="t-th text-field-ink">{d.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* j · person / feature card, left-aligned */}
        <div data-rise className="card group text-white" style={{ gridArea: "j" }}>
          <Photo photo={reasonPhoto(2)} className="absolute inset-0" sizes="(min-width:768px) 50vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-start justify-between pb-[12%] pl-[8%] pr-[25%] pt-[8%]">
            <h3 className="t-card-hero">
              {tr({ en: "Meet", es: "Conoce" })}
              <br />
              {tr({ en: "the people", es: "a las personas" })}
              <br />
              {tr({ en: "behind", es: "detrás de" })}
              <br />
              {tr({ en: "the Jaguars", es: "los Jaguars" })}
            </h3>
            <Link href="/community" className="btn-media">
              {tr({ en: "Our team", es: "Nuestro equipo" })}
              <PillArrow />
            </Link>
          </div>
        </div>

        {/* c · 99% banner */}
        <BannerCard
          area="c"
          photo={reasonPhoto(1)}
          sizes="(min-width:768px) 50vw, 100vw"
          title={
            <>
              <CountFigure value={university.stat} /> {university.label}
            </>
          }
          href="/learning/university-matriculation"
          cta={t.matriculation.more}
        />

        {/* d · image + caption: 65+ years */}
        <div data-rise className="card flex flex-col items-center justify-center px-[14%] text-center" style={{ gridArea: "d" }}>
          <p
            className="select-none text-[min(15vw,13rem)] font-bold leading-none tracking-[-0.06em] text-transparent md:text-[min(14vw,15rem)]"
            style={{ WebkitTextStroke: "max(2px, 0.2vw) var(--color-field-ink)" }}
            aria-hidden="true"
          >
            <span data-count={years.value}>{years.value}</span>
            <span style={{ WebkitTextStroke: "max(2px, 0.2vw) var(--color-amber-500)" }}>{years.suffix}</span>
          </p>
          <p className="t-label mt-[1em] text-slate">
            <span className="sr-only">
              {years.value}
              {years.suffix}{" "}
            </span>
            {years.label} · {years.note}
          </p>
        </div>

        {/* f g h i · statement cards */}
        <StatementCard area="f" eyebrow={matric.note}>
          <strong>
            {matric.value}
            {matric.suffix}
          </strong>{" "}
          {matric.label}
        </StatementCard>
        <StatementCard area="g" eyebrow={twoDiplomas.note}>
          <strong>{twoDiplomas.value}</strong> {twoDiplomas.label}
        </StatementCard>
        <StatementCard area="h" eyebrow={english.label}>
          <strong>{english.stat}</strong> · {tr({ en: "an American curriculum", es: "un currículo americano" })}
        </StatementCard>
        <StatementCard area="i" eyebrow={campus.note}>
          <strong>{campus.value}</strong> {campus.label}
        </StatementCard>

        {/* l · tall banner */}
        <BannerCard
          area="l"
          photo={reasonPhoto(3)}
          sizes="(min-width:768px) 50vw, 100vw"
          title={
            <>
              {vex.stat} {vex.label}
            </>
          }
          href="/campus-life/jaguar-experience/innovation-hub"
          cta={t.campusLife.exploreAll}
        />

        {/* m · tradition banner */}
        <BannerCard area="m" photo={reasonPhoto(4)} sizes="(min-width:768px) 50vw, 100vw" title={<>{tradition.stat} · {tradition.label}</>} href="/campus-life/beyond-the-classroom" cta={t.campusLife.beyondCta} />

        {/* n · the Jaguar spirit */}
        <div data-rise className="card flex flex-col items-center justify-center bg-navy-950 px-[8%] text-center text-white" style={{ gridArea: "n" }}>
          <SchoolJaguar className="[&_img]:w-[max(72px,7vw)] [&_img:last-child]:w-[max(120px,12vw)]" />
          <p className="t-card-hero mt-[0.6em]">{t.discover.jaguarKicker}</p>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   §4.3 Title band + §4.4 Feature boxes (with modals)
   ════════════════════════════════════════════════════════════════════════ */

type BoxTone = "plain" | "rose" | "grey";
const BOX_TONE: Record<BoxTone, { box: string; title: string; body: string; pill: React.CSSProperties }> = {
  plain: { box: "", title: "text-field-ink", body: "text-field-ink", pill: { ["--btn-hover-bg" as string]: "var(--color-field-ink)", ["--btn-hover-ink" as string]: "var(--color-field)" } },
  rose: { box: "bg-rose", title: "text-rose-ink", body: "text-rose-ink", pill: { ["--btn-hover-bg" as string]: "var(--color-rose-ink)", ["--btn-hover-ink" as string]: "var(--color-rose)" } },
  grey: { box: "bg-slate", title: "text-navy-950", body: "text-white", pill: { ["--btn-hover-bg" as string]: "var(--color-grey-50)", ["--btn-hover-ink" as string]: "var(--color-slate)" } },
};

function FeatureBox({ tone, title, children, modalTitle, rows, learnMore, closeLabel }: {
  tone: BoxTone;
  title: string;
  children: React.ReactNode;
  modalTitle: string;
  rows: { label: string; body: React.ReactNode }[];
  learnMore: string;
  closeLabel: string;
}) {
  const s = BOX_TONE[tone];
  return (
    <div data-rise className={cn("mb-[max(16px,1.74vw)] w-full rounded-[var(--radius-card)] px-[max(24px,4.51vw)] py-[max(28px,4.86vw)] text-left md:w-[49%]", s.box)}>
      <h3 className={cn("t-h2 mb-[0.5em] text-balance", s.title)}>{title}</h3>
      <div className={cn("t-body space-y-[0.8em] [&_strong]:font-semibold", s.body)}>{children}</div>
      <LearnMoreModal
        title={modalTitle}
        rows={rows}
        closeLabel={closeLabel}
        trigger={
          <button type="button" className={cn("btn-outline mt-[1.6em]", s.body)} style={s.pill}>
            {learnMore}
          </button>
        }
      />
    </div>
  );
}

export function Features() {
  const { t, tr } = useLang();
  const d = t.dualDiploma;
  const j = t.journey;
  const a = t.admissions;
  const learnMore = tr({ en: "Learn more", es: "Saber más" });
  const close = t.nav.close;
  const list = (items: string[]) => (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
  return (
    <section id="learning" data-color="field" className="scroll-mt-24 bg-field text-field-ink">
      {/* §4.3 title band */}
      <h2 data-rise className="t-display px-[16.5vw] pb-[max(48px,7vw)] pt-[max(56px,6.6vw)] text-center text-balance">
        {tr({ en: "What makes an SCCS education", es: "Lo que define una educación SCCS" })}
      </h2>
      {/* §4.4 boxes: plain · rose / grey · plain, like a checkerboard */}
      <div className={cn(gutterGrid, "flex flex-wrap justify-between pb-[max(40px,4vw)]")}>
        <FeatureBox
          tone="plain"
          title={d.title}
          modalTitle={d.title}
          learnMore={learnMore}
          closeLabel={close}
          rows={[
            { label: d.usTitle, body: list(d.usPoints) },
            { label: d.boTitle, body: list(d.boPoints) },
            { label: d.globalTitle, body: d.globalBody },
          ]}
        >
          <p>{t.home.dualBody}</p>
          <p>
            <strong>{d.globalBody}</strong>
          </p>
        </FeatureBox>
        <FeatureBox
          tone="rose"
          title={j.title}
          modalTitle={j.title}
          learnMore={learnMore}
          closeLabel={close}
          rows={j.tabs.map((tab) => ({
            label: `${tab.label} · ${tab.grades}`,
            body: (
              <>
                <p className="font-semibold">{tab.tagline}</p>
                <p className="mt-2">{tab.body}</p>
              </>
            ),
          }))}
        >
          <p>{j.intro}</p>
          <p>
            <strong>{j.tabs.map((tab) => `${tab.label} (${tab.grades})`).join(" · ")}</strong>
          </p>
        </FeatureBox>
        <FeatureBox
          tone="grey"
          title={t.home.learnerTitle}
          modalTitle={t.discover.learnerTitle}
          learnMore={learnMore}
          closeLabel={close}
          rows={t.discover.learner.map((l) => ({ label: l.title, body: l.line }))}
        >
          <p>
            <strong>{t.discover.learner.map((l) => l.title).join(", ")}.</strong>
          </p>
        </FeatureBox>
        <FeatureBox
          tone="plain"
          title={a.title}
          modalTitle={a.title}
          learnMore={learnMore}
          closeLabel={close}
          rows={a.steps.map((s) => ({
            label: `${s.phase} · ${s.title}`,
            body: s.body,
          }))}
        >
          <p>{a.intro}</p>
          <p>
            <strong>{t.cta.subtitle}</strong>
          </p>
        </FeatureBox>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   §4.5 Split image + text (light grey section): Safety & Wellness
   ════════════════════════════════════════════════════════════════════════ */

export function SafetySplit() {
  const { t } = useLang();
  const h = t.home;
  // "Safe, seen, and known." → the last words become the pull-quote span.
  const [lead, ...rest] = h.safetyTitle.split(", ");
  return (
    <section data-color="lgrey" className="bg-grey-100 py-[max(56px,6.6vw)] text-slate">
      <div className={cn(gutterGrid, "flex flex-col gap-10 md:flex-row md:items-center md:justify-between")}>
        <div data-rise className="overflow-hidden rounded-[20px] md:w-[49%]">
          <Photo photo={PAGE_PHOTOS.home.safetyLarge} className="aspect-[4/3]" sizes="(min-width:768px) 49vw, 100vw" />
        </div>
        <div data-rise className="md:w-[45%]">
          <h2 className="t-h2 text-balance text-slate">
            {lead}
            {rest.length > 0 && ", "}
            <span className="text-crimson-600">{rest.join(", ")}</span>
          </h2>
          <p className="t-body mt-[0.8em]">{h.safetyBody}</p>
          <ul className="t-small mt-[1.2em] grid grid-cols-2 gap-x-6 gap-y-2">
            {t.discover.safety.map((x) => (
              <li key={x.title} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-600" aria-hidden="true" />
                {x.title}
              </li>
            ))}
          </ul>
          <Link
            href="/discover/safety-wellness"
            className="btn-outline mt-[1.6em]"
            style={{ ["--btn-hover-bg" as string]: "var(--color-slate)", ["--btn-hover-ink" as string]: "var(--color-grey-50)" }}
          >
            {h.safetyCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   §4.6 Rose section with illustration: careers
   ════════════════════════════════════════════════════════════════════════ */

/** A flat geometric composition in the brand colours (no gradients, no 3D). */
function ShapesIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <circle cx="292" cy="96" r="70" fill="var(--color-crimson-600)" />
      <rect x="40" y="132" width="150" height="150" rx="22" fill="var(--color-navy-800)" />
      <path d="M150 282 238 112l88 170Z" fill="var(--color-amber-400)" />
      <path d="M216 282 272 172l56 110Z" fill="none" stroke="var(--color-field)" strokeWidth="8" strokeLinejoin="round" />
      <path d="M0 282h400" stroke="var(--color-rose-ink)" strokeWidth="3" />
    </svg>
  );
}

export function CareersHome() {
  const { tr } = useLang();
  const leadership = JOBS.filter((j) => j.group !== "faculty");
  const faculty = JOBS.filter((j) => j.group === "faculty");
  const pillStyle = { ["--btn-hover-bg" as string]: "var(--color-rose-ink)", ["--btn-hover-ink" as string]: "var(--color-rose)" };
  const roleList = (title: string, jobs: typeof JOBS) => (
    <div data-rise className="w-full rounded-[var(--radius-card)] px-[max(24px,4.51vw)] py-[max(28px,3.5vw)] md:w-[49%]">
      <h3 className="t-h2 text-rose-ink">{title}</h3>
      <ul className="mt-[1em] divide-y divide-rose-ink/20">
        {jobs.map((j) => (
          <li key={j.id}>
            <Link href="/discover/careers#openings" className="group flex items-center justify-between gap-4 py-[0.7em]">
              <span>
                <span className="t-body block font-medium text-rose-ink">{tr(j.title)}</span>
                <span className="t-small block text-rose-ink/75">{tr(j.start)}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-rose-ink transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section id="careers" data-color="rose" className="scroll-mt-24 bg-rose pt-[max(40px,4.17vw)] text-rose-ink">
      <div className={cn(gutterGrid, "flex flex-wrap justify-between")}>
        {/* Full-width box: words 49% / illustration 50% (illustration first on phones) */}
        <div className="flex w-full flex-col-reverse gap-8 rounded-[var(--radius-card)] px-[max(24px,4.51vw)] py-[max(28px,4.86vw)] md:flex-row md:items-center md:justify-between">
          <div className="md:w-[49%]">
            <p data-rise className="t-label">
              {tr({ en: "We're hiring", es: "Estamos contratando" })} · {JOBS.length} {tr({ en: "open roles", es: "vacantes" })}
            </p>
            <h2 data-rise className="t-display mt-[0.3em] text-balance">
              {tr({ en: "Join the Jaguar team.", es: "Únete al equipo Jaguar." })}
            </h2>
            <p data-rise className="t-body mt-[0.8em]">
              {tr({
                en: "Principals, teachers and specialists for the 2027–2028 school year, and a Student Support Services Coordinator now.",
                es: "Directores, docentes y especialistas para el año escolar 2027–2028, y un(a) Coordinador(a) de Apoyo Estudiantil ahora.",
              })}
            </p>
            <div data-rise>
              <Link href="/discover/careers#openings" className="btn-outline mt-[1.4em]" style={pillStyle}>
                {tr({ en: "See all openings", es: "Ver todas las vacantes" })}
              </Link>
            </div>
          </div>
          <div data-rise className="md:w-[45%]">
            <ShapesIllustration className="h-auto w-full" />
          </div>
        </div>
        {roleList(tr({ en: "Leadership & support", es: "Liderazgo y apoyo" }), leadership)}
        {roleList(tr(JOB_GROUP_LABEL.faculty), faculty)}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   §4.7 Info block (table + map): joining SCCS
   ════════════════════════════════════════════════════════════════════════ */

/** A schematic of Santa Cruz: the city's ring roads and the campus pin. Not to scale. */
function CampusMap({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 360" className="h-auto w-full md:w-[120%] md:max-w-none" role="img" aria-label={label}>
      <g fill="none" stroke="var(--color-field-ink)" strokeOpacity="0.45" strokeWidth="2">
        <ellipse cx="210" cy="170" rx="34" ry="30" />
        <ellipse cx="210" cy="170" rx="74" ry="66" />
        <ellipse cx="210" cy="170" rx="118" ry="106" />
        <ellipse cx="210" cy="170" rx="166" ry="148" />
      </g>
      <g stroke="var(--color-field-ink)" strokeOpacity="0.3" strokeWidth="2">
        <path d="M210 4v332M30 170h360M86 50l248 240M334 50 86 290" />
      </g>
      {/* The campus */}
      <g>
        <circle cx="120" cy="214" r="22" fill="var(--color-amber-400)" opacity="0.35" className="sccs-pin-pulse" />
        <circle cx="120" cy="214" r="10" fill="var(--color-crimson-600)" stroke="#fff" strokeWidth="3" />
      </g>
      <text x="138" y="248" fill="var(--color-field-ink)" fontSize="15" fontWeight="600">SCCS · Barrio Las Palmas</text>
      <text x="210" y="352" textAnchor="middle" fill="var(--color-slate)" fontSize="12">Santa Cruz de la Sierra</text>
    </svg>
  );
}

export function JoinInfo() {
  const { t, tr } = useLang();
  const a = t.admissions;
  return (
    <section id="admissions" data-color="field" className="scroll-mt-24 bg-field py-[max(56px,6.6vw)] text-field-ink">
      <div className="flex flex-col gap-10 px-[var(--gutter-page)] md:flex-row md:items-center md:gap-[4vw] md:px-[15.28vw]">
        <div className="md:w-[60%]">
          <h2 data-rise className="text-[clamp(30px,2.917vw,56px)] font-bold leading-none">
            {tr({ en: "Joining SCCS.", es: "Cómo unirse a SCCS." })}
          </h2>
          <p data-rise className="mt-[0.4em] text-[clamp(18px,1.806vw,34px)] text-black">
            {tr({ en: "Three phases, from inquiry to the first day.", es: "Tres fases, de la consulta al primer día." })}
          </p>
          <table data-rise className="mt-[max(24px,2.5vw)] w-full border-collapse text-left">
            <tbody>
              {a.steps.map((s, i) => (
                <tr key={s.title} className={cn(i < a.steps.length - 1 && "border-b border-slate/50")}>
                  <th scope="row" className="w-[42%] py-[max(14px,1.3vw)] pr-4 align-top">
                    <span className="t-th flex items-center gap-1.5 text-black">
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      {s.phase}
                    </span>
                    <span className="mt-1 block text-[max(13px,0.972vw)] font-normal text-slate">{s.title}</span>
                  </th>
                  <td className="py-[max(14px,1.3vw)] align-top text-[clamp(17px,1.806vw,34px)] font-light leading-[1.25]">
                    {s.points.map((p) => (
                      <span key={p} className="block">
                        {p}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p data-rise className="mt-[max(16px,1.4vw)] flex items-center gap-1.5 text-[max(12px,0.764vw)] text-slate">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {t.footer.address}
            </a>
          </p>
          <div data-rise className="mt-[max(24px,2vw)] flex flex-wrap gap-3">
            <Link href="/admissions#inquire" className="btn-cta">
              {t.cta.primary}
            </Link>
            <Link href="/admissions" className="btn-outline">
              {a.more}
            </Link>
          </div>
        </div>
        <div data-rise className="md:w-[40%]">
          <CampusMap label={tr({ en: "Schematic map of Santa Cruz de la Sierra with the SCCS campus in Barrio Las Palmas", es: "Mapa esquemático de Santa Cruz de la Sierra con el campus de SCCS en Barrio Las Palmas" })} />
        </div>
      </div>
    </section>
  );
}
