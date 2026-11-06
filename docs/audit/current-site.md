# Current site audit — afroarabproperties.com

Audit date: 5 November 2026  
Scope: read-only browser + HTML/performance observation. Forms were not submitted.

## Executive summary

The business looks real and active, but the site undermines trust with contradictory property data, missing legal notices, duplicate/draft pages, weak SEO, heavy Elementor plugin weight, and generic conversion paths.

## Immediate remediation risks (before redesign)

1. **Contradictory property facts** that can mislead buyers (counts, sizes, locations, statuses)
2. **Legal/privacy links resolve to `#`** while forms collect personal data
3. **Indexable duplicate/draft homepages**: `/`, `/home/`, `/new-homepage-draft/`

## Critical findings

### C1 — Materially inconsistent property data

- Homepage categories claim 4,546 houses / 421 apartments / 1,526 commercial / 372 offices; About cites ~207 properties
- Multiple project cards reuse `95 sqft`, `2-4` beds, `2` baths, “Self-Compound”
- Lamin’s Court labelled apartment and town house; bedroom counts conflict; marked sold out while still showing price + enquiry
- Hawa’s Court location/description mix Ningo Prampram with Obeyeyie/Amasaman copy
- Prices vary between formats and values for the same projects
- About claims founding in 2009 while “Years in Action” shows `0+`
- Services page contains Indonesian template remnants (Surabaya, Bandung, Kalimantan)
- Duplicate naming (Cephas Court / Cephas’ Court; Anasaman typo)

### C2 — Privacy and legal notices missing

- Terms of use, Privacy Policy, Cookie Policy, Legal Notice → `#`
- Inquiry forms collect name, phone, email without visible consent/privacy disclosure
- Interest-free payment plans advertised without linked detailed terms

### C3 — Draft and duplicate pages indexable

- `/new-homepage-draft/` public, self-canonical, in sitemap
- `/` and `/home/` both indexable with overlapping content
- Draft exposes unfinished messaging and multiple H1s

## High findings

| ID | Issue | Evidence |
| --- | --- | --- |
| H1 | Weak trust substantiation | Award/certified/titled claims rarely linked to documents |
| H2 | Generic conversion | “Learn More”, “More detail”; category cards all → Projects; forms lack project context |
| H3 | Poor lab performance | ~5.4 MB transfer / ~7.8–8.0 MB decoded; 51 scripts; FCP ~8.4s; load ~11.5s |
| H4 | Accessibility defects | 24/38 empty alts; empty links; duplicate IDs; multiple H1s; off-screen focusable menu; small targets |
| H5 | SEO fundamentals missing | No meta descriptions; no OG/Twitter on homepage; no JSON-LD; Projects missing H1 |
| H6 | Copy quality | Grammar errors, mixed positioning (affordable vs luxury), lorem on About |
| H7 | Mobile length/noise | ~9,560 px homepage; carousel + popup noise; tiny footer text |
| H8 | Thin blog authority | Keyword-led burst posts; weak sourcing |

## Medium findings

- “The Company” nav → `#`; Leadership → generic About; Contact titled Support
- Inquiry panel competes with hero; Contact CTA clipping observed
- Forms lack autocomplete, spam challenge, project attribution
- Missing security headers (HSTS, CSP, frame-ancestors, Referrer-Policy, Permissions-Policy)
- Social links: duplicates; stale/empty destinations
- Currency/label inconsistency (`GH¢`, `GHS`, `$`, `M`)

## Stack observed

WordPress + Hello Elementor + Elementor/Pro + ElementsKit + Jeg Kit + MetForm + Premium Addons + Element Pack + Popup Maker + custom nexa-hero-slider + Breeze + Font Awesome / Material Icons / multiple Google fonts (Roboto, Inter, Open Sans, Heebo, Roboto Slab).

## What works

- HTTPS + www redirects
- Canonical tags present
- Address, phones, emails visible
- Property pages have maps/galleries/prices
- Lazy loading + srcset on many images
- Skip link and landmarks present

## Rebuild implication

This is a **data + trust + conversion rebuild**, not a visual reskin. Canonical project records, compliant forms/legal pages, lean frontend, and project-aware CTAs are mandatory.
