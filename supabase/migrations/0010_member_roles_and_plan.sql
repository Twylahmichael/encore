-- Account types for the member portal: a member is either a regular
-- 'member' or a 'coach'. Coach accounts link to a row in `coaches` (via
-- coach_id) so a signed-in coach can see their own assigned classes on
-- /my-encore/account. current_plan_id records which membership plan a
-- member is on (set manually by staff in the admin panel — there's no
-- automated payment link yet, matching how the studio actually collects
-- membership dues in person / via M-Pesa).
--
-- Deliberately NOT a new table: "coach" here is a portal-level account
-- type on `members`, distinct from `staff_profiles` (owner/staff, admin
-- panel access) — a coach signs in and sees their classes like any other
-- member, they don't get admin access.

alter table members add column if not exists role text not null default 'member'
  check (role in ('member', 'coach'));
alter table members add column if not exists coach_id uuid references coaches(id) on delete set null;
alter table members add column if not exists current_plan_id text references membership_plans(id) on delete set null;

create index if not exists idx_members_coach_id on members(coach_id) where coach_id is not null;
