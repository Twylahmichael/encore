import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products, type Product } from '../data/products';

// Client-side cart, persisted to localStorage. There is no live WooCommerce
// cart API to call from here, so this is a real, working cart against this
// app's own Supabase `orders` table at checkout — not a WooCommerce clone.

export interface CartLine {
  slug: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  itemCount: number;
  subtotalKes: number;
}

const STORAGE_KEY = 'encore_cart_v1';
const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStorage());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // best-effort — ignore storage failures (private browsing, quota, etc.)
    }
  }, [lines]);

  const add: CartContextValue['add'] = (slug, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { slug, quantity }];
    });
  };

  const setQuantity: CartContextValue['setQuantity'] = (slug, quantity) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.slug !== slug);
      return prev.map((l) => (l.slug === slug ? { ...l, quantity } : l));
    });
  };

  const remove: CartContextValue['remove'] = (slug) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  };

  const clear = () => setLines([]);

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotalKes = lines.reduce((sum, l) => {
    const product = products.find((p) => p.slug === l.slug);
    return sum + (product?.priceKes ?? 0) * l.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ lines, add, setQuantity, remove, clear, itemCount, subtotalKes }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function cartLineProducts(lines: CartLine[]): Array<{ product: Product; quantity: number }> {
  return lines
    .map((l) => ({ product: products.find((p) => p.slug === l.slug), quantity: l.quantity }))
    .filter((l): l is { product: Product; quantity: number } => Boolean(l.product));
}
