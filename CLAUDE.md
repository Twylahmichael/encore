# Encore

React + Supabase companion system for **[efn.co.ke](https://efn.co.ke)** (Encore Fitness Studio, Nairobi — brand name confirmed by the client 2026-08-24; the site's own metadata says "Encore Fitness and Nutrition," see `docs/COMPARISON.md`) — a visual replica of the live WordPress/Elementor/Blocksy site, plus the booking/admin architecture from the Encore proposal (dynamic schedule, WhatsApp booking, member accounts).

> Note: an earlier scaffold of this project used a different (ivory/nude/sand/teal/magenta) design direction, written before the live site's actual CSS had been sampled. That palette is superseded — the design system below is sampled directly from efn.co.ke's compiled CSS, not approximated.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (tokens below wired into `tailwind.config.js`)
- React Router
- Supabase (Postgres + Auth + RLS) — schema in `supabase/migrations/`

## Design system — sampled from the live site

Source: `blocksy-global.css`'s `--theme-palette-color-*` custom properties (Blocksy theme's Customizer-set global palette), which every Elementor color on the site references via `var(--e-global-color-blocksy_palette_N)`.

| Token | Hex | Elementor ref | Use on the live site |
|---|---|---|---|
| `efn-green` | `#7cb041` | `blocksy_palette_1` | Primary brand green — buttons, accents, price text |
| `efn-black` | `#000000` | `blocksy_palette_2` | Body text, dark section backgrounds |
| `efn-green-deep` | `#225625` | `blocksy_palette_3` | Deep green — hover states |
| `efn-gray` | `#b6b6b6` | `blocksy_palette_4` | Muted text, borders |
| `efn-mint` | `#f2ffe3` | `blocksy_palette_5` | Pale green tint |
| `efn-offwhite` | `#f2f5f7` | `blocksy_palette_6` | Section backgrounds |
| `efn-near-white` | `#fafbfc` | `blocksy_palette_7` | — |
| `efn-white` | `#ffffff` | `blocksy_palette_8` | White text/backgrounds, hero heading color |

**Fonts** (from the `fonts.googleapis.com` request in `<head>`):
- **Figtree**, weight 700 — headings
- **Onest**, weights 300–700 — body text
- **Rock Salt**, weight 400 — decorative script accent (used sparingly, e.g. around "Encore" in "Join the *Encore* Family")

**Buttons** (from `.elementor-button` in the homepage's compiled CSS): transparent background, 2px solid border, **sharp corners** (`border-radius: 0`), `15px 30px` padding, 20px/600-weight label; fills solid on hover with inverted text color. A small number of elements use `border-radius: 20px` (cards) or `100px` (pills) — not buttons generally.

**Layout**: max content width `1300px` (`--container-max-width`), centered.

## Content — sampled verbatim from efn.co.ke on 2026-08-23

- `src/data/schedule.ts` — the exact "Workout Schedule" table from `/fitness-studio/`
- `src/data/membershipPlans.ts` — the exact 6 plans + KES prices from the same page
- `src/data/products.ts` — all 15 products from `/our-products/`, names/prices/images copied from the live WooCommerce catalogue
- Page copy (hero text, About text, feature card copy, contact info) is transcribed verbatim into the corresponding page components — see each file's leading comment for its source section.

See `docs/COMPARISON.md` for the full page-by-page comparison against the live site, including everything that could **not** be verified or replicated exactly and why.

## Architecture carried forward from the Encore proposal

- `supabase/migrations/` — `0001_init.sql` (coaches, class_slots, events, gallery_items, members, bookings, settings, audit_log, contact_messages, membership_signups), `0002_shop_and_portal.sql` (orders, order_items, member/staff self-signup policies), `0003_harden_functions.sql` (pins `search_path` on `SECURITY DEFINER` functions), `0004`/`0005` (real coaches + schedule), `0006_fix_signup_profile_creation.sql` (moves profile-row creation to post-sign-in RPCs — see "Auth signup gotcha" below), `0007_finance_marketing_pricing.sql` (membership_plans, product_price_overrides, discount_codes, campaigns, orders.payment_method), `0008_add_staff_by_email.sql`, `0009_till_number_weekly_pass.sql` (real M-Pesa Till + Weekly Pass, from the physical brochure), `0010_member_roles_and_plan.sql` (`members.role`/`coach_id`/`current_plan_id` — see "Account types" below).
- **Live project:** `encore` (ref `zeurcxetfvvktbfipucs`, `eu-west-1`, free tier). URL/anon key go in `.env` (see `.env.example`) — not committed.
- **WhatsApp booking** — live, wired into the Fitness Studio schedule (`src/pages/FitnessStudio.tsx` + `src/lib/whatsapp.ts` + `src/lib/useSettings.ts`).
- **Admin panel** (`/admin`) — real Supabase Auth, role-gated via `staff_profiles` (owner/staff), one-time self-bootstrap for the first owner (via `claim_first_owner()` RPC, called post-sign-in — not right after signup, see 0006). Dashboard (real revenue/orders/bookings tiles), Schedule Manager (inline coach reassignment), Content Manager (events/coaches), Bookings, Sales, Revenue, Pricing (membership plans + product price overrides — DB-editable, no redeploy), Users (members + staff, loyalty points, add-staff-by-email), Marketing (discount codes + campaigns), Support (contact messages), Audit Log (read view only — no writer trigger yet).
- **Member portal** (`/my-encore`) — real Supabase Auth (email+password; phone is stored as the identity field but isn't the login credential — no SMS provider configured for true phone-OTP). Calendar + book-a-class + Account (`/my-encore/account` — see "Account types" below), enforced unique-per-session at the DB level.
- **Cart/checkout** (`/cart`, `/checkout`) — real, but not WooCommerce: a client-side cart writing to this app's own `orders`/`order_items` tables, no payment gateway wired. Confirmation screen shows the M-Pesa Till number (from `settings`) when the M-Pesa payment method is chosen.

See `docs/COMPARISON.md` for the full list of what's genuinely live vs. still a known gap (audit-log writer, gallery upload UI, payment gateway, no auto-accrued loyalty points).

### Account types — member / coach / staff

Three distinct account boundaries, don't conflate them:

- **Member** (`members` table, `role = 'member'`, default) — regular portal
  account. Signs in at `/my-encore`, sees their booking calendar and (if
  staff have recorded one) their subscription plan on `/my-encore/account`.
- **Coach** (`members` table, `role = 'coach'`, `coach_id` → `coaches.id`) —
  still a portal account, not an admin account. A coach's job (sign in, see
  their own assigned classes) is portal-level, so this is a `role` value on
  `members`, not a row in `staff_profiles`. Set in the admin panel (Users →
  Account Type + Linked Coach dropdowns) — there's no self-service way to
  become a coach.
- **Staff/Owner** (`staff_profiles` table, separate from `members` entirely)
  — admin panel (`/admin`) access. A person can independently also have a
  `members` row (e.g. an owner who also books classes) — the two tables
  aren't mutually exclusive, they're separate privilege boundaries for
  separate apps (`/admin` vs `/my-encore`).

`current_plan_id` on `members` (→ `membership_plans.id`) records which plan
a member is on, set manually by staff in Users — there's no automated
payment link yet, so this reflects what staff collected in person / via
M-Pesa, not a live subscription.

The old `/login` page (a vestigial WooCommerce-replica page with no backing
data model — just "Signed in." and nothing else) is retired; `/login` now
redirects to `/my-encore`, the real portal.

### Auth signup gotcha — don't insert right after `signUp()`

`supabase.auth.signUp()` only grants a session immediately if email
confirmation is off. If it's on (the Supabase default, and this project's
default until manually toggled off in the dashboard), there's no session
until the user confirms + signs in — so `auth.uid()` is null and any RLS
insert policy correctly rejects a write right after signup. Discovered the
hard way (2026-08-24): the original owner-bootstrap and member-signup flows
both inserted immediately post-`signUp()` and silently failed under RLS.

**Pattern used everywhere now**: capture whatever's needed (name, phone) via
`signUp({ options: { data: {...} } })` into `user_metadata`, then create the
profile row via a `SECURITY DEFINER` RPC (`claim_first_owner`,
`ensure_member_profile`) called from `useStaffAuth`/`useMemberAuth`'s
`refresh()` — which runs on every sign-in, so it self-heals regardless of
whether confirmation was on or off at signup time. Follow this pattern for
any new self-service signup flow — don't `.from(table).insert(...)` right
after `signUp()`.

## Deploy — GitHub Pages

`.github/workflows/deploy-pages.yml` builds and deploys on every push to
`main`. Live at `https://twylahmichael.github.io/encore/`.

- `vite.config.ts` sets `base: '/encore/'` only when `GITHUB_PAGES=true` (set
  by the workflow) — local dev and any other host stay at `base: '/'`.
- `src/App.tsx`'s `BrowserRouter` reads `basename` from
  `import.meta.env.BASE_URL` so routes resolve correctly under `/encore/`.
- The workflow copies `dist/index.html` → `dist/404.html` after build — GitHub
  Pages has no server-side rewrite, so a hard refresh on a deep link (e.g.
  `/encore/admin/schedule`) needs `404.html` to serve the same app shell;
  React Router then reads the real URL client-side.
- `.env.production` is committed **intentionally** — it holds the Supabase
  **anon** key only (a public, client-safe credential; RLS is what actually
  gates access, not secrecy of this key). Never commit the `service_role`
  key the same way.

## Standing rule — destructive changes to live data

Never delete or modify a schedule slot (`class_slots`), class, or any record
that could have dependent live data (`bookings`, `orders`/`order_items`,
etc.) without first **checking for and reporting** existing dependent
records — e.g. before deleting a `class_slots` row, query `bookings` for
that `slot_id` and state the count. Confirm with the user before deleting
anything that has dependent data, **even if the change was explicitly
requested** — an explicit instruction to change the parent record is not
itself authorization to silently discard the dependent rows it would take
with it.

(Precedent: before deleting the old Saturday `Yoga/Boxing` slot on
2026-08-24, `bookings` was queried and confirmed empty first — that check
should happen and be reported every time, not only when convenient.)

## Commands

```bash
npm install
cp .env.example .env    # fill in Supabase project URL + anon key
npm run dev
```
