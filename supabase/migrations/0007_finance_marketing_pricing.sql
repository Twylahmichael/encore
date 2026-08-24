-- Adds real schema behind the four admin areas requested (translated from
-- a food-delivery admin panel screenshot to what Encore actually is — a
-- single-location fitness studio + small supplement shop, not a
-- multi-vendor marketplace; Kitchen/Drivers/Vendors/Zones/Branches/Bundles
-- were dropped as not applicable, see session record 2026-08-24):
--
--   Finance & Reports — reads existing orders/order_items, no new tables.
--   Marketing          — campaigns, discount_codes.
--   Users & Support    — reads existing members/staff_profiles/contact_messages.
--   Pricing & Payments — membership_plans (replaces the static file as
--                        source of truth), product_price_overrides (keeps
--                        products.ts as the content source, DB only
--                        overrides price), orders.payment_method +
--                        discount fields.

-- ── Payments on orders ──────────────────────────────────────────────────
alter table orders add column if not exists payment_method text
  check (payment_method in ('mpesa', 'cash')) default 'mpesa';
alter table orders add column if not exists discount_code text;
alter table orders add column if not exists discount_amount_kes numeric not null default 0;

-- ── Pricing: membership plans move from static file to DB ──────────────
-- id matches the existing string ids in src/data/membershipPlans.ts
-- (daily, monthly, quarterly, half-year, annual, couples-monthly) so the
-- live hook can key off the same values the static fallback uses.
create table if not exists membership_plans (
  id text primary key,
  name text not null,
  price_kes numeric not null,
  sort_order int not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ── Pricing: product price overrides (products.ts stays the content
--    source — name/image/slug; DB only overrides price when present) ────
create table if not exists product_price_overrides (
  product_slug text primary key,
  price_kes numeric not null,
  updated_at timestamptz not null default now()
);

-- ── Marketing: discount codes (applied at checkout) ─────────────────────
create table if not exists discount_codes (
  code text primary key,
  description text,
  percent_off numeric check (percent_off is null or (percent_off > 0 and percent_off <= 100)),
  amount_off_kes numeric check (amount_off_kes is null or amount_off_kes > 0),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint one_discount_type check (
    (percent_off is not null and amount_off_kes is null) or
    (percent_off is null and amount_off_kes is not null)
  )
);

-- ── Marketing: campaigns (simple announcements, e.g. a homepage banner —
--    distinct from `events`, which are real studio events like Dance Club) ─
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── Rewards: simple points balance on members, admin-adjustable.
--    Not auto-accrued on purchase yet — that needs an order-completion
--    trigger, not built in this pass (flagged, not silently skipped). ────
alter table members add column if not exists loyalty_points int not null default 0;

-- ── RLS ──────────────────────────────────────────────────────────────
alter table membership_plans enable row level security;
alter table product_price_overrides enable row level security;
alter table discount_codes enable row level security;
alter table campaigns enable row level security;

create policy "public read membership_plans" on membership_plans for select using (active);
create policy "public read product_price_overrides" on product_price_overrides for select using (true);
create policy "public read active discount_codes" on discount_codes
  for select using (active and (expires_at is null or expires_at > now()));
create policy "public read active campaigns" on campaigns
  for select using (active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));

create policy "staff full access membership_plans" on membership_plans for all using (is_staff());
create policy "staff full access product_price_overrides" on product_price_overrides for all using (is_staff());
create policy "staff full access discount_codes" on discount_codes for all using (is_staff());
create policy "staff full access campaigns" on campaigns for all using (is_staff());

-- Staff need to read contact_messages (already has "staff read
-- contact_messages" from 0001) and members (already has "staff full
-- access members" from 0001) — no new policies needed for the Users/
-- Support admin pages, they read tables already staff-readable.

-- Seed membership_plans from the real, current prices in
-- src/data/membershipPlans.ts (sampled from efn.co.ke 2026-08-23).
insert into membership_plans (id, name, price_kes, sort_order) values
  ('daily', 'Daily Pass', 400, 1),
  ('monthly', 'Monthly Pass', 4000, 2),
  ('quarterly', 'Quarterly Pass', 10500, 3),
  ('half-year', 'Half Year Pass', 20000, 4),
  ('annual', 'Annual Pass', 36000, 5),
  ('couples-monthly', 'Couples Monthly Pass', 7500, 6)
on conflict (id) do nothing;
