# Live site vs. replica — comparison

Sampled from `https://efn.co.ke` on **2026-08-23** via direct HTTP fetch (page HTML + compiled CSS, not a rendered screenshot — see "What I could not verify" below).

## Brand name — flag

The proposal and earlier scaffold called this "Encore Fitness Studio." The live site's actual `<title>` and `og:site_name` are:

> **Encore Fitness and Nutrition** — "Encore Fitness & Nutrition Nairobi | Supplements & Gym"

It's a combined nutrition-supplements shop *and* fitness studio, not a fitness-only brand. This replica uses the real name throughout. Flagging in case "Encore Fitness Studio" was intentional (e.g. a rebrand in progress) rather than an oversight.

## Pages found live

| Page | URL | Replicated |
|---|---|---|
| Home | `/` | ✅ `src/pages/Home.tsx` |
| Our Products (shop) | `/our-products/` | ✅ `src/pages/OurProducts.tsx` — listing only, not checkout |
| Fitness Studio | `/fitness-studio/` | ✅ `src/pages/FitnessStudio.tsx` |
| Contacts | `/contact-us/` | ✅ `src/pages/Contacts.tsx` |
| My Account (login/register) | `/my-account/` (WooCommerce default) | ✅ `src/pages/Login.tsx` — structure/fields matched, auth wired to Supabase instead of WordPress |
| 15 individual product pages | `/{product-slug}/` | ❌ Not built — out of scope per the task (shop stays as data/listing, not a full WooCommerce clone) |
| Cart / Checkout | `/cart/` | ❌ Placeholder only — per the original Encore proposal, "Shop... stays exactly as is, no rebuild" |
| Privacy Policy | `/privacy-policy/` | ❌ Not built — not requested, flag if needed |

**No "About" page exists separately from the Fitness Studio page's "About Our Fitness Studio" section** — there's no standalone About/Team page on the live site.

## Section-by-section accuracy

### Home
Hero copy, nav labels, "Our Products" carousel (8 specific products, exact order), "Get to Know Encore Fitness Studio" panel, "Why Choose Encore" (4 cards), "Join the Encore Family" CTA, footer — all transcribed verbatim from the fetched HTML.

### Fitness Studio
"About Our Fitness Studio" copy, all 6 membership plans + exact KES prices, the full workout schedule table, "Why Choose Encore," "Join the Encore Family" — verbatim.

**Flag: the workout schedule has no Sunday.** Monday–Saturday only, confirmed from the live table. Noted directly in the replicated page rather than silently filled in.

**Flag: no coach names anywhere on the live site.** The schedule table lists only class names and times — no per-session coach attribution exists today, contrary to what the original Phase 1 proposal describes adding ("Each class card is tappable → opens WhatsApp... Coaches Section — pulled from the same source as the schedule"). That's a planned addition, not a current site feature. The Supabase schema supports it (`class_slots.coach_id`); the seed data leaves it null to match reality.

### Our Products
All 15 products' names, KES prices, and images are pulled directly from the live WooCommerce catalogue (`/our-products/`), including product images downloaded into `src/assets/products/`. Sort dropdown options match exactly; popularity/rating/latest sorts are non-functional placeholders since that data isn't exposed in the static HTML (would need the WooCommerce/WP REST API, which wasn't queried here).

### Contacts
Phone numbers, address, and social links (Facebook, Instagram) are the real ones scraped from the page — not placeholders.

## Design system — sampled, not approximated

Colors and fonts came from the site's actual compiled CSS (`blocksy-global.css`'s `--theme-palette-color-*` variables, and the Google Fonts request in `<head>`), not visual guessing. Full detail in `CLAUDE.md`.

**Flag: the real palette is green-based** (`#7cb041` primary green, `#225625` deep green, off-white/near-white backgrounds), not the teal/magenta/ivory/nude palette the earlier proposal and scaffold specified. That earlier palette appears to have been an aspirational design direction written without reference to the live site's actual theme — this replica replaces it with the sampled reality.

## Discrepancies with the Phase 1 proposal — flagged, not silently resolved

The original Encore proposal describes several planned additions as if refining existing partial features. Checking the live site directly:

- **No TikTok link exists.** Footer/contact only link Facebook + Instagram. The proposal's "socials (IG, TikTok)" line means TikTok is a planned *addition*, not a fix to a broken existing link.
- **No M-Pesa Till number appears anywhere** on Home, Fitness Studio, or Contacts. Also a planned addition.
- **No embedded map** on the Contacts page — just a text address. Planned addition.
- **The global footer is a one-line copyright bar only** ("Copyright © 2026 Encore Fitness and Nutrition | Built by Imarisher") — no sitewide social/contact block. Contact details live exclusively on the Contacts page. This replica matches that reality (`src/components/Footer.tsx`) rather than the proposal's "refreshed footer with socials... Website by Twylah" description, which describes a future state.
- **No coaches, gallery, or events section exist anywhere on the live site today.** These are 100% net-new per the Phase 1 proposal, not present to replicate.

None of these are contradictions in your instructions — they're the proposal correctly describing planned work. Flagging them here so "replicate the live site exactly" and "the proposal's Phase 1 scope" aren't confused with each other going forward.

## What I could not verify

- **No rendered screenshot was taken** — this environment has no headless browser available in this session, so the comparison is from raw HTML/CSS, not a pixel-level visual render. Section *order*, *copy*, *colors*, and *fonts* are exact (sampled from source); exact *spacing/padding* per element is approximated to Tailwind's scale rather than copied Elementor `px` values 1:1.
- Two background images referenced in the Fitness Studio page's compiled CSS (`Encore-gym-2.jpg`, and several `About-Encore-fitness-*.jpg` variants beyond the one used) couldn't be confidently mapped to a specific visible section from CSS class names alone. They're downloaded into `src/assets/site/` but not all are wired into a page yet — ask if you want them placed, and where.
- Mobile-specific layout (hamburger menu behavior, mobile hero sizing) wasn't distinguishable from the fetched desktop HTML/CSS; the replica's responsive behavior is Tailwind's defaults, not confirmed against the live site's actual mobile breakpoint styles.

## Not built in this pass

Per your instruction to keep "the underlying architecture already built... this is a visual replication only" — the WhatsApp booking flow, admin panel UI, and member portal UI described in the Encore proposal are **not implemented in this pass**. What exists now:

- The Supabase schema they need (`supabase/migrations/0001_init.sql`), with RLS already scoped correctly for member/staff/public access
- Two working Supabase-backed forms matching the live site's real forms: Contact (`contact_messages`) and Membership Signup (`membership_signups`)

Say the word if you want the WhatsApp booking + admin panel built out next — that's a separate, larger pass on top of this visual foundation.
