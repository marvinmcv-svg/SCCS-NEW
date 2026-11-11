import { test, expect } from "./fixtures";

test.describe("Admissions inquiry", () => {
  test("validates and submits the inquiry form", async ({ page, errors }) => {
    void errors;
    // Intercept the API so the test never stores a real inquiry.
    let payload: Record<string, unknown> | null = null;
    await page.route("**/api/inquiries", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });

    await page.goto("/admissions#inquire");
    const submit = page.getByRole("button", { name: "Send Inquiry" });
    await submit.click();
    await expect(page.locator("#inq-name")).toHaveAttribute("aria-invalid", "true");

    await page.locator("#inq-name").fill("E2E Test Parent");
    await page.locator("#inq-email").fill("parent@example.com");
    await page.locator("#inq-grade").click();
    await page.getByRole("option").first().click();
    await submit.click();

    await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
    expect(payload).toMatchObject({ name: "E2E Test Parent", email: "parent@example.com" });
  });
});
