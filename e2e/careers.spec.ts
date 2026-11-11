import { test, expect, expectNoHorizontalScroll, switchToSpanish } from "./fixtures";

test.describe("Careers page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/discover/careers");
  });

  test("lists every current opening", async ({ page, errors }) => {
    void errors;
    await expect(page.getByRole("heading", { name: "Current openings" })).toBeVisible();
    const cards = page.getByTestId("job-card");
    await expect(cards).toHaveCount(8);
    for (const title of [
      "Elementary School Principal",
      "High School Principal",
      "Student Support Services Coordinator",
      "Secondary Counselor",
      "Secondary Social Studies Teacher",
      "Secondary Science Teacher",
      "Secondary Math Teacher",
      "Upper Elementary Homeroom Teacher",
    ]) {
      await expect(cards.filter({ hasText: title })).toHaveCount(1);
    }
    await expect(cards.filter({ hasText: "Secondary Counselor" })).toContainText("Starts January 2027");
    await expectNoHorizontalScroll(page);
  });

  test("filters by kind of role", async ({ page, errors }) => {
    void errors;
    const cards = page.getByTestId("job-card");
    await page.getByTestId("job-filter-leadership").click();
    await expect(page.getByTestId("job-filter-leadership")).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveCount(2);
    await page.getByTestId("job-filter-faculty").click();
    await expect(cards).toHaveCount(5);
    await page.getByTestId("job-filter-support").click();
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Multi-Tiered System of Supports");
    await page.getByTestId("job-filter-all").click();
    await expect(cards).toHaveCount(8);
  });

  test("each opening has an email application and the official flyer", async ({ page, errors }) => {
    void errors;
    const cards = page.getByTestId("job-card");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const title = (await card.getByRole("heading").textContent())!.trim();
      await expect(card.getByRole("link", { name: "Apply by email" })).toHaveAttribute(
        "href",
        `mailto:jobs@sccs.edu.bo?subject=${encodeURIComponent(`Application: ${title}`)}`,
      );
      await expect(card.getByRole("link", { name: "Job flyer (PDF)" })).toHaveAttribute("href", /^https:\/\/sccs\.edu\.bo\/wp-content\/uploads\/2026\/10\/.+\.pdf$/);
    }
  });

  test("shows how to apply and the sources", async ({ page, errors }) => {
    void errors;
    await expect(page.getByRole("heading", { name: "How to apply" })).toBeVisible();
    await expect(page.getByText("Contact details for three professional references")).toBeVisible();
    await expect(page.getByRole("link", { name: "@sccsjaguars" }).first()).toHaveAttribute("href", "https://www.instagram.com/p/DeNPpqMCRjC/");
  });

  test("works in Spanish", async ({ page, errors }) => {
    void errors;
    await switchToSpanish(page);
    await expect(page.getByRole("heading", { name: "Vacantes actuales" })).toBeVisible();
    await expect(page.getByTestId("job-card").filter({ hasText: "Director(a) de Primaria" })).toHaveCount(1);
  });
});
