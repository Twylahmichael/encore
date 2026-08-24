-- Supabase's security advisor flagged both SECURITY DEFINER functions with
-- a mutable search_path — a real hardening gap (a malicious search_path
-- could shadow `staff_profiles` at call time). Pin it explicitly.
alter function public.is_staff() set search_path = public;
alter function public.is_owner() set search_path = public;
