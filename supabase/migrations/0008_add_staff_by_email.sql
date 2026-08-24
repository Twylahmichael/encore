-- Lets an owner add staff via the admin Users page: looks up an existing
-- auth.users account by email (only possible here because this function
-- is SECURITY DEFINER — a normal client role can't query auth.users) and
-- grants staff_profiles access. Does NOT create a new login — the target
-- must already have signed up (any Supabase Auth account: portal, shop
-- login, or a prior admin bootstrap attempt).

create or replace function add_staff_by_email(target_email text, staff_role text, staff_name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
begin
  if not is_owner() then
    raise exception 'only an owner can add staff';
  end if;
  if staff_role not in ('owner','staff') then
    raise exception 'invalid role';
  end if;
  select id into target_id from auth.users where email = target_email;
  if target_id is null then
    raise exception 'no account found for that email — they need to sign up first (e.g. via /my-encore or /login)';
  end if;
  insert into staff_profiles (id, role, name) values (target_id, staff_role, staff_name)
  on conflict (id) do update set role = excluded.role, name = excluded.name;
  return true;
end;
$$;

revoke all on function add_staff_by_email(text, text, text) from public;
grant execute on function add_staff_by_email(text, text, text) to authenticated;
