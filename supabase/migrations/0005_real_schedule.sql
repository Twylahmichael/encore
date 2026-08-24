-- Replaces the round-robin placeholder schedule (0004_seed_coaches.sql)
-- with the actual schedule confirmed by the client. Class names AND coach
-- assignments both change here — this is the real current class roster,
-- not just a coach reassignment over the names scraped from the live
-- WordPress site's (older/stale) schedule table. See docs/COMPARISON.md.
--
-- Friday PM (Zumba) and Saturday (Boxing) are intentionally left
-- unassigned (coach_id null) per the client — staff fill these in weekly
-- via the admin Schedule Manager. The UI renders null coaches as
-- "Coach TBD", never blank.
--
-- Saturday's second historical slot (11:00–16:00 "Yoga/Boxing") is removed
-- — the client confirmed a single Saturday session ("Boxing", 9:00–10:00)
-- replaces it.

update class_slots set class_name = 'Aerobics', coach_id = (select id from coaches where name = 'Coach Karis')
  where day_of_week = 1 and start_time = '06:00';
update class_slots set class_name = 'Toning', coach_id = (select id from coaches where name = 'Coach Ewid')
  where day_of_week = 1 and start_time = '18:00';

update class_slots set class_name = 'CrossFit', coach_id = (select id from coaches where name = 'Coach Ray')
  where day_of_week = 2 and start_time = '06:00';
update class_slots set class_name = 'Taecombat', coach_id = (select id from coaches where name = 'Coach Okeke')
  where day_of_week = 2 and start_time = '18:00';

update class_slots set class_name = 'CrossFit', coach_id = (select id from coaches where name = 'Coach Ray')
  where day_of_week = 3 and start_time = '06:00';
update class_slots set class_name = 'CrossFit', coach_id = (select id from coaches where name = 'Coach Vitalis')
  where day_of_week = 3 and start_time = '18:00';

update class_slots set class_name = 'Aerosteps', coach_id = (select id from coaches where name = 'Coach Vitalis')
  where day_of_week = 4 and start_time = '06:00';
update class_slots set class_name = 'CrossFit', coach_id = (select id from coaches where name = 'Coach Ray')
  where day_of_week = 4 and start_time = '18:00';

update class_slots set class_name = 'Steps', coach_id = (select id from coaches where name = 'Coach Malik')
  where day_of_week = 5 and start_time = '06:00';
update class_slots set class_name = 'Zumba', coach_id = null
  where day_of_week = 5 and start_time = '18:00';

update class_slots set class_name = 'Boxing', coach_id = null, end_time = '10:00'
  where day_of_week = 6 and start_time = '09:00';

delete from class_slots where day_of_week = 6 and start_time = '11:00';
