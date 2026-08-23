// Sampled verbatim (names, prices, slugs) from https://efn.co.ke/our-products/
// on 2026-08-23 — "Showing all 15 results". Images copied from the live
// WooCommerce media library into src/assets/products/.
//
// Note: these are read-only display data for the replica. The live site's
// actual checkout, stock, and variant data live in WooCommerce — this file
// is not a substitute for a real product sync.

export interface Product {
  slug: string;
  name: string;
  priceKes: number;
  image: string;
}

import ashwagandha from '../assets/products/Ashwagandha-KSM-66-1000x1000.jpg';
import macaRoot from '../assets/products/Maca-Root-1000x1000.jpg';
import digestiveEnzyme from '../assets/products/Natures-Aid-Digestive-Enzyme-Complex-1000x1000.jpg';
import eveningPrimrose from '../assets/products/Natures-Aid-Evening-Primrose-Oil-1000x1000.jpg';
import fishOil from '../assets/products/Natures-Aid-Fish-Oil-1000x1000.jpg';
import novomins from '../assets/products/Novomins-Perimenopause-Gummies-1000x1000.jpg';
import b12 from '../assets/products/Nutrition-Geeks-B12-Dual-Power-1000x1000.jpg';
import biotin from '../assets/products/Nutrition-Geeks-Biotin-Growth-1000x1000.jpg';
import magnesium from '../assets/products/Nutrition-Geeks-Glycinate-3-in-1-1000x1000.jpg';
import vitaminD3K2 from '../assets/products/Nutrition-Geeks-Vitamin-D3-K2-1000x1000.jpg';
import shilajit from '../assets/products/Shilajit-1000x1000.jpg';
import slipperyElm from '../assets/products/Slippery-ELM-Bark-Powder-1000x1000.jpg';
import collagen from '../assets/products/The-Pretty-Smart-Collagen-Hydropro-1000x1000.jpg';
import vitaminD3 from '../assets/products/WeightWorld-Vitamin-D3-1000x1000.jpg';
import zinc from '../assets/products/WeightWorld-Zinc-Bisglycinate-1000x1000.jpg';

export const products: Product[] = [
  { slug: 'ashwagandha-ksm-66', name: 'Ashwagandha KSM-66', priceKes: 5790, image: ashwagandha },
  { slug: 'novomins-perimenopause-gummies-advanced-formula', name: 'Novomins Perimenopause Gummies', priceKes: 6100, image: novomins },
  { slug: 'maca-root-with-ksm-ashwagandha-ginseng', name: 'Maca Root with KSM Ashwagandha & Ginseng', priceKes: 5790, image: macaRoot },
  { slug: 'natures-aid-digestive-enzyme-complex', name: 'Natures Aid Digestive Enzyme Complex', priceKes: 4470, image: digestiveEnzyme },
  { slug: 'natures-aid-evening-primrose-oil', name: 'Natures Aid Evening Primrose Oil', priceKes: 3808, image: eveningPrimrose },
  { slug: 'natures-aid-fish-oil', name: 'Natures Aid Fish Oil', priceKes: 3650, image: fishOil },
  { slug: 'nutrition-geeks-b12-dual-power', name: 'Nutrition Geeks B12 Dual Power', priceKes: 3598, image: b12 },
  { slug: 'nutrition-geeks-biotin-growth', name: 'Nutrition Geeks Biotin Growth+', priceKes: 4132, image: biotin },
  { slug: 'nutrition-geeks-magnesium-glycinate-3-in-1', name: 'Nutrition Geeks Magnesium Glycinate 3-in-1', priceKes: 4900, image: magnesium },
  { slug: 'nutrition-geeks-vitamin-d3-k2', name: 'Nutrition Geeks Vitamin D3 + K2', priceKes: 4470, image: vitaminD3K2 },
  { slug: 'shilajit-with-ashwagandha-lions-mane', name: 'Shilajit with Ashwagandha & Lion’s Mane', priceKes: 4800, image: shilajit },
  { slug: 'slippery-elm-bark-powder', name: 'Slippery Elm Bark Powder', priceKes: 4470, image: slipperyElm },
  { slug: 'the-pretty-smart-collagen-hydropro', name: 'The Pretty Smart Collagen Hydropro+', priceKes: 7120, image: collagen },
  { slug: 'weightworld-vitamin-d3', name: 'WeightWorld Vitamin D3', priceKes: 4470, image: vitaminD3 },
  { slug: 'weightworld-zinc-bisglycinate', name: 'WeightWorld Zinc Bisglycinate', priceKes: 4800, image: zinc },
];

// The homepage "Our Products" carousel shows this specific subset of 8,
// in this order — sampled from https://efn.co.ke/ directly (not just "first 8").
export const homepageFeaturedSlugs = [
  'novomins-perimenopause-gummies-advanced-formula',
  'weightworld-zinc-bisglycinate',
  'weightworld-vitamin-d3',
  'the-pretty-smart-collagen-hydropro',
  'slippery-elm-bark-powder',
  'shilajit-with-ashwagandha-lions-mane',
  'nutrition-geeks-vitamin-d3-k2',
  'nutrition-geeks-magnesium-glycinate-3-in-1',
];
