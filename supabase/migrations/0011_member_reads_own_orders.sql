-- Lets a signed-in member read their own orders/order_items, matched by
-- email. Checkout doesn't require an account (guest checkout, matching
-- the live site), so this only surfaces orders placed with the same
-- email as the member's portal login — orders placed under a different
-- email at checkout won't show up, same limitation any email-matched
-- "my orders" view has without a hard order->member link at checkout time.
-- Purely additive: adds a new permissive SELECT policy alongside the
-- existing staff "for all" policy — doesn't touch or narrow anything.

create policy "member reads own orders" on orders for select
  using (auth.uid() is not null and customer_email = (auth.jwt() ->> 'email'));

create policy "member reads own order_items" on order_items for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and o.customer_email = (auth.jwt() ->> 'email')
    )
  );
