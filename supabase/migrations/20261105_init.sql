-- Afro Arab inventory + leads schema
-- Apply with Supabase CLI or SQL editor after linking the project.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.project_status as enum (
    'draft', 'published', 'coming_soon', 'sold_out', 'archived'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.plot_status as enum (
    'available', 'held', 'reserved', 'sold', 'unreleased'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enquiry_intent as enum (
    'viewing', 'plot', 'payment', 'general', 'whatsapp'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.accuracy_level as enum (
    'authoritative', 'reconstructed', 'visual_only'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null check (role in ('admin', 'editor', 'sales')) default 'editor',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  location_label text,
  city text,
  region text,
  latitude numeric,
  longitude numeric,
  true_north_deg numeric default 0,
  property_type text not null,
  status public.project_status not null default 'draft',
  starting_price_ghs numeric,
  price_display text,
  summary text,
  body jsonb default '{}'::jsonb,
  hero_media_path text,
  brochure_path text,
  published_at timestamptz,
  last_verified_at timestamptz,
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  plot_code text not null,
  status public.plot_status not null default 'unreleased',
  status_version int not null default 1,
  hold_expires_at timestamptz,
  width_m numeric,
  depth_m numeric,
  area_sqm numeric,
  facing text,
  is_corner boolean default false,
  price_ghs numeric,
  road_access text,
  local_polygon jsonb,
  centroid jsonb,
  glb_node_name text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, plot_code)
);

create table if not exists public.floor_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  unit_label text,
  level int default 0,
  svg_path text,
  glb_path text,
  sidecar_json jsonb default '{}'::jsonb,
  accuracy public.accuracy_level not null default 'reconstructed',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  project_slug text,
  plot_id uuid references public.plots(id) on delete set null,
  plot_code text,
  intent public.enquiry_intent not null default 'general',
  full_name text not null,
  phone text not null,
  email text not null,
  message text,
  consent_at timestamptz not null,
  source_url text,
  utm jsonb default '{}'::jsonb,
  status text not null default 'new',
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_audit (
  id uuid primary key default gen_random_uuid(),
  plot_id uuid not null references public.plots(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  from_status public.plot_status,
  to_status public.plot_status not null,
  note text,
  created_at timestamptz not null default now()
);

-- Optimistic status transition helper
create or replace function public.transition_plot_status(
  p_plot_id uuid,
  p_expected_version int,
  p_new_status public.plot_status,
  p_actor uuid default null,
  p_note text default null
) returns public.plots
language plpgsql
security definer
as $$
declare
  updated_row public.plots;
  old_status public.plot_status;
begin
  select status into old_status from public.plots where id = p_plot_id for update;
  update public.plots
    set status = p_new_status,
        status_version = status_version + 1,
        updated_at = now()
    where id = p_plot_id
      and status_version = p_expected_version
    returning * into updated_row;

  if updated_row.id is null then
    raise exception 'plot version conflict or missing plot';
  end if;

  insert into public.inventory_audit (plot_id, actor_id, from_status, to_status, note)
  values (p_plot_id, p_actor, old_status, p_new_status, p_note);

  return updated_row;
end;
$$;

alter table public.projects enable row level security;
alter table public.plots enable row level security;
alter table public.floor_plans enable row level security;
alter table public.enquiries enable row level security;
alter table public.inventory_audit enable row level security;
alter table public.profiles enable row level security;

create policy "Public read published projects"
  on public.projects for select
  using (status in ('published', 'coming_soon', 'sold_out'));

create policy "Public read plots of published projects"
  on public.plots for select
  using (
    exists (
      select 1 from public.projects pr
      where pr.id = plots.project_id
        and pr.status in ('published', 'coming_soon', 'sold_out')
    )
  );

create policy "Public read published floor plans"
  on public.floor_plans for select
  using (published = true);

create policy "Anyone can insert enquiries"
  on public.enquiries for insert
  with check (consent_at is not null);

create policy "Staff manage profiles"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Staff write policies should be refined with a role claim / profiles.role check
create policy "Authenticated staff write projects"
  on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated staff write plots"
  on public.plots for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
