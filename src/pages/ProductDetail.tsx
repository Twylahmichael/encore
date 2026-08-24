import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../data/products';
import { productDescriptions } from '../data/productDescriptions';
import { useCart } from '../lib/cartStore';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const details = slug ? productDescriptions[slug] : undefined;
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) return <Navigate to="/our-products" replace />;

  const handleAdd = () => {
    add(product.slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6">
        <nav className="text-sm text-efn-black/60 mb-8">
          <Link to="/our-products" className="hover:text-efn-green">Our Products</Link> / {product.name}
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-efn-offwhite">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl mb-4">{product.name}</h1>
            {details?.shortDescriptionHtml && (
              <div
                className="text-efn-black/70 mb-4"
                dangerouslySetInnerHTML={{ __html: details.shortDescriptionHtml }}
              />
            )}
            <p className="text-2xl text-efn-green font-semibold mb-2">
              KShs {product.priceKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
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
              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <div
                  className="prose-sm text-efn-black/80 space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: details.descriptionHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
