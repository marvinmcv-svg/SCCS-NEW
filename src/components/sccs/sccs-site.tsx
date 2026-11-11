"use client";

import { CareersHome, Features, Hero, JoinInfo, SafetySplit, Stats } from "../colina/home";
import { AcceptancesHome, ExperienceHome, JourneyHome, LifeHome, MatriculationHome, TraditionsMarquee } from "../home/sections";

/** The home page, top to bottom, in the Colina layout (see src/components/colina). */
export function SccsHome() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <SafetySplit />
      <JourneyHome />
      <ExperienceHome />
      <TraditionsMarquee />
      <MatriculationHome />
      <AcceptancesHome />
      <LifeHome />
      <CareersHome />
      <JoinInfo />
    </>
  );
}
