"use client";

import { useState } from "react";
import { ArrowUpRight, Check, FileText, Mail } from "lucide-react";
import {
  APPLICATION_CHECKLIST,
  JOBS,
  JOBS_EMAIL,
  JOBS_INSTAGRAM_POST,
  JOBS_SOURCE_PAGE,
  JOB_GROUP_LABEL,
  RECRUITING_PARTNERS,
  TEACHER_QUALIFICATIONS,
  type Job,
  type JobGroup,
} from "@/data/careers";
import { cn } from "@/lib/utils";
import { useLang } from "./i18n";
import { buttonStyles } from "./sccs-shared";

type Filter = "all" | JobGroup;
const FILTERS: Filter[] = ["all", "leadership", "faculty", "support"];

const GROUP_TONE: Record<JobGroup, string> = {
  leadership: "bg-navy-800 text-white",
  faculty: "bg-amber-100 text-navy-900",
  support: "bg-crimson-100 text-crimson-700",
};

function applyHref(job: Job, title: string) {
  return `mailto:${JOBS_EMAIL}?subject=${encodeURIComponent(`Application: ${title}`)}`;
}

function JobCard({ job }: { job: Job }) {
  const { tr } = useLang();
  const title = tr(job.title);
  return (
    <li data-testid="job-card" data-group={job.group} className="flex flex-col rounded-[1.75rem] bg-ivory p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", GROUP_TONE[job.group])}>{tr(JOB_GROUP_LABEL[job.group])}</span>
        <span className="rounded-full border border-navy-800/15 px-3 py-1 text-xs font-medium text-navy-800">{tr(job.start)}</span>
      </div>
      <h3 className="font-display mt-5 text-2xl font-bold leading-tight text-navy-800 sm:text-[1.75rem]">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-navy-900/75">{tr(job.summary)}</p>
      {job.requirements && (
        <ul className="mt-5 space-y-2">
          {job.requirements.map((r) => (
            <li key={r.en} className="flex gap-2.5 text-sm leading-snug text-navy-900/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-crimson-600" aria-hidden="true" />
              {tr(r)}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap gap-3 pt-7">
        <a href={applyHref(job, title)} className={cn(buttonStyles.primary, "h-11 px-5 text-sm")}>
          <Mail className="h-4 w-4" aria-hidden="true" />
          {tr({ en: "Apply by email", es: "Postular por correo" })}
        </a>
        <a href={job.flyer} target="_blank" rel="noopener noreferrer" className={cn(buttonStyles.outline, "h-11 px-5 text-sm")}>
          <FileText className="h-4 w-4" aria-hidden="true" />
          {tr({ en: "Job flyer (PDF)", es: "Aviso (PDF)" })}
        </a>
      </div>
    </li>
  );
}

/** Current openings with a filter by kind of role, and how to apply. */
export function JobBoard() {
  const { tr } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const list = filter === "all" ? JOBS : JOBS.filter((j) => j.group === filter);
  const count = (f: Filter) => (f === "all" ? JOBS.length : JOBS.filter((j) => j.group === f).length);

  return (
    <div id="openings" className="scroll-mt-28">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <h2 className="font-display text-balance text-4xl font-bold leading-[1.02] text-navy-800 sm:text-5xl lg:text-6xl">
            {tr({ en: "Current openings", es: "Vacantes actuales" })}
          </h2>
          <p className="mt-4 text-lg text-navy-900/75">
            {tr({
              en: "Leadership and teaching roles for the 2027–2028 school year, plus positions open now. Substitute, short-term and assistant teaching applications are welcome all year.",
              es: "Puestos de liderazgo y docencia para el año escolar 2027–2028, además de vacantes abiertas ahora. Recibimos postulaciones para suplencias, reemplazos cortos y asistentes durante todo el año.",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={tr({ en: "Filter openings", es: "Filtrar vacantes" })}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              data-testid={`job-filter-${f}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "pressable min-h-11 rounded-full px-5 text-sm font-semibold transition-colors",
                filter === f ? "bg-navy-800 text-white" : "bg-ivory text-navy-900 hover:bg-white",
              )}
            >
              {f === "all" ? tr({ en: "All", es: "Todas" }) : tr(JOB_GROUP_LABEL[f])}
              <span className="ml-1.5 opacity-60">{count(f)}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-5" aria-live="polite">
        {list.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </ul>

      <div className="mt-5 grid gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="rounded-[1.75rem] bg-navy-950 p-7 text-white sm:p-9 lg:col-span-2">
          <h3 className="font-display text-3xl font-bold">{tr({ en: "How to apply", es: "Cómo postular" })}</h3>
          <p className="mt-3 text-white/75">
            {tr({ en: "Send the following to", es: "Envía lo siguiente a" })}{" "}
            <a href={`mailto:${JOBS_EMAIL}`} className="font-semibold text-amber-400 underline-offset-4 hover:underline">
              {JOBS_EMAIL}
            </a>
            :
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {APPLICATION_CHECKLIST.map((c) => (
              <li key={c.en} className="flex gap-2.5 text-sm text-white/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                {tr(c)}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-sm text-white/65">
            {tr({ en: "SCCS also recruits through", es: "SCCS también recluta a través de" })}{" "}
            {RECRUITING_PARTNERS.map((p, i) => (
              <span key={p.name}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline-offset-4 hover:underline">
                  {p.name}
                </a>
                {i < RECRUITING_PARTNERS.length - 2 ? ", " : i === RECRUITING_PARTNERS.length - 2 ? tr({ en: " and ", es: " y " }) : "."}
              </span>
            ))}
          </p>
        </div>
        <div className="rounded-[1.75rem] bg-amber-100 p-7 sm:p-9">
          <h3 className="font-display text-2xl font-bold text-navy-900">{tr({ en: "Every SCCS teacher brings", es: "Todo docente de SCCS aporta" })}</h3>
          <ul className="mt-5 space-y-2.5">
            {TEACHER_QUALIFICATIONS.map((q) => (
              <li key={q.en} className="flex gap-2.5 text-sm text-navy-900/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-crimson-600" aria-hidden="true" />
                {tr(q)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
        <span>{tr({ en: "Openings as posted by SCCS in October 2026.", es: "Vacantes publicadas por SCCS en octubre de 2026." })}</span>
        <a href={JOBS_SOURCE_PAGE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-navy-800 hover:text-crimson-600">
          sccs.edu.bo <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <a href={JOBS_INSTAGRAM_POST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-navy-800 hover:text-crimson-600">
          @sccsjaguars <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
