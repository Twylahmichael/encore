-- Adds real orders (for the working cart/checkout) and opens up the
-- self-service signup paths the UI actually uses:
--   - members: a signed-in user can create their own member row
--   - staff_profiles: bootstrap-only — the FIRST account ever to sign up
--     through /admin becomes owner; every account after that must be
--     added by an existing owner (no open self-serve staff signup).

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  subtotal_kes numeric not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','paid','fulfilled','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  unit_price_kes numeric not null,
  quantity int not null check (quantity > 0)
);
create index if not exists idx_order_items_order on order_items(order_id);

alter table orders enable row level security;
alter table order_items enable row level security;

-- Anyone can place an order (this replica has no member-gated checkout,
-- matching the live site where checkout doesn't require an account either).
create policy "anon insert orders" on orders for insert with check (true);
create policy "anon insert order_items" on order_items for insert with check (true);
create policy "staff full access orders" on orders for all using (is_staff());
create policy "staff full access order_items" on order_items for all using (is_staff());

-- Members: a signed-in user creates exactly one row for themselves.
create policy "member inserts own row" on members for insert with check (auth.uid() = id);

-- Staff bootstrap: allow a signed-in user to insert their OWN staff_profiles
-- row only when the table is currently empty (i.e. they're the first ever —
-- becomes owner). After that, only an existing owner can add more (see
-- "owner manages staff" below).
create policy "bootstrap first owner" on staff_profiles
  for insert
  with check (
    auth.uid() = id
    and not exists (select 1 from staff_profiles)
  );

-- 0001 enabled RLS on staff_profiles but only granted table-level access to
-- OTHER tables via is_staff() — it never gave staff_profiles itself a
-- select/update/delete policy. Add those here:
create policy "self reads own staff profile" on staff_profiles
  for select using (auth.uid() = id);

create policy "staff reads all staff profiles" on staff_profiles
  for select using (is_staff());

create or replace function is_owner() returns boolean
language sql stable security definer as $$
  select exists (select 1 from staff_profiles where id = auth.uid() and role = 'owner');
$$;

create policy "owner manages staff" on staff_profiles
  for all using (is_owner());
