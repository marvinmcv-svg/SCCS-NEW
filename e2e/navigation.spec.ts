import { test, expect, isMobile } from "./fixtures";

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
  "/campus-life/beyond-the-classroom",
  "/campus-life/student-leadership",
  "/news",
  "/community",
  "/contact",
  "/legal",
];

test.describe("Every main page", () => {
  for (const route of ROUTES) {
    test(`loads ${route}`, async ({ page, errors }) => {
      void errors;
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.locator("footer#footer")).toBeAttached();
    });
  }

  test("unknown routes show the 404 page", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
  });
});

test.describe("Site navigation", () => {
  test("reaches Work at SCCS from the main menu", async ({ page, errors }) => {
    void errors;
    await page.goto("/");
    if (isMobile(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = page.getByRole("dialog");
      await menu.getByRole("button", { name: /Discover SCCS/ }).click();
      await menu.getByRole("link", { name: "Work at SCCS" }).click();
    } else {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Discover SCCS" }).hover();
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /Work at SCCS/ }).click();
    }
    await expect(page).toHaveURL(/\/discover\/careers$/);
    await expect(page.getByTestId("job-card").first()).toBeVisible();
  });

  test("reaches Work at SCCS from the footer", async ({ page, errors }) => {
    void errors;
    await page.goto("/contact");
    await page.locator("footer#footer").getByRole("link", { name: "Work at SCCS" }).click();
    await expect(page).toHaveURL(/\/discover\/careers$/);
  });
});
