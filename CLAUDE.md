# Encore

React + Supabase companion system for **[efn.co.ke](https://efn.co.ke)** (Encore Fitness and Nutrition, Nairobi) — a visual replica of the live WordPress/Elementor/Blocksy site, plus the booking/admin architecture from the Encore proposal (dynamic schedule, WhatsApp booking, member accounts).

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

- `supabase/migrations/` — `0001_init.sql` (coaches, class_slots, events, gallery_items, members, bookings, settings, audit_log, contact_messages, membership_signups), `0002_shop_and_portal.sql` (orders, order_items, member/staff self-signup policies), `0003_harden_functions.sql` (pins `search_path` on the two `SECURITY DEFINER` helper functions per Supabase's own security advisor).
- **Live project:** `encore` (ref `zeurcxetfvvktbfipucs`, `eu-west-1`, free tier). URL/anon key go in `.env` (see `.env.example`) — not committed.
- **WhatsApp booking** — live, wired into the Fitness Studio schedule (`src/pages/FitnessStudio.tsx` + `src/lib/whatsapp.ts` + `src/lib/useSettings.ts`).
- **Admin panel** (`/admin`) — real Supabase Auth, role-gated via `staff_profiles` (owner/staff), one-time self-bootstrap for the first owner. Dashboard, Schedule Manager (inline coach reassignment), Content Manager (events/coaches), Bookings View, Audit Log (read view only — no writer trigger yet).
- **Member portal** (`/my-encore`) — real Supabase Auth (email+password; phone is stored as the identity field but isn't the login credential — no SMS provider configured for true phone-OTP). Calendar + book-a-class, enforced unique-per-session at the DB level.
- **Cart/checkout** (`/cart`, `/checkout`) — real, but not WooCommerce: a client-side cart writing to this app's own `orders`/`order_items` tables, no payment gateway wired.

See `docs/COMPARISON.md` for the full list of what's genuinely live vs. still a known gap (audit-log writer, gallery upload UI, payment gateway).

## Commands

```bash
npm install
cp .env.example .env    # fill in Supabase project URL + anon key
npm run dev
```
