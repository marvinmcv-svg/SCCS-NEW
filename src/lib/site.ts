/**
 * The address this build is served from. Social preview images, the sitemap and
 * canonical links are built on it, so it must be a host that serves this site:
 * NEXT_PUBLIC_SITE_URL when set (e.g. a custom domain), otherwise the Vercel
 * production domain, otherwise the school's own domain.
 */
const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "https://sccs.edu.bo";
})();

export const SITE = {
  name: "Santa Cruz Cooperative School",
  short: "SCCS",
  url: siteUrl,
  /** The school's own website, for structured data. */
  schoolUrl: "https://sccs.edu.bo",
  phone: "+591 3 3530808",
  phoneHref: "tel:+59133530808",
  email: "contactus@sccs.edu.bo",
  jobsEmail: "jobs@sccs.edu.bo",
  cateringPhone: "+591 75311615",
  instagram: "https://www.instagram.com/sccsjaguars/",
  facebook: "https://www.facebook.com/sccsjaguars",
  address: "Calle Barcelona #1, Barrio Las Palmas, Santa Cruz de la Sierra, Bolivia",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Santa+Cruz+Cooperative+School+Calle+Barcelona+Santa+Cruz+de+la+Sierra",
  founded: "1959-04-10",
} as const;
