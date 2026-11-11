import { test, expect, expectNoHorizontalScroll, switchToSpanish, waitForReveals } from "./fixtures";

test.describe("Home page", () => {
  test("renders the redesigned hero and highlights", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    await expect(page).toHaveTitle(/Santa Cruz Cooperative School/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Home of the Jaguars");
    await expect(page.locator("#top").getByRole("link", { name: "Book a Campus Tour" })).toHaveAttribute("href", "/admissions#inquire");
    await expect(page.getByRole("heading", { name: "An accredited American international school" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The SCCS Advantage" })).toBeAttached();
    await expect(page.locator("#stats")).toContainText("go on to university");
    await expectNoHorizontalScroll(page);
  });

  test("hero slideshow buttons switch the slide", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    const dots = page.locator("#top button[aria-current]");
    await expect(dots).toHaveCount(7);
    await dots.nth(2).click();
    await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");
  });

  test("careers panel lists openings and links to the job board", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    const careers = page.locator("#careers");
    await careers.scrollIntoViewIfNeeded();
    await expect(careers).toContainText("We're hiring · 8 open roles");
    await expect(careers.getByText("Elementary School Principal")).toBeVisible();
    // Centre the link first so the fixed header cannot sit on top of it.
    const seeAll = careers.getByRole("link", { name: "See all openings" });
    await seeAll.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await seeAll.click();
    await expect(page).toHaveURL(/\/discover\/careers#openings$/);
    await expect(page.getByRole("heading", { name: "Current openings" })).toBeVisible();
  });

  test("switches to Spanish", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    await switchToSpanish(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("El Hogar de los Jaguars");
  });

  test("feature boxes open and close their Learn more modal", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    // The Dual-Diploma box; let its scroll reveal finish before clicking.
    const box = page.locator("#learning [data-rise]").filter({ has: page.getByRole("heading", { name: "The Dual-Diploma Advantage" }) });
    const learnMore = box.getByRole("button", { name: "Learn more" });
    await learnMore.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await waitForReveals(page, "#learning");
    await learnMore.click();
    const modal = page.getByTestId("learn-more-modal");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading", { name: "The Dual-Diploma Advantage" })).toBeVisible();
    await expect(modal).toContainText("Bolivian Bachillerato en Humanidades");
    await page.keyboard.press("Escape");
    await expect(modal).toHaveCount(0);
  });

  test("the nav re-tints to the section under it", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    // Content above can finish loading after the scroll and push the section down,
    // so each poll scrolls to the section again and reads the tint a frame later.
    const expectTintAt = async (id: string, tint: string) => {
      await expect
        .poll(() =>
          page.evaluate(
            (id) =>
              new Promise<string | undefined>((resolve) => {
                const el = document.getElementById(id)!;
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 30, behavior: "instant" });
                requestAnimationFrame(() => requestAnimationFrame(() => resolve(document.body.dataset.menu)));
              }),
            id,
          ),
        )
        .toBe(tint);
    };
    await expectTintAt("stats", "field");
    await expectTintAt("matriculation", "navy");
    await expectTintAt("careers", "rose");
    await expectTintAt("admissions", "field");
  });

  test("the nav logo waits until the hero logo has scrolled away", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    const navLogo = page.locator("header").getByRole("link", { name: /home/ });
    await expect(navLogo).toHaveCSS("opacity", "0");
    // Scroll once the app has hydrated, as a visitor would after the page appears.
    await page.waitForFunction(() => (window as unknown as { __sccsReady?: boolean }).__sccsReady === true);
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
    await expect(navLogo).toHaveCSS("opacity", "1");
  });

  test("social preview image points at this site", async ({ page }) => {
    await page.goto("/");
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    // Built with `npm run test:e2e:build`, the site's own address is the test server.
    const origin = new URL(page.url()).origin;
    expect(og).toBe(`${origin}/images/sccs/campus-gardens.jpg`);
    const res = await page.request.get(og!);
    expect(res.status()).toBe(200);
  });
});
