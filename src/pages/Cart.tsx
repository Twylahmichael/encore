// Placeholder — the live site's cart/checkout is WooCommerce and stays
// WooCommerce (see Encore's Phase 1 proposal: "Shop... stays exactly as is,
// no rebuild"). This route exists only so the header's cart icon has
// somewhere to go in the replica; it is not a checkout rebuild.
export function Cart() {
  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6 text-center">
        <h1 className="text-3xl mb-4">Cart</h1>
        <p className="text-efn-black/60">
          Checkout stays on WooCommerce per the Encore proposal — this page is a placeholder only.
        </p>
      </div>
    </section>
  );
}
