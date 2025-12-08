import { test, expect } from "@playwright/test";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { parse as parseYaml } from 'yaml'

let siteConfig;
let homePage;

test.use({
  // Full window size of 16" MacBook Pro
  viewport: {
    height: 998,
    width: 1728,
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.SITE_URL);
});

test.beforeAll(async () => {
  siteConfig = await fs.readFile(path.join(__dirname, "../../config/_default/hugo.yaml"), "utf-8").then(parseYaml)
  homePage = await fs.readFile(path.join(__dirname, "../../content/_index.md"), "utf-8").then(matter)
});

test.describe("Home page", () => {
  test("should have correct title", async ({ page }) => {
    await expect(page).toHaveTitle(siteConfig.title);
  });

  test("should have correct description", async ({ page }) => {
    const { data: {description} } = homePage;
    expect(description).not.toEqual("");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
  })

  test("ensure all internal links resolve", async ({ page, request }) => {
    const linkResolves = async (link) => {
      return request.get(link, { timeout: 3000, failOnStatusCode: true }).catch((e) => {
        console.error(`Error fetching ${link}: ${e}`);
        throw e;
      });
    };

    const links = await page.locator('a').evaluateAll((els) => els.map((el) => el.href));
    const internalLinks = new Set(links.filter((link) => link.startsWith(page.url())));

    await Promise.all(
      Array.from(internalLinks).map((link) => linkResolves(link))
    );
  });

  test("ensure the exact number of expected pillar tiles are present and visible", async ({ page }) => {
    const expectedPillars = [
      'Productivity',
      'Collaboration',
      'Application Security',
      'Governance',
      'Architecture'
    ];

    for (const pillar of expectedPillars) {
      await expect(page.locator("dt:visible").getByText(pillar)).toHaveCount(1);
    }
  });
});
