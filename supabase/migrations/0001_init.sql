-- Encore — initial Supabase schema.
-- Carries forward the booking/admin architecture from the Encore proposal
-- (dynamic schedule, coaches, WhatsApp booking, member accounts, audit log),
-- translated from the earlier SQLite design to Postgres + RLS.

create extension if not exists "pgcrypto";

-- ── Staff / admin roles ────────────────────────────────────────────────
-- Admin/staff accounts are Supabase Auth users; this table adds the role.
create table if not exists staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  name text,
  created_at timestamptz not null default now()
);

-- ── Coaches ─────────────────────────────────────────────────────────────
create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  photo_path text,
  bio text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── Weekly class schedule ───────────────────────────────────────────────
-- Seed matches the live site's current static "Workout Schedule" table
-- exactly (see src/data/schedule.ts) — this is what Phase 1 replaces with
-- a staff-editable board.
create table if not exists class_slots (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time text not null,
  end_time text not null,
  class_name text not null,
  coach_id uuid references coaches(id) on delete set null,
  capacity int,
  notes text,
  active boolean not null default true
);
create index if not exists idx_class_slots_day on class_slots(day_of_week, start_time);

-- ── Events ──────────────────────────────────────────────────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  cover_path text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Gallery ─────────────────────────────────────────────────────────────
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('facility','classes','coaches','events')),
  image_path text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── Members + bookings ──────────────────────────────────────────────────
-- Members are Supabase Auth users (public.members mirrors app-specific fields).
create table if not exists members (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null unique,       -- E.164
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_members_phone on members(phone);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references class_slots(id) on delete cascade,
  session_date date not null,
  member_id uuid references members(id) on delete set null,
  member_name text not null,
  member_phone text not null,
  source text not null default 'portal' check (source in ('portal','whatsapp','walk-in','admin')),
  status text not null default 'confirmed' check (status in ('confirmed','cancelled','no-show','attended')),
  created_at timestamptz not null default now(),
  cancelled_at timestamptz,
  cancel_reason text,
  unique (slot_id, session_date, member_id)
);
create index if not exists idx_bookings_date on bookings(session_date, slot_id);
create index if not exists idx_bookings_member on bookings(member_id, session_date);

-- ── Site forms (this replica adds Supabase-backed submission for the two
--    real forms sampled from efn.co.ke: Contact and Membership Signup) ────
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists membership_signups (
  id uuid primary key default gen_random_uuid(),
  plan_id text not null,
  first_name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

-- ── Settings (WhatsApp number/template, stat counters) ─────────────────
create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ── Audit log — append-only ──────────────────────────────────────────────
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor uuid references auth.users(id) on delete set null,
  actor_email text not null,
  action text not null,
  entity text not null,
  entity_id text,
  before_json jsonb,
  after_json jsonb,
  at timestamptz not null default now()
);
create index if not exists idx_audit_at on audit_log(at desc);

-- ── Row Level Security ────────────────────────────────────────────────
alter table coaches enable row level security;
alter table class_slots enable row level security;
alter table events enable row level security;
alter table gallery_items enable row level security;
alter table members enable row level security;
alter table bookings enable row level security;
alter table contact_messages enable row level security;
alter table membership_signups enable row level security;
alter table settings enable row level security;
alter table staff_profiles enable row level security;
alter table audit_log enable row level security;

-- Public read access — schedule/coaches/events/gallery/settings mirror what's
-- already public on efn.co.ke.
create policy "public read coaches" on coaches for select using (active);
create policy "public read class_slots" on class_slots for select using (active);
create policy "public read events" on events for select using (published);
create policy "public read gallery" on gallery_items for select using (true);
create policy "public read settings" on settings for select using (true);

-- Anyone can submit the contact form / membership signup (write-only for anon).
create policy "anon insert contact_messages" on contact_messages for insert with check (true);
create policy "anon insert membership_signups" on membership_signups for insert with check (true);

-- Members manage their own booking rows only.
create policy "member reads own profile" on members for select using (auth.uid() = id);
create policy "member reads own bookings" on bookings for select using (auth.uid() = member_id);
create policy "member inserts own bookings" on bookings for insert with check (auth.uid() = member_id);
create policy "member cancels own bookings" on bookings for update using (auth.uid() = member_id);

-- Staff/owner — full read/write via a helper checking staff_profiles.
create or replace function is_staff() returns boolean
language sql stable security definer as $$
  select exists (select 1 from staff_profiles where id = auth.uid());
$$;

create policy "staff full access coaches" on coaches for all using (is_staff());
create policy "staff full access class_slots" on class_slots for all using (is_staff());
create policy "staff full access events" on events for all using (is_staff());
create policy "staff full access gallery" on gallery_items for all using (is_staff());
create policy "staff full access members" on members for all using (is_staff());
create policy "staff full access bookings" on bookings for all using (is_staff());
create policy "staff read contact_messages" on contact_messages for select using (is_staff());
create policy "staff read membership_signups" on membership_signups for select using (is_staff());
create policy "staff manage settings" on settings for all using (is_staff());
create policy "staff read audit_log" on audit_log for select using (is_staff());
