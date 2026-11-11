import { test, expect, expectNoHorizontalScroll, switchToSpanish } from "./fixtures";

test.describe("Home page", () => {
  test("renders the redesigned hero and highlights", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    await expect(page).toHaveTitle(/Santa Cruz Cooperative School/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Home of the Jaguars");
    await expect(page.getByRole("link", { name: "Apply Now" }).first()).toHaveAttribute("href", "/admissions#inquire");
    await expect(page.getByRole("heading", { name: "An accredited American international school" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The SCCS Advantage" })).toBeVisible();
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
});
