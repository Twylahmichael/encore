-- Fixes a real bug: both the admin owner-bootstrap and member portal signup
-- tried to insert their profile row (staff_profiles / members) immediately
-- after supabase.auth.signUp(). That only works if signUp grants a session
-- right away. This project has email confirmation ON (the default for a
-- new Supabase project), so signUp does NOT grant a session — auth.uid()
-- is null client-side until the user confirms their email and signs in —
-- and the RLS insert policies correctly reject an insert with no session.
-- Discovered when the very first owner-bootstrap attempt silently failed
-- this way (see session history 2026-08-24).
--
-- Fix: move profile-row creation into SECURITY DEFINER functions called
-- AFTER a real authenticated session exists (i.e. after sign-in, not
-- right after signup). Both are self-limiting by construction:
--   - claim_first_owner: only ever inserts when staff_profiles is empty,
--     and only for auth.uid() itself — a caller can never grant owner to
--     someone else's account.
--   - ensure_member_profile: upserts (on conflict do nothing) using
--     auth.uid() itself — same "can only act on your own identity" shape.
-- Both work identically whether email confirmation is on or off, so this
-- isn't dependent on that project setting.

create or replace function claim_first_owner(owner_name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (select 1 from staff_profiles) then
    return false;
  end if;
  insert into staff_profiles (id, role, name) values (auth.uid(), 'owner', owner_name);
  return true;
end;
$$;

revoke all on function claim_first_owner(text) from public;
grant execute on function claim_first_owner(text) to authenticated;

create or replace function ensure_member_profile(member_name text, member_phone text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  insert into members (id, name, phone)
  values (auth.uid(), member_name, member_phone)
  on conflict (id) do nothing;
end;
$$;

revoke all on function ensure_member_profile(text, text) from public;
grant execute on function ensure_member_profile(text, text) to authenticated;
