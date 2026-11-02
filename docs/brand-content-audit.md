# Brand and content audit

Audit date: 2 November 2026. Scope: publicly accessible source-site content and local marketplace implementation. No source-site data was written or imported into marketplace listings.

## Sources checked

| Source | Result | Use |
| --- | --- | --- |
| [Official Newzealankans homepage](https://newzealankans.co.nz/) | Accessible. Shows the name “NewZealankans – නවසීලාංකිකයෝ”, tagline “හදවතින්ම නවසීලාංකිකයි!!”, and navigation for articles, New Zealand news, events, things to do, jobs, and related community content. | Tagline added to marketplace metadata. Events links shown separately from marketplace listings. |
| [Official events category](https://newzealankans.co.nz/events-nz/) | Referenced by the homepage; current public posts include the linked event pages below. | Source link for the small community-events panel. |
| [AYU event](https://newzealankans.co.nz/events-nz/2182/) | Homepage entry dated 1 November 2026 lists Auckland, 21 November 2026 at 4:00 pm. Direct page fetch was unavailable during this audit. | Title, date, and location shown as a link to the original. |
| [Eda Ra event](https://newzealankans.co.nz/events-nz/1795/) | Public page lists Auckland shows on 7, 8, 14, and 15 November 2026. | Title, dates, and location shown as a link to the original. |
| [Infinity event](https://newzealankans.co.nz/events-nz/1962/) | Public page lists Auckland, Friday 5 February 2027, 7:00 pm at NZICC. | Title, date, and location shown as a link to the original. |
| [Apple Event 2026 article](https://newzealankans.co.nz/articles-nz/1819/) | Public Newzealankans article published 10 September 2026; its page includes claims about Apple products and availability. | Reviewed but not imported or promoted. It is product/news editorial content rather than marketplace content, and its claims were not independently verified here. |
| [New Zealand citizenship fees article](https://newzealankans.co.nz/articles-nz/1771/) | Homepage lists this article dated 28 August 2026; direct page fetch was unavailable. | Reviewed but not imported; no separate news area was added. |
| [WordPress REST API](https://newzealankans.co.nz/wp-json/) and [feed](https://newzealankans.co.nz/feed/) | Could not be confirmed accessible using the available read-only source inspection. No sync process or API integration was added. | Manually curated outbound links only; review/update dates as source content changes. |
| [Old marketplace](https://marketplace.newzealankans.co.nz/) | Not available to verify, and client context identifies it as an unfinished AdForest setup. | No listing, image, or demo content used. |
| [New frontend](https://new-zealankanz-frontend.vercel.app/) | Existing marketplace site. | Read-only live smoke checks are part of this client-review release. |

## Verified and integrated

- The client confirmed the repository’s `newzealankanz-logo-transparent.png` is the approved logo. Header, footer, favicon, and Open Graph metadata use this same asset.
- Metadata description includes the public tagline. The marketplace keeps its own marketplace name and listing scope.
- The existing three local demo images and slide copy remain in the hero temporarily, as approved by the client. They are not presented as official news or advertisements.
- A compact homepage community-events section links to three public Newzealankans event pages. It contains no event images, ticketing claims, ad placements, or seller listings, and hides entries after their final listed date.
- Existing banner placements continue to use the local supported HOME, SIDEBAR, and FOOTER placement API. No source-site content is turned into advertising.
- The existing marketplace `/contact` form continues to accept support and advertising enquiries. Listing contact name, email, and optional phone continue to come from marketplace seller records. No fixed marketplace support phone or email is hardcoded in the public frontend; the example emails in the unused fallback listing fixture are not shown as marketplace support contacts.
- Placement placeholders are explicitly labelled “Ad placement preview” and are shown only for an explicit preview, administrator preview, or preview query. Empty placements remain hidden for ordinary visitors.

## Approval or missing inputs

- **Marketplace contact details:** the public frontend has a support/advertising contact form and seller-provided details, but no static marketplace phone or support email. The main-site footer’s Auckland address, phone, and provider email remain excluded because the site credits Hype Digital NZ. No contact details were fabricated or substituted.
- **Automated content feed:** a working authorized read-only REST endpoint or feed was not confirmed. The events panel is static and should be reviewed periodically or replaced once an approved, reliable endpoint is available.
- **Hero banner assets/content:** the client approved keeping the current three demo hero images for this review; replacement with official banners is deferred. The events section remains separate from the slider and ads.

## Data separation and safeguards

- No listing or seller data was copied from the old AdForest marketplace or the main WordPress site.
- Community events are outbound editorial links and are not written to marketplace listing/ad APIs or schemas.
- No production database, WordPress site, or DNS was changed. The frontend was updated on the existing Vercel project for client review only; this is not final launch approval.
