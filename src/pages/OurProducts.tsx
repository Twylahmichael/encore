import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { products as allProducts } from '../data/products';

type SortKey = 'default' | 'popularity' | 'rating' | 'latest' | 'price-asc' | 'price-desc';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Default sorting' },
  { value: 'popularity', label: 'Sort by popularity' },
  { value: 'rating', label: 'Sort by average rating' },
  { value: 'latest', label: 'Sort by latest' },
  { value: 'price-asc', label: 'Sort by price: low to high' },
  { value: 'price-desc', label: 'Sort by price: high to low' },
];

export function OurProducts() {
  const [sort, setSort] = useState<SortKey>('default');

  // Popularity / rating / latest have no signal in this static replica —
  // they're wired as no-ops (same order as default) until the real
  // WooCommerce data (sales count, ratings, publish date) is synced in.
  const sorted = [...allProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.priceKes - b.priceKes;
    if (sort === 'price-desc') return b.priceKes - a.priceKes;
    return 0;
  });

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6">
        <h1 className="text-4xl md:text-5xl mb-2">Our Products</h1>
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <p className="text-efn-black/60">Showing all {sorted.length} results</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-efn-gray px-4 py-2"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sorted.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </div>
    </section>
  );
}
