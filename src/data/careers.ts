import type { L } from "@/lib/i18n-types";

/**
 * Current job openings, taken from the school's own postings:
 * the "Working at SCCS" page on sccs.edu.bo (the four PDF flyers uploaded in
 * October 2026) and the @sccsjaguars Instagram leadership post of October 2026.
 * Update this list when a role is filled or a new flyer goes up.
 */

export type JobGroup = "leadership" | "faculty" | "support";

export type Job = {
  id: string;
  group: JobGroup;
  title: L;
  /** When the role starts, as printed on the flyer. */
  start: L;
  /** One or two lines describing the role, in the flyer's own words where it has them. */
  summary: L;
  /** Requirements, only where the flyer lists them. */
  requirements?: L[];
  /** The official flyer on sccs.edu.bo. */
  flyer: string;
};

const PDF = "https://sccs.edu.bo/wp-content/uploads/2026/10";
const FACULTY_FLYER = `${PDF}/SCCS-Faculty-Openings-2027%E2%80%932028.pdf`;
const YEAR: L = { en: "2027–2028 school year", es: "Año escolar 2027–2028" };

export const JOBS_UPDATED = "2026-10";
export const JOBS_EMAIL = "jobs@sccs.edu.bo";
export const JOBS_SOURCE_PAGE = "https://sccs.edu.bo/who-we-are/working-at-sccs/";
export const JOBS_INSTAGRAM_POST = "https://www.instagram.com/p/DeNPpqMCRjC/";

export const JOB_GROUP_LABEL: Record<JobGroup, L> = {
  leadership: { en: "Leadership", es: "Liderazgo" },
  faculty: { en: "Faculty", es: "Docentes" },
  support: { en: "Student Support", es: "Apoyo Estudiantil" },
};

export const JOBS: Job[] = [
  {
    id: "elementary-principal",
    group: "leadership",
    title: { en: "Elementary School Principal", es: "Director(a) de Primaria" },
    start: YEAR,
    summary: {
      en: "Inspire learning, empower students and build a strong community: lead meaningful learning, support a dedicated team, and nurture student growth and well-being.",
      es: "Inspirar el aprendizaje, empoderar a los estudiantes y construir una comunidad sólida: liderar un aprendizaje significativo, apoyar a un equipo comprometido y cuidar el crecimiento y bienestar de los estudiantes.",
    },
    flyer: `${PDF}/Elementary-Principal.pdf`,
  },
  {
    id: "high-school-principal",
    group: "leadership",
    title: { en: "High School Principal", es: "Director(a) de Secundaria" },
    start: YEAR,
    summary: {
      en: "Inspire learning, empower students and build a strong community: lead meaningful learning, support a dedicated team, and nurture student growth and well-being.",
      es: "Inspirar el aprendizaje, empoderar a los estudiantes y construir una comunidad sólida: liderar un aprendizaje significativo, apoyar a un equipo comprometido y cuidar el crecimiento y bienestar de los estudiantes.",
    },
    flyer: `${PDF}/High-School-Principal.pdf`,
  },
  {
    id: "student-support-coordinator",
    group: "support",
    title: { en: "Student Support Services Coordinator", es: "Coordinador(a) de Servicios de Apoyo Estudiantil" },
    start: { en: "Open now", es: "Vacante abierta" },
    summary: {
      en: "Lead and coordinate Student Support Services so students with diverse learning needs receive appropriate support, make progress and develop independence. Work with teachers, families and school leaders to strengthen inclusive practices and SCCS's Multi-Tiered System of Supports (MTSS).",
      es: "Liderar y coordinar los Servicios de Apoyo Estudiantil para que los estudiantes con diversas necesidades de aprendizaje reciban el apoyo adecuado, progresen y desarrollen autonomía. Trabajar con docentes, familias y directivos para fortalecer las prácticas inclusivas y el Sistema de Apoyos Multinivel (MTSS) de SCCS.",
    },
    requirements: [
      { en: "Bachelor's degree in special education, psychopedagogy or a related field", es: "Licenciatura en educación especial, psicopedagogía o un área afín" },
      { en: "Recognized teaching qualification and relevant specialist preparation", es: "Título docente reconocido y formación especializada pertinente" },
      { en: "At least three years of relevant school experience, including coordination or teacher leadership", es: "Al menos tres años de experiencia escolar pertinente, incluida coordinación o liderazgo docente" },
      { en: "Strong knowledge of support planning, interventions, progress monitoring and collaborative communication", es: "Sólido conocimiento de planes de apoyo, intervenciones, seguimiento del progreso y comunicación colaborativa" },
    ],
    flyer: `${PDF}/SST.pdf`,
  },
  {
    id: "secondary-counselor",
    group: "faculty",
    title: { en: "Secondary Counselor", es: "Consejero(a) de Secundaria" },
    start: { en: "Starts January 2027", es: "Inicia en enero de 2027" },
    summary: { en: "Counseling for Middle and High School students.", es: "Orientación para estudiantes de Middle y High School." },
    flyer: FACULTY_FLYER,
  },
  {
    id: "secondary-social-studies",
    group: "faculty",
    title: { en: "Secondary Social Studies Teacher", es: "Docente de Estudios Sociales de Secundaria" },
    start: YEAR,
    summary: { en: "Social Studies for Middle School.", es: "Estudios Sociales para Middle School." },
    flyer: FACULTY_FLYER,
  },
  {
    id: "secondary-science",
    group: "faculty",
    title: { en: "Secondary Science Teacher", es: "Docente de Ciencias de Secundaria" },
    start: YEAR,
    summary: { en: "Science through AP Chemistry and AP Biology.", es: "Ciencias hasta AP Chemistry y AP Biology." },
    flyer: FACULTY_FLYER,
  },
  {
    id: "secondary-math",
    group: "faculty",
    title: { en: "Secondary Math Teacher", es: "Docente de Matemáticas de Secundaria" },
    start: YEAR,
    summary: { en: "Mathematics up to AP Calculus.", es: "Matemáticas hasta AP Calculus." },
    flyer: FACULTY_FLYER,
  },
  {
    id: "upper-elementary-homeroom",
    group: "faculty",
    title: { en: "Upper Elementary Homeroom Teacher", es: "Docente Titular de Primaria Superior" },
    start: YEAR,
    summary: { en: "A homeroom class in Upper Elementary.", es: "Un curso titular en Primaria Superior." },
    flyer: FACULTY_FLYER,
  },
];

/** What every teaching application needs, from the "Working at SCCS" page. */
export const APPLICATION_CHECKLIST: L[] = [
  { en: "A letter of interest explaining your fit for the position", es: "Una carta de interés que explique tu idoneidad para el puesto" },
  { en: "Your résumé", es: "Tu currículum" },
  { en: "Academic transcripts", es: "Certificados académicos" },
  { en: "Contact details for three professional references", es: "Datos de contacto de tres referencias profesionales" },
];

/** Qualifications SCCS asks of every teacher, from the "Working at SCCS" page. */
export const TEACHER_QUALIFICATIONS: L[] = [
  { en: "Full proficiency in English", es: "Dominio total del inglés" },
  { en: "A bachelor's degree from a recognized college or university", es: "Licenciatura de una universidad reconocida" },
  { en: "At least three years' experience in a comparable school", es: "Al menos tres años de experiencia en un colegio comparable" },
  { en: "Willingness to coach or advise an after-school activity", es: "Disposición para dirigir o asesorar una actividad extracurricular" },
];

export const RECRUITING_PARTNERS = [
  { name: "AMISA", href: "https://www.amisa.us/new-applicants" },
  { name: "International School Services", href: "https://www.iss.edu/services/edurecruit" },
  { name: "Search Associates", href: "https://www.searchassociates.com/Candidates/Get-Started.aspx" },
];
