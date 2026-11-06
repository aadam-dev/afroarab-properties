# Asset sources

## Scraped / audited from afroarabproperties.com (Nov 2026)

- Full current-site audit in `docs/audit/current-site.md`
- Project names, locations, marketing copy, and price *claims* captured into `src/data/projects.ts` with verification notes
- Public contact block: 26 Cotton Avenue, Kokomlemle, Accra; `info@afroarabproperties.com`; `+233 244 109 133` / `+233 55 985 1280`
- Support-page office map query: `Afro Arab Properties, Alhaji Moro St. Nima, Accra` (confirm entrance vs Cotton Avenue copy)
- Per-estate Google Maps embeds restored into `mapQuery` on project records (Achiaman, O’Reilly Spintex, DVLA Botwe, East Legon Hills, Tema C25, Ningo Prampram, Obeyeyie Amasaman, Oyarifa Rd, Katamanso, Santoe, Mamobi)
- Leadership headshots from `/about`: Alhaji Salamu Amadu (Chairman/CEO), Abdul S. Mohammed (MD), Cephas Kwaku Forfoe (GM) → `public/images/team/`
- WhatsApp sales path uses `+233 55 985 1280` (`NEXT_PUBLIC_WHATSAPP_NUMBER` override)
- Public WordPress media downloaded into `public/images/projects/` and `public/brand/` for this rebuild preview
- Brand marks in use: `public/brand/logo-green.png`, `logo-lockup.png`, `favicon-180.png`

## Galleries (exteriors only)

- Multi-image exteriors wired where files exist: Cephas, Hassy, Paapa’s, Lamin’s
- **No interior stills or equirectangular 360s** were present in the scraped WP media set used for this rebuild
- Floor-plan “360” remains procedural / visual_only until client photography arrives

## Generated stand-ins (still present)

- `public/images/hero-compound.jpg`, `detail-entrance.jpg`, `lands-atmosphere.jpg` — cinematic AI architecture used early in the luxury pass
- Hero prefers real Lamin’s Court photography (`hero-lamins.jpg`) where wired

## Not yet available from client

- Verified CAD/IFC floor plans
- Surveyed plot polygons / true-north
- Interior photography and real 360 panoramas
- Award certificates and leadership headshots
- Counsel-approved privacy/terms final copy
