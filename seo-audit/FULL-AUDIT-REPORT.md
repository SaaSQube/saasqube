# SEO Audit: saasqube.tech

Date: 22 November 2026 · Method: [claude-seo](https://github.com/AgriciDaniel/claude-seo) `seo-audit` process and scoring weights, run by hand (no paid API extensions, no Google Search Console data). Pages audited: `/`, `/templates/`, the 14 demo templates and `/404.html`.

## Executive summary

| | Before | After this round |
|---|---|---|
| **SEO Health Score** | **55 / 100** | **73 / 100** |
| Business type | Service-area business (website & app agency), Tamil Nadu, serving all India | |

Reaching ~80+ needs two things only you can supply: real business details for trust (E-E-A-T) and a decision on the intro loader (first-visit speed).

### Top issues found
1. **First-visit page speed is poor.** The intro loader covers the page for ~5 s; the main content (LCP) appeared at **~6.8 s** on an emulated mid-range phone. Google's "good" is ≤ 2.5 s, "poor" is > 4 s.
2. **No robots.txt, sitemap.xml or llms.txt** (all returned 404).
3. **Meta description was 263 characters** (Google shows ~155), title 66 characters.
4. **Thin trust signals (E-E-A-T):** no street address or city, no named people, no real client work or reviews, no social profiles.
5. **A stray code file is public:** `/saasqube-3d-loader-and-motion.patch` (1,858 lines).

### Quick wins (done)
robots.txt, sitemap.xml, llms.txt, shorter title and description, social share image and tags, fuller structured data, loader limited to once per session.

## Category scores

| Category | Weight | Before | After | Notes |
|---|---|---|---|---|
| Technical SEO | 22% | 62 | 85 | HTTPS, www/http → https redirects and real 404s were already correct. Added robots.txt + sitemap. Security headers can't be set on GitHub Pages (would need Cloudflare in front). |
| Content quality | 23% | 55 | 55 | ~1,500 clear words, good FAQ. Weak E-E-A-T: no address, team, case studies or reviews. Needs your input. |
| On-page SEO | 20% | 65 | 82 | One H1, logical H2s, good internal links. Fixed title/description lengths, removed ignored `meta keywords`. One page targets many cities/services (see Phase 3). |
| Schema | 10% | 50 | 85 | Was one valid `ProfessionalService`. Now `Organization` + `WebSite` + `ProfessionalService` with 7 services and 3 priced packages; gallery has `CollectionPage` + `BreadcrumbList` + `ItemList`. |
| Performance (CWV) | 10% | 35 | 50 | Repeat visits: LCP 6.8 s → 2.6 s, CLS 0.03 → 0. First visit unchanged (loader). |
| AI search readiness | 10% | 40 | 70 | Added llms.txt, explicit robots.txt groups for OAI-SearchBot, Claude-SearchBot, PerplexityBot. FAQ answers are already quotable. Missing: brand mentions (YouTube, LinkedIn, Reddit, Google Business Profile). |
| Images | 5% | 70 | 90 | Added a 1200×630 share image; template photos have alt text, sizes and lazy loading. |

Health score = weighted average (claude-seo weights).

## Technical details

- **Crawl & index:** `/` and `/templates/` indexable with canonicals. All 14 demo templates are `noindex` (correct: they describe fictional businesses). `/index.html` duplicates `/` but the canonical points to `/`.
- **Redirects:** `http://` → `https://`, `www.` → apex, `/templates` → `/templates/` (all 301). Good.
- **404:** unknown URLs return a real 404 with the custom page (`noindex`). Good.
- **Headers:** served by GitHub Pages (`cache-control: max-age=600`). No HSTS/CSP/X-Content-Type-Options possible here; added `<meta name="referrer">`.
- **Rendering:** all content is in the HTML (no JavaScript needed to read it). Good for Google and AI crawlers.

## Performance measurements (emulated Moto G4, 4× CPU slowdown)

| Visit | LCP | CLS | LCP element |
|---|---|---|---|
| Before, any visit | 6.1–6.8 s | 0.03 | hero heading (after loader) |
| After, first visit | 6.8 s | 0.03 | hero text (after loader) |
| After, repeat visit in same session | 2.6 s | 0 | hero text |

Lab numbers, not real-user (CrUX) data. Connect Google Search Console to see field data.

## AI search (GEO)

- Crawler access: everything public is allowed, including AI search crawlers. Training crawlers (GPTBot, ClaudeBot, Google-Extended) are also allowed by default; they can be blocked in robots.txt without affecting search or AI citations.
- Citability: FAQ and pricing are direct, quotable answers. Adding named authors, dates and real project write-ups would raise it.
- Brand signals matter more than backlinks for AI citations: a Google Business Profile, LinkedIn company page, YouTube walkthroughs of the templates and client reviews are the biggest levers.
