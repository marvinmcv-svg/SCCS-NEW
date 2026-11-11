import { test, expect, expectNoHorizontalScroll, isMobile } from "./fixtures";

/** Every public page, checked on the desktop and phone projects. */
const ROUTES = [
  "/",
  "/discover",
  "/discover/careers",
  "/discover/history",
  "/discover/campus",
  "/discover/leadership",
  "/discover/safety-wellness",
  "/discover/school-profile",
  "/admissions",
  "/learning",
  "/learning/dual-diploma",
  "/learning/academic-journey",
  "/learning/student-support",
  "/learning/university-matriculation",
  "/campus-life",
  "/campus-life/jaguar-experience",
  "/campus-life/jaguar-experience/innovation-hub",
  "/campus-life/beyond-the-classroom",
  "/campus-life/beyond-the-classroom/fun-run",
  "/campus-life/student-leadership",
  "/news",
  "/news/class-of-2026-matriculation",
  "/community",
  "/contact",
  "/legal",
];

test.describe("Layout on every page", () => {
  for (const route of ROUTES) {
    test(`${route} fits the screen and has readable text`, async ({ page, errors }) => {
      void errors;
      await page.goto(route);
      await expectNoHorizontalScroll(page);
      // No visible text smaller than 12px (the logo lockup's second line is part of the mark).
      const tiny = await page.evaluate(() =>
        [...document.querySelectorAll("main *, footer *")]
          .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim().length > 1))
          .filter((el) => {
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return cs.visibility !== "hidden" && cs.display !== "none" && r.width > 1 && r.height > 1 && parseFloat(cs.fontSize) < 12;
          })
          .filter((el) => !el.closest(".font-brand, .sr-only, svg"))
          .map((el) => `${getComputedStyle(el).fontSize} "${(el.textContent ?? "").trim().slice(0, 30)}"`),
      );
      expect(tiny, "text smaller than 12px").toEqual([]);
    });
  }
});

test.describe("Page headers", () => {
  test("text in every cover header is readable on the light field", async ({ page, errors }) => {
    test.skip(isMobile(page), "colours are the same on every screen size");
    void errors;
    const lum = (c: string) => {
      const [r, g, b] = (c.match(/[\d.]+/g) ?? ["0", "0", "0"]).map(Number).map((v) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const field = lum("rgb(235,235,245)");
    for (const route of ROUTES.filter((r) => r !== "/" && r !== "/legal")) {
      await page.goto(route);
      const colours = await page.evaluate(() => {
        const hero = document.querySelector('main section[data-color="field"]');
        if (!hero) return [];
        return [...hero.querySelectorAll("*")]
          .filter((el) => !el.closest("[data-page-media]") && [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim()))
          .map((el) => ({ colour: getComputedStyle(el).color, text: (el.textContent ?? "").trim().slice(0, 30) }));
      });
      for (const c of colours) {
        const l = lum(c.colour);
        const ratio = (Math.max(l, field) + 0.05) / (Math.min(l, field) + 0.05);
        expect(ratio, `${route}: "${c.text}" in ${c.colour}`).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

test.describe("Phones", () => {
  test.beforeEach(({ page }) => {
    test.skip(!isMobile(page), "phone-only checks");
  });

  test("footer and breadcrumb links are at least 44px tall", async ({ page, errors }) => {
    void errors;
    await page.goto("/discover/careers");
    const short = await page.evaluate(() =>
      [...document.querySelectorAll("footer a, main nav[aria-label] a")]
        .map((a) => ({ h: a.getBoundingClientRect().height, text: (a.textContent ?? "").trim() }))
        .filter((a) => a.h > 0 && a.h < 44),
    );
    expect(short).toEqual([]);
  });

  test("footer text keeps a margin from the screen edge", async ({ page, errors }) => {
    void errors;
    await page.goto("/contact");
    const left = await page.locator("footer").getByRole("link", { name: "Admissions" }).evaluate((el) => el.getBoundingClientRect().left);
    expect(left).toBeGreaterThanOrEqual(16);
  });

  test("the menu sheet opens, expands a section and navigates", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    const section = sheet.getByRole("button", { name: /Campus Life/ });
    await section.click();
    await expect(section).toHaveAttribute("aria-expanded", "true");
    await sheet.getByRole("link", { name: "Jaguar News" }).click();
    await expect(page).toHaveURL(/\/news$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("Reduced motion on a phone", () => {
  test.use({ reducedMotion: "reduce" });

  test("the home page fits the screen and hydrates cleanly", async ({ page, errors }) => {
    // `errors` fails the test on any page error, including a hydration mismatch.
    void errors;
    const consoleErrors: string[] = [];
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
    await page.goto("/");
    await expectNoHorizontalScroll(page);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await expectNoHorizontalScroll(page);
    expect(consoleErrors.filter((e) => /hydrat|#418|#423|#425/i.test(e))).toEqual([]);
  });
});
