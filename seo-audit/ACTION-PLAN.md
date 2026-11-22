# SEO Action Plan: saasqube.tech

## Phase 1: Critical fixes (week 1)
- [x] Add robots.txt with sitemap link and AI search crawler groups
- [x] Add sitemap.xml (home + templates gallery)
- [x] Shorten title (60 chars) and meta description (147 chars)
- [x] Show the intro loader once per browser session
- [x] Intro loader: skipped on phones and tablets, shortened on desktop (about 2.5 s). Phone first-visit LCP 6.8 s → 3.6 s, repeat visits 2.5 s (emulated mid-range phone)
- [x] Deleted the stray public file `/saasqube-3d-loader-and-motion.patch`
- [ ] Verify the site in **Google Search Console** and **Bing Webmaster Tools**, submit `https://saasqube.tech/sitemap.xml`

## Phase 2: High impact (weeks 2–3)
- [x] Structured data: Organization, WebSite, ProfessionalService with services and prices; CollectionPage for the gallery
- [x] Social share image (1200×630) and Open Graph / X card tags
- [x] llms.txt for AI assistants
- [ ] **Create a Google Business Profile** (service-area business, Tamil Nadu) and link it from the site; add it to `sameAs` in the structured data
- [ ] Add a **city or street address** (even "Coimbatore, Tamil Nadu") to the footer and structured data, matching the Business Profile exactly
- [ ] Add social profiles (LinkedIn, Instagram, YouTube) and list them in `sameAs`

## Phase 3: Content and authority (month 2)
- [ ] **About section with real people:** founder name, photo, experience
- [ ] **2–3 real case studies** (client, problem, what you built, results) as separate pages
- [ ] **Reviews:** collect Google reviews; show 3–5 real testimonials with names and businesses
- [ ] Separate **service pages** (e-commerce, mobile apps, web apps, SEO) with their own titles, FAQs and prices
- [ ] A few **city pages** only where you have real local proof (e.g. Coimbatore, Chennai), not one per city (thin "doorway" pages hurt rankings)
- [ ] Short **YouTube walkthroughs** of the templates (strongest brand signal for AI citations)

## Phase 4: Monitoring (ongoing)
- [ ] Check Search Console monthly: indexing, Core Web Vitals (field data), top queries
- [ ] Update `sitemap.xml` `<lastmod>` when pages change; add new pages to it
- [ ] Re-run this audit after Phase 3
