-- Real coach names provided by the client (not scraped — the live site has
-- no coach data at all). Assignment to specific classes is my own
-- distribution, EXCEPT "Aerobics / Vitalis", whose class name already
-- references Coach Vitalis directly on the live site, so that pairing is
-- not a guess. Every pairing is instantly correctable via the admin
-- Schedule Manager (inline coach reassignment) without touching code.
--
-- This file documents what was applied directly to the live project via
-- individual UPDATE statements keyed on that project's actual row IDs
-- (see the session record) — reproduced here in a portable form keyed on
-- (day_of_week, start_time, class_name) so it can be re-run against a
-- fresh database from just the 0001–0003 migrations + seed data.

insert into coaches (name, specialty, sort_order) values
  ('Coach Karis', 'Aerobics, Circuit & Yoga', 1),
  ('Coach Ray', 'HIIT & Conditioning', 2),
  ('Coach Ewid', 'CrossFit & Zumba', 3),
  ('Coach Okeke', 'Katabox & CrossFit', 4),
  ('Coach Vitalis', 'Aerobics', 5),
  ('Coach Malik', 'Circuit Training & Bootcamp', 6)
on conflict do nothing;

update class_slots set coach_id = (select id from coaches where name = 'Coach Karis')
  where (day_of_week, start_time, class_name) in ((1,'06:00','Aerobics'), (3,'18:00','Circuit'), (6,'11:00','Yoga/Boxing'));

update class_slots set coach_id = (select id from coaches where name = 'Coach Ray')
  where (day_of_week, start_time, class_name) in ((1,'18:00','Hiit'), (4,'18:00','Steps'));

update class_slots set coach_id = (select id from coaches where name = 'Coach Ewid')
  where (day_of_week, start_time, class_name) in ((2,'06:00','CrossFit'), (5,'06:00','Zumba'));

update class_slots set coach_id = (select id from coaches where name = 'Coach Okeke')
  where (day_of_week, start_time, class_name) in ((2,'18:00','Katabox'), (5,'18:00','CrossFit'));

update class_slots set coach_id = (select id from coaches where name = 'Coach Vitalis')
  where (day_of_week, start_time, class_name) = (4,'06:00','Aerobics / Vitalis');

update class_slots set coach_id = (select id from coaches where name = 'Coach Malik')
  where (day_of_week, start_time, class_name) in ((3,'06:00','Circuit'), (6,'09:00','Bootcamp'));
