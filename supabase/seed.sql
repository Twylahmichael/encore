-- Seed data sampled verbatim from the live site on 2026-08-23.
-- Safe to re-run against a fresh database.

insert into settings (key, value) values
  ('whatsapp.number', '2547XXXXXXXX'),
  ('whatsapp.template', 'Hi Encore, I''d like to book {class} on {day} at {time}'),
  ('stats.classes_weekly', '7'),
  ('stats.years_running', '3+'),
  ('stats.daily_price_kes', '400')
on conflict (key) do nothing;

-- Workout schedule — exact match to efn.co.ke/fitness-studio/ "Stay on Track, Stay Fit".
-- Coach is null throughout: the live site doesn't attribute a coach per session today.
insert into class_slots (day_of_week, start_time, end_time, class_name) values
  (1, '06:00', '07:00', 'Aerobics'),
  (1, '18:00', '19:00', 'Hiit'),
  (2, '06:00', '07:00', 'CrossFit'),
  (2, '18:00', '19:00', 'Katabox'),
  (3, '06:00', '07:00', 'Circuit'),
  (3, '18:00', '19:00', 'Circuit'),
  (4, '06:00', '07:00', 'Aerobics / Vitalis'),
  (4, '18:00', '19:00', 'Steps'),
  (5, '06:00', '07:00', 'Zumba'),
  (5, '18:00', '19:00', 'CrossFit'),
  (6, '09:00', '10:00', 'Bootcamp'),
  (6, '11:00', '16:00', 'Yoga/Boxing')
on conflict do nothing;
