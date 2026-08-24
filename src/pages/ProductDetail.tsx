import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../data/products';
import { productDescriptions } from '../data/productDescriptions';
import { useCart } from '../lib/cartStore';
import { ZoomableImage } from '../components/ZoomableImage';
import { AccordionSection } from '../components/AccordionSection';
import { ProductCard } from '../components/ProductCard';

// "Related products" — the live site's WooCommerce grid pulls from the
// same category; there's no category data in this app's flat product
// list, so this takes the next 4 products after the current one (wrapping
// around) — deterministic and different per product, without inventing
// a categorization scheme that doesn't exist in the sampled data.
function getRelatedProducts(currentSlug: string, count = 4) {
  const idx = products.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return products.slice(0, count);
  return [...products.slice(idx + 1), ...products.slice(0, idx)].slice(0, count);
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const details = slug ? productDescriptions[slug] : undefined;
  const { add, priceFor } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) return <Navigate to="/our-products" replace />;

  const handleAdd = () => {
    add(product.slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = getRelatedProducts(product.slug);

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6">
        <nav className="text-sm text-efn-black/60 mb-8">
          <Link to="/our-products" className="hover:text-efn-green">Our Products</Link> / {product.name}
        </nav>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <ZoomableImage src={product.image} alt={product.name} />

          <div>
            <h1 className="text-3xl md:text-4xl mb-4">{product.name}</h1>
            {details?.shortDescriptionHtml && (
              <div
                className="text-efn-black/70 mb-4"
                dangerouslySetInnerHTML={{ __html: details.shortDescriptionHtml }}
              />
            )}
            <p className="text-2xl text-efn-green font-semibold mb-2">
              KShs {priceFor(product).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </p>
            {details?.stock && <p className="text-sm text-efn-black/60 mb-6">{details.stock}</p>}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-efn-gray">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-efn-offwhite"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2 hover:bg-efn-offwhite"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button onClick={handleAdd} className="btn-solid">
                {added ? 'Added ✓' : 'Add to cart'}
              </button>
            </div>

            {details?.descriptionHtml && (
              <AccordionSection title="Description" defaultOpen>
                <div
                  className="prose-sm text-efn-black/80 space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: details.descriptionHtml }}
                />
              </AccordionSection>
            )}

            {/* Honest empty state — there's no review system wired up yet,
                so this doesn't fabricate reviews or a rating widget. */}
            <AccordionSection title="Reviews (0)">
              <p className="text-sm text-efn-black/60">No reviews yet.</p>
            </AccordionSection>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl mb-6">Related products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {related.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
