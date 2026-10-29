import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Technical SEO: Sitemap & Robots", () => {
  const publicDir = path.resolve(__dirname, "../../public");

  it("has a valid public/sitemap.xml with canonical domain and indexable routes", () => {
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, "utf-8");
    expect(content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const expectedUrls = [
      "https://hikarii.studio/",
      "https://hikarii.studio/work",
      "https://hikarii.studio/pricing",
      "https://hikarii.studio/get-started",
      "https://hikarii.studio/how-it-works",
      "https://hikarii.studio/clients",
      "https://hikarii.studio/editors",
      "https://hikarii.studio/terms",
    ];

    for (const url of expectedUrls) {
      expect(content).toContain(`<loc>${url}</loc>`);
    }

    // Must NOT contain private, auth, or alternate domains
    expect(content).not.toContain("hikarii-ashy.vercel.app");
    expect(content).not.toContain("www.hikarii.studio");
    expect(content).not.toContain("/dashboard");
    expect(content).not.toContain("/sign-in");
    expect(content).not.toContain("/sign-up");
  });

  it("has a valid public/robots.txt pointing to the canonical sitemap", () => {
    const robotsPath = path.join(publicDir, "robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, "utf-8");
    expect(content).toContain("Sitemap: https://hikarii.studio/sitemap.xml");
    expect(content).toContain("Allow: /");
    expect(content).toContain("Disallow: /dashboard/");
    expect(content).toContain("Disallow: /sign-in");
    expect(content).toContain("Disallow: /sign-up");
  });
});
