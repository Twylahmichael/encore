-- Real M-Pesa Till number and Weekly membership pass, sourced from the
-- physical Encore Fitness Studio brochure + a WhatsApp confirmation from
-- staff (Madam Mary K Gachambi), 2026-08-24. Both are purely additive —
-- no conflict with anything already in the DB, unlike the weekday
-- schedule from the same brochure (flagged separately, not applied here
-- — see docs/COMPARISON.md).

insert into settings (key, value) values
  ('mpesa.till_number', '9442965')
on conflict (key) do update set value = excluded.value;

insert into membership_plans (id, name, price_kes, sort_order) values
  ('weekly', 'Weekly Pass', 1500, 2)
on conflict (id) do nothing;

-- Nudge Quarterly/Half Year/Annual/Couples sort_order down one to make
-- room for Weekly between Daily and Monthly, matching the brochure's order.
update membership_plans set sort_order = 3 where id = 'monthly';
update membership_plans set sort_order = 4 where id = 'quarterly';
update membership_plans set sort_order = 5 where id = 'half-year';
update membership_plans set sort_order = 6 where id = 'annual';
update membership_plans set sort_order = 7 where id = 'couples-monthly';
