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

  it("has high-resolution favicon and touch icon assets in public directory", () => {
    const icoPath = path.join(publicDir, "favicon.ico");
    const pngPath = path.join(publicDir, "favicon.png");
    const svgPath = path.join(publicDir, "favicon.svg");
    const appleTouchPath = path.join(publicDir, "apple-touch-icon.png");

    expect(fs.existsSync(icoPath)).toBe(true);
    expect(fs.statSync(icoPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(pngPath)).toBe(true);
    expect(fs.statSync(pngPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(svgPath)).toBe(true);
    expect(fs.statSync(svgPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(appleTouchPath)).toBe(true);
    expect(fs.statSync(appleTouchPath).size).toBeGreaterThan(0);
  });

  it("has stable public logo and social sharing preview assets", () => {
    const logoPath = path.join(publicDir, "logo.png");
    const ogImagePath = path.join(publicDir, "og-image.png");

    expect(fs.existsSync(logoPath)).toBe(true);
    expect(fs.statSync(logoPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(ogImagePath)).toBe(true);
    expect(fs.statSync(ogImagePath).size).toBeGreaterThan(0);
  });

  it("includes valid Organization structured data and Open Graph / Twitter metadata in root and homepage", () => {
    const rootRoutePath = path.resolve(__dirname, "../routes/__root.tsx");
    const indexRoutePath = path.resolve(__dirname, "../routes/index.tsx");

    const rootContent = fs.readFileSync(rootRoutePath, "utf-8");
    const indexContent = fs.readFileSync(indexRoutePath, "utf-8");

    // Organization schema in __root.tsx
    expect(rootContent).toContain('"@context": "https://schema.org"');
    expect(rootContent).toContain('"@type": "Organization"');
    expect(rootContent).toContain('name: "HiKARii"');
    expect(rootContent).toContain('url: "https://hikarii.studio"');
    expect(rootContent).toContain('logo: "https://hikarii.studio/logo.png"');
    expect(rootContent).toContain(
      '"https://www.instagram.com/hikarii.ab?exln=dG93amIza2VwOTBp&utm_source=qr"',
    );
    expect(rootContent).not.toContain("https://x.com/hikarii");

    // Favicon links
    expect(rootContent).toContain('href: "/favicon.ico"');
    expect(rootContent).toContain('href: "/favicon.svg"');
    expect(rootContent).toContain('href: "/favicon.png"');
    expect(rootContent).toContain('href: "/apple-touch-icon.png"');

    // Open Graph & Twitter metadata
    for (const content of [rootContent, indexContent]) {
      expect(content).toContain('"og:site_name"');
      expect(content).toContain('"og:type"');
      expect(content).toContain('"og:title"');
      expect(content).toContain('"og:description"');
      expect(content).toContain('"https://hikarii.studio/og-image.png"');
      expect(content).toContain('"twitter:card"');
      expect(content).toContain('"https://hikarii.studio"');
    }

    // Site layout must not contain X link
    const layoutPath = path.resolve(__dirname, "../components/site/layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");
    expect(layoutContent).not.toContain("https://x.com");
  });
});
