# Data model — Supabase

## Principles

- Canonical inventory in Postgres (PostGIS for surveyed plots; local-plan coords for authored layouts)
- Availability never stored only in GLB materials
- Public clients receive publishable fields only
- Status changes are atomic with optimistic locking + audit trail

## Enums

```sql
create type project_status as enum (
  'draft', 'published', 'coming_soon', 'sold_out', 'archived'
);

create type plot_status as enum (
  'available', 'held', 'reserved', 'sold', 'unreleased'
);

create type enquiry_intent as enum (
  'viewing', 'plot', 'payment', 'general', 'whatsapp'
);

create type accuracy_level as enum (
  'authoritative', 'reconstructed', 'visual_only'
);
```

## Core tables

### `profiles`

Extends auth.users for admin staff.

- `id uuid pk references auth.users`
- `full_name text`
- `role text check in ('admin','editor','sales')`
- `created_at timestamptz`

### `projects`

- `id uuid pk`
- `slug text unique`
- `name text`
- `tagline text`
- `location_label text`
- `city text`
- `region text`
- `latitude numeric`
- `longitude numeric`
- `true_north_deg numeric default 0`
- `property_type text` — house | apartment | land | commercial | mixed
- `status project_status`
- `starting_price_ghs numeric`
- `price_display text`
- `summary text`
- `body jsonb` — sections
- `hero_media_path text`
- `brochure_path text`
- `published_at timestamptz`
- `last_verified_at timestamptz`
- `version int default 1`
- `created_at` / `updated_at`

### `project_units` (optional non-plot inventory)

For townhouse/apartment variants without land polygons.

### `plots`

- `id uuid pk`
- `project_id uuid references projects`
- `plot_code text` — “12”
- `status plot_status`
- `status_version int default 1` — optimistic lock
- `hold_expires_at timestamptz`
- `width_m numeric`
- `depth_m numeric`
- `area_sqm numeric`
- `facing text` — N/E/S/W/NE...
- `is_corner boolean`
- `price_ghs numeric`
- `road_access text`
- `geom geometry(Polygon, 4326)` nullable for local-plan
- `local_polygon jsonb` — [[x,y],...] in site metres
- `centroid jsonb`
- `glb_node_name text`
- `metadata jsonb`
- unique (`project_id`, `plot_code`)

### `media_assets`

- project/plot linkage, path, alt, kind, sort

### `floor_plans`

- `id`, `project_id`, `unit_label`, `level`, `svg_path`, `glb_path`
- `sidecar_json jsonb` — rooms/hotspots/cameras
- `accuracy accuracy_level`
- `published boolean`

### `enquiries`

- `id`
- `project_id` / `plot_id` nullable
- `intent enquiry_intent`
- `full_name`, `phone`, `email`, `message`
- `consent_at timestamptz not null`
- `source_url`, `utm jsonb`
- `status text` — new | contacted | closed
- `assigned_to`
- `created_at`

### `inventory_audit`

- `id`, `plot_id`, `actor_id`, `from_status`, `to_status`
- `note`, `created_at`

## Status transition rules

Allowed:

- available → held | reserved | sold | unreleased
- held → available | reserved | sold (if hold expired → available via job)
- reserved → sold | available
- sold → available (admin correction only, audited)
- unreleased → available

`update plots set status = $new, status_version = status_version + 1 where id = $id and status_version = $expected`

## RLS sketch

- Public read: published projects, available/held/reserved/sold plots (publishable columns), published floor plans
- Public insert: enquiries only (with validation via edge/API)
- Authenticated staff: full CRUD on inventory based on role
- Storage: public read for published media; write for staff

## Realtime

Subscribe to `plots` changes filtered by `project_id` for Plot Explorer legend and colors.
