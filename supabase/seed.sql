-- Seed data. Settings sampled verbatim from the live site (2026-08-23).
-- Coaches and the weekly schedule reflect the real, current class roster
-- as confirmed by the client (2026-08-24) — NOT what's scraped from the
-- live WordPress site, which has no coach data and an older/stale class
-- list (see docs/COMPARISON.md for the full before/after).
-- Safe to re-run against a fresh database.

insert into settings (key, value) values
  ('whatsapp.number', '2547XXXXXXXX'),
  ('whatsapp.template', 'Hi Encore, I''d like to book {class} on {day} at {time}'),
  ('stats.classes_weekly', '7'),
  ('stats.years_running', '3+'),
  ('stats.daily_price_kes', '400')
on conflict (key) do nothing;

insert into coaches (name, specialty, sort_order) values
  ('Coach Karis', 'Aerobics, Circuit & Yoga', 1),
  ('Coach Ray', 'HIIT & Conditioning', 2),
  ('Coach Ewid', 'CrossFit & Zumba', 3),
  ('Coach Okeke', 'Katabox & CrossFit', 4),
  ('Coach Vitalis', 'Aerobics', 5),
  ('Coach Malik', 'Circuit Training & Bootcamp', 6)
on conflict do nothing;

-- Friday PM (Zumba) and Saturday (Boxing) are intentionally unassigned —
-- staff fill these in weekly via the admin Schedule Manager. The UI shows
-- "Coach TBD" for these, never blank.
insert into class_slots (day_of_week, start_time, end_time, class_name, coach_id) values
  (1, '06:00', '07:00', 'Aerobics',   (select id from coaches where name = 'Coach Karis')),
  (1, '18:00', '19:00', 'Toning',     (select id from coaches where name = 'Coach Ewid')),
  (2, '06:00', '07:00', 'CrossFit',   (select id from coaches where name = 'Coach Ray')),
  (2, '18:00', '19:00', 'Taecombat',  (select id from coaches where name = 'Coach Okeke')),
  (3, '06:00', '07:00', 'CrossFit',   (select id from coaches where name = 'Coach Ray')),
  (3, '18:00', '19:00', 'CrossFit',   (select id from coaches where name = 'Coach Vitalis')),
  (4, '06:00', '07:00', 'Aerosteps',  (select id from coaches where name = 'Coach Vitalis')),
  (4, '18:00', '19:00', 'CrossFit',   (select id from coaches where name = 'Coach Ray')),
  (5, '06:00', '07:00', 'Steps',      (select id from coaches where name = 'Coach Malik')),
  (5, '18:00', '19:00', 'Zumba',      null),
  (6, '09:00', '10:00', 'Boxing',     null)
on conflict do nothing;
