import { test as base, expect, type Page } from "@playwright/test";

/** Fails the test on any uncaught error in the page. */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await provide(errors);
    expect(errors, `uncaught page errors:\n${errors.join("\n")}`).toEqual([]);
  },
});

export { expect };

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1280;

/** Flip the site to Spanish from the header (desktop) or the menu drawer (mobile). */
export async function switchToSpanish(page: Page) {
  const header = page.locator("header").getByRole("button", { name: /^Language:/ });
  if (await header.isVisible()) {
    await header.click();
    return;
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await menu.getByRole("button", { name: /^Language:/ }).click();
  await menu.getByRole("button", { name: /Cerrar menú|Close menu/ }).click();
}

/**
 * Waits until every scroll-reveal element inside `scope` has finished animating
 * (opacity 1, no transform). Clicking mid-reveal can hit a neighbour that is still
 * scaled up, and Playwright's retry re-scrolls a smooth-scrolling page.
 */
export async function waitForReveals(page: Page, scope: string) {
  await expect
    .poll(() =>
      page.evaluate(
        (sel) =>
          [...document.querySelectorAll(`${sel} [data-rise]`)].every((el) => {
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            // Reveals trigger when an element's top crosses 90% of the screen height.
            const offScreen = r.bottom < 0 || r.top > window.innerHeight * 0.88;
            return offScreen || (cs.opacity === "1" && cs.transform === "none");
          }),
        scope,
      ),
    )
    .toBe(true);
}
