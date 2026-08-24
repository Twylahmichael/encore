import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { products } from '../../data/products';

interface PlanRow {
  id: string;
  name: string;
  price_kes: number;
  active: boolean;
}

// Membership plans: membership_plans is now the DB source of truth (see
// 0007_finance_marketing_pricing.sql) — edits here go live immediately on
// the public Fitness Studio page.
//
// Products: products.ts (name/image/slug) stays the content source — the
// override table here only changes the price shown/charged, so a price
// edit doesn't require touching source code or re-deploying.
export function Pricing() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [editingPlan, setEditingPlan] = useState<Record<string, string>>({});
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [editingProduct, setEditingProduct] = useState<Record<string, string>>({});

  const load = async () => {
    const [{ data: planData }, { data: overrideData }] = await Promise.all([
      supabase.from('membership_plans').select('id, name, price_kes, active').order('sort_order'),
      supabase.from('product_price_overrides').select('product_slug, price_kes'),
    ]);
    setPlans((planData as PlanRow[]) ?? []);
    setOverrides(Object.fromEntries((overrideData ?? []).map((r) => [r.product_slug, Number(r.price_kes)])));
  };

  useEffect(() => { load(); }, []);

  const savePlanPrice = async (id: string) => {
    const value = Number(editingPlan[id]);
    if (Number.isNaN(value) || value < 0) return;
    await supabase.from('membership_plans').update({ price_kes: value }).eq('id', id);
    setEditingPlan((v) => { const next = { ...v }; delete next[id]; return next; });
    await load();
  };

  const saveProductPrice = async (slug: string) => {
    const value = Number(editingProduct[slug]);
    if (Number.isNaN(value) || value < 0) return;
    await supabase.from('product_price_overrides').upsert({ product_slug: slug, price_kes: value });
    setEditingProduct((v) => { const next = { ...v }; delete next[slug]; return next; });
    await load();
  };

  const clearOverride = async (slug: string) => {
    await supabase.from('product_price_overrides').delete().eq('product_slug', slug);
    await load();
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl mb-2">Pricing</h1>
        <p className="text-sm text-efn-black/60">Edit membership and product prices — changes go live immediately, no redeploy.</p>
      </div>

      <section>
        <h2 className="font-semibold mb-4">Membership Plans</h2>
        <table className="w-full max-w-lg text-sm">
          <tbody>
            {plans.map((p) => (
              <tr key={p.id} className="border-b border-efn-gray/10">
                <td className="py-3 pr-4">{p.name}</td>
                <td className="py-3 pr-4 w-40">
                  <div className="flex items-center gap-2">
                    <span className="text-efn-black/50">KES</span>
                    <input
                      type="number"
                      value={editingPlan[p.id] ?? p.price_kes}
                      onChange={(e) => setEditingPlan((v) => ({ ...v, [p.id]: e.target.value }))}
                      className="w-24 border border-efn-gray px-2 py-1"
                    />
                    {editingPlan[p.id] !== undefined && (
                      <button onClick={() => savePlanPrice(p.id)} className="text-efn-green hover:underline text-xs">Save</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="text-left text-efn-black/60 border-b border-efn-gray/30">
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Default Price</th>
                <th className="py-2 pr-4">Price Override</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const hasOverride = p.slug in overrides;
                return (
                  <tr key={p.slug} className="border-b border-efn-gray/10">
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4 text-efn-black/50">KES {p.priceKes.toLocaleString('en-KE')}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-efn-black/50">KES</span>
                        <input
                          type="number"
                          placeholder={String(p.priceKes)}
                          value={editingProduct[p.slug] ?? overrides[p.slug] ?? ''}
                          onChange={(e) => setEditingProduct((v) => ({ ...v, [p.slug]: e.target.value }))}
                          className="w-24 border border-efn-gray px-2 py-1"
                        />
                        {editingProduct[p.slug] !== undefined && (
                          <button onClick={() => saveProductPrice(p.slug)} className="text-efn-green hover:underline text-xs">Save</button>
                        )}
                        {hasOverride && (
                          <button onClick={() => clearOverride(p.slug)} className="text-efn-black/50 hover:text-red-600 text-xs">Reset</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
