-- ============================================================================
-- Promote a Supabase Auth user to the "admin" role for the Figimi admin panel.
-- ============================================================================
--
-- Prerequisites (do these first, once):
--   1. Run the migrations in supabase/migrations/ (in order), then supabase/seed.sql.
--   2. In the Supabase dashboard: Authentication -> Providers -> enable "Email"
--      (email + password). Turn OFF public sign-ups so only you create accounts.
--   3. Authentication -> Users -> "Add user" -> create your account with a
--      strong password (and confirm the email if prompted).
--
-- A database trigger automatically creates a matching row in public.profiles
-- with role = 'editor'. Run the statement below to upgrade that account to
-- 'admin'. (Both 'admin' and 'editor' can sign in; 'admin' is full access.)
--
-- HOW TO USE: replace the email below with your real login email, then run
-- this file in the Supabase SQL editor.
-- ----------------------------------------------------------------------------

update public.profiles
set role = 'admin',
    username = coalesce(username, 'admin')
where id = (select id from auth.users where email = 'you@example.com');

-- Verify it worked (should show one row with role = admin):
select p.id, u.email, p.username, p.role
from public.profiles p
join auth.users u on u.id = p.id
where u.email = 'you@example.com';
