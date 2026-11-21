# SaaSQube Solutions — Website

Marketing website for **SaaSQube Solutions**, a website design & development company based in Tamil Nadu, serving businesses across India.

It's a static site: plain HTML, CSS and JavaScript with no build step and no dependencies apart from Google Fonts.

## Structure

```
index.html        Single-page site: hero, services, template slider, why us, process, pricing, about, FAQ, contact
404.html          Not-found page
css/style.css     All styles (light + automatic dark mode, responsive down to small phones).
                  Brand colours from the logo live in :root: --cyan, --brand (blue), --accent (purple), --grad
js/theme.js       Light / dark theme switch (shared by the homepage and templates gallery)
js/main.js        Contact details, mobile menu, scroll effects, template slider, contact form
assets/
  logo-mark.svg     The cube mark (used in the header, footer and About section)
  saasqube-logo.jpg Original full logo (cube, wordmark and "Build · Automate · Scale")
  favicon.svg
templates/        Industry demo websites to show clients (see below)
```

## Website templates (client demos)

`templates/index.html` is a gallery page with live previews of nine demo websites, each for a fictional business with its own look:

| Folder | Industry | Highlights |
|---|---|---|
| `pharmacy/` | Pharmacy / medical shop | Prescription upload, categories, offers, store locator |
| `restaurant/` | Restaurant / café | Tabbed menu with ₹ prices, veg/non-veg marks, gallery, reservations |
| `hospital/` | Hospital / clinic | Appointment booking, departments, doctors, health packages |
| `labs-scans/` | Diagnostic lab & scan centre | Test search, health packages, home sample collection, X-ray/CT/MRI prices, report download |
| `bakery/` | Bakery / cake shop | Bestsellers, custom cake order form, eggless tags |
| `salon/` | Salon & spa | Service price list, bridal packages, team, booking |
| `school/` | School / college | Admissions, academics, facilities, notice board |
| `gym/` | Gym & fitness | Plans, class schedule, BMI calculator, free trial |
| `real-estate/` | Builders & realty | Property filters, amenities, EMI calculator, site visits |

All templates share `templates/shared.css` and `templates/shared.js` (header, mobile menu, forms, tabs, footer). Each sets its own colours and fonts in a `<style>` block at the top. Every template has a dark bar at the top linking back to the gallery, plus a **Get this website** button. That button opens the main site's contact form with the template already filled in (`index.html?template=Name#contact`). The bar is hidden automatically when a template is shown as a preview in the gallery.

Forms in the templates are demo-only: they show a thank-you message and don't send anything. To turn a template into a client's real site, copy its folder, replace the names, contact details and content, swap the emoji/gradient visuals for real photos, and remove the demo bar.

## Light / dark theme

The sliding sun / moon switch in the header changes the site between light and dark. The choice is saved in the visitor's browser and applies to the homepage, the templates gallery and the 404 page. Until someone picks a theme, the site follows their device setting. Dark colours are defined once in `css/style.css` under `:root[data-theme="dark"]` (and repeated for the device-setting case below it). The demo templates keep their own designs.

## Updating CSS or JS

Pages load `css/style.css`, `js/*.js` and the templates' `shared.css` / `shared.js` with a `?v=` version tag so visitors' browsers don't keep an old copy. After changing one of those files, bump the date in the tag (search for `?v=`).

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Before going live: things to update

1. **Contact details.** Edit the `CONTACT` object at the top of `js/main.js` (phone, WhatsApp number, email, address). Every phone, email and WhatsApp link on the page is filled from there. Also replace the placeholder values in `index.html` (search for `0000000000` and `saasqube.example`) so the links work even with JavaScript off.
2. **Pricing.** The packages in the `#pricing` section are starting points; adjust them to your real rates.
3. **SEO.** Update the `<title>`, `<meta name="description">` and the JSON-LD block in `index.html` with your exact city/address, and add a `<link rel="canonical">` once you have a domain.

## How the contact form works

There's no server. When a visitor submits the form it builds a message from their answers and opens either **WhatsApp** (`wa.me`) or their **email app** (`mailto:`), addressed to you. To collect submissions in an inbox or a database instead, point the form at a service such as Formspree, Netlify Forms or your own backend.

## Deploy

Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages, Render static sites, or ordinary shared hosting (upload the files to `public_html`).

For **GitHub Pages**: repository *Settings → Pages → Deploy from a branch*, choose the branch and `/ (root)`.
