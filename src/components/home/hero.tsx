"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { HERO_SLIDES } from "@/data/home";
import { cn } from "@/lib/utils";
import { useLang } from "../sccs/i18n";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "../sccs/sccs-shared";
import { AccreditationLogos } from "../sccs/credentials";
import { EASE_OUT, Words, gsap, useGSAP } from "./motion";

const SLIDE_SECONDS = 7;

/**
 * Split hero on the tinted ground: the headline, actions and an accreditation card on
 * the left; the photo slideshow as one tall rounded card on the right.
 */
export function HomeHero() {
  const { t, tr } = useLang();
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const slides = HERO_SLIDES;

  // Entrance: words rise, then the line, then the actions.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        tl.from("[data-word]", { yPercent: 115, duration: 1.2, stagger: 0.06 }, 0.2)
          .from("[data-hero-rise]", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.75)
          .from("[data-hero-controls]", { y: 40, scale: 0.97, autoAlpha: 0, duration: 1.4 }, 0.3);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

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
      if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: SLIDE_SECONDS + 1.5, ease: "none" });
      gsap.fromTo(
        bars[index],
        { scaleX: 0 },
        { scaleX: 1, duration: SLIDE_SECONDS, ease: "none", onComplete: () => setIndex((i) => (i + 1) % slides.length) },
      );
    },
    { scope: root, dependencies: [index, slides.length], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="top" className="relative overflow-hidden pb-6 pt-28 sm:pt-32 lg:pb-10 lg:pt-36">
      <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:items-stretch lg:gap-10 lg:px-12">
        {/* Words, actions and the credentials card */}
        <div data-hero-copy className="flex flex-col lg:col-span-6 lg:py-6">
          <h1 className="font-display text-balance text-[3.1rem] font-bold leading-[0.95] text-navy-800 sm:text-7xl lg:text-[5.25rem] xl:text-[6rem]">
            <Words text={t.hero.title} />
          </h1>
          <p data-hero-rise className="mt-6 max-w-xl text-xl font-medium text-navy-900/75 sm:text-2xl">
            {t.hero.sub}
          </p>
          <div data-hero-rise className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/admissions#inquire" className={cn(buttonStyles.gold, "h-12 px-8 text-base shadow-none hover:shadow-none")}>
              {t.hero.ctaPrimary}
            </Link>
            <Link href="/admissions#inquire" className="group inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-navy-800 hover:text-crimson-600">
              {t.hero.ctaSecondary}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div data-hero-rise className="mt-10 flex flex-col gap-6 rounded-[1.75rem] bg-ivory p-6 sm:flex-row sm:items-center sm:p-8 lg:mt-auto">
            <AccreditationLogos size="sm" className="shrink-0 sm:max-w-[12rem]" />
            <div>
              <h2 className="font-display text-2xl font-medium leading-tight text-navy-800 sm:text-[1.7rem]">
                {tr({ en: "An accredited American international school", es: "Un colegio internacional americano acreditado" })}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{t.home.accreditedLine}</p>
            </div>
          </div>
        </div>

        {/* The slideshow, as one tall rounded card */}
        <div data-hero-controls className="relative isolate min-h-[26rem] overflow-hidden rounded-[2rem] bg-navy-900 sm:min-h-[34rem] lg:col-span-6 lg:min-h-[44rem]">
          <div data-hero-media className="absolute inset-0 -z-20">
            {slides.map((s, i) => (
              <div key={s.photo.src + i} data-slide className={cn("absolute inset-0", i !== 0 && "invisible opacity-0")}>
                <Image
                  src={s.photo.src}
                  alt={i === index ? tr(s.photo.alt) : ""}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy-950/70 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-7">
            <p className="text-sm font-medium text-white" aria-live="polite">
              {tr(slides[index].caption)}
            </p>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.photo.src + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group relative h-8 flex-1"
                  aria-label={tr(s.caption)}
                  aria-current={i === index}
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/35 transition-colors group-hover:bg-white/55">
                    <span data-bar className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
