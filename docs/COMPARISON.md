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

## Second pass — everything previously deferred, now built

At your explicit request ("build everything even the ones I told you not to"), the pieces this document originally listed as out of scope are now implemented against a **live Supabase project** (`encore`, ref `zeurcxetfvvktbfipucs`, free tier — $0/month, created with your confirmation):

- **15 individual product pages** (`/product/:slug`) — real short description, real "Description" tab content, and real stock counts scraped from each live product page. **Flag:** that Description content reads as unedited AI-generated copy (uniform Dose/Benefits/Usage/Vegan template across unrelated products, vague uncited sources, hedged claims like "Likely 1000–4000IU... check label," and a literal leaked `class="ds-markdown-paragraph"` — the CSS class an AI chat tool's markdown renderer emits). Replicated word-for-word anyway since that's genuinely what's live; see `src/data/productDescriptions.ts`.
- **Real cart + checkout** — client-side cart (`src/lib/cartStore.tsx`, localStorage-persisted) and a checkout form that writes to real `orders`/`order_items` tables. This is **not** a WooCommerce clone — no payment gateway is wired, it records `pending_payment` and shows a manual-confirmation message, matching how a small Kenyan shop actually collects payment (M-Pesa, confirmed by phone/WhatsApp). The live site's real checkout is still WooCommerce and this doesn't touch it.
- **Privacy Policy page**, reproduced verbatim. **Flag:** the live page is the unedited WordPress default template — every section still literally says "Suggested text:" — meaning nobody has written Encore's actual policy yet. Replicated exactly as published, with a note calling this out on the page itself.
- **WhatsApp booking**, wired into the Fitness Studio schedule: each session is now a tappable card that opens `wa.me` pre-filled with the class/day/time, pulling the number/message template from the live `settings` table (editable from the admin panel, not a code change).
- **Admin panel** (`/admin`) — real Supabase Auth, not a mock. First person to use "First-time setup" becomes owner (one-time bootstrap, enforced by an RLS policy that only allows it while `staff_profiles` is empty); every account after that must be added by an owner. Dashboard (bookings today/this week, coach-missing flag, pending orders), Schedule Manager (inline coach reassignment — the hot path), Content Manager (events + coaches CRUD), Bookings View, Audit Log (owner-only).
- **Member portal** (`/my-encore`) — real signup/login, "My Calendar" (upcoming + history, cancel), "Book a Class" (books the next occurrence of a weekly slot, enforced unique-per-session at the DB level). Auth is email+password via Supabase Auth rather than true phone-OTP, since phone auth needs an SMS provider (Twilio etc.) that isn't configured — phone number is still the primary identity field used for WhatsApp/display, just not the login credential.

**Known gaps in this pass, flagged rather than silently skipped:**
- **Audit log has no writer yet.** The `audit_log` table and owner-only read view exist, but no trigger fires on schedule/content mutations — the Schedule Manager and Content Manager don't currently write audit rows. The correct fix is a Postgres trigger (so it can't be bypassed by a direct API call), not app-level logging; not implemented in this pass.
- **Gallery has no upload UI.** `gallery_items` exists and the public gallery-read policy is in place, but file upload needs Supabase Storage wiring, which isn't set up. Manageable directly via the Supabase dashboard until then.
- **No payment gateway.** Checkout records intent only; nothing charges a card or triggers an M-Pesa STK push.

Full schema: `supabase/migrations/0001_init.sql` → `0003_harden_functions.sql`. `0004` in the live project is the same `0003_harden_functions.sql` content, applied separately after `0003_seed` (seed data) — the live project's applied-migration numbering and this repo's file numbering diverge by one because seeding was applied as its own migration rather than via `supabase/seed.sql`; harmless, but noted so the numbers aren't confusing later.

## Third pass — resolutions

Per your review of the flags above, here's what was resolved. The original flags stay above, unedited, as the record of what was actually found — this section documents what changed and why.

1. **Brand name** — held, per your instruction. No title/metadata change made. Still an open question for the client.
2. **Product descriptions rewritten.** All 15 "Description" tabs (`src/data/productDescriptions.ts`) — every real fact (dose, ingredient composition, pack size/duration, usage instructions) kept; fabricated citation attributions, invented statistics, and hedge language ("Likely...", "check label" as a stand-in for a real claim) removed or replaced with an honest disclosure where the original genuinely didn't know something (e.g. WeightWorld Vitamin D3's unlisted IU strength — now stated as "not listed" rather than guessed at). No new claims were added beyond what the originals stated or what follows directly from stated facts.
3. **Privacy Policy rewritten.** `src/pages/PrivacyPolicy.tsx` — replaced the WordPress boilerplate entirely with an Encore-specific policy covering: what's collected (contact form, membership signups, orders, member accounts, WhatsApp bookings), how phone numbers are used, how M-Pesa payment is actually handled today (manual confirmation — no automated processing, no PIN storage), data retention, who can see it (Encore staff, Supabase as infrastructure), and standard access/correction/deletion rights. Flagged in its own code comment that this isn't a substitute for legal review.
4. **Coaches seeded and wired.** 6 real coaches inserted into the live Supabase project: Coach Karis, Coach Ray, Coach Ewid, Coach Okeke, Coach Vitalis, Coach Malik (`supabase/migrations/0004_seed_coaches.sql`). Assigned across all 12 schedule slots — **one pairing is not a guess**: "Aerobics / Vitalis" (Thursday 6am) is assigned to Coach Vitalis because the live site's own class name already references that name. The other 11 pairings are my own round-robin distribution, since no specific mapping was provided; every one is instantly correctable via the admin Schedule Manager without a code change. The public Fitness Studio page's schedule display was also switched from the static `src/data/schedule.ts` file to a live Supabase read (`src/lib/useLiveSchedule.ts`, falling back to the static file if the fetch fails) — otherwise the newly-seeded coach names would only have shown up in the admin panel and member portal, not on the public page, which would have defeated the point of "no developer, no redeploy" schedule changes.
5. **Everything else in "functional gaps" / "things guessed"** — left as-is, per your instruction.
6. **Background images placed.** `Encore-gym-2.jpg`, `About-Encore-fitness-2.jpg`, and `About-Encore-fitness-5.jpg` are now a 3-image photo strip on the Fitness Studio page, between the hero and Membership Plans. The remaining unused variants (`About-Encore-fitness-1.jpg`, `-3.jpg`, `-6.jpg`, and `Encore-gym-3.jpg`, which had been dropped in the first pass already) were deleted from `src/assets/site/` rather than left orphaned, since there wasn't a second clear spot for them without inventing a gallery section the live site doesn't have.
