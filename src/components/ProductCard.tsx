import type { Product } from '../data/products';

export function ProductCard({ product }: { product: Product }) {
  return (
    <a href={`/product/${product.slug}`} className="group block">
      <div className="aspect-square bg-efn-offwhite overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-base font-medium mb-1 group-hover:text-efn-green transition-colors">
        {product.name}
      </h3>
      <p className="text-efn-green font-semibold">
        KShs {product.priceKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
      </p>
    </a>
  );
}
