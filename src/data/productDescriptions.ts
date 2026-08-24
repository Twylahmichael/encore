// Rewritten 2026-08-23 from the live site's original "Description" tab
// content (fetched from each product's individual page on efn.co.ke).
//
// The originals read as unedited AI-generated copy — every product followed
// an identical Dose/Benefits/Usage/Vegan template, attributed specific
// statistics to vague/uncited sources ("reduces cortisol by up to 28%,
// Journal of Evidence-Based Integrative Medicine" with no link), and several
// entries hedged with "Likely..." / "check label" rather than stating a
// fact. The live HTML also leaked a literal `class="ds-markdown-paragraph"`
// — the CSS class an AI chat tool's markdown renderer emits — indicating
// this was pasted in from an AI assistant's output without cleanup or
// fact-checking.
//
// This version keeps every real fact from the originals (dose, form,
// ingredient composition, pack size/duration, usage instructions) and
// rewrites the presentation: no fabricated citation attributions, no
// specific statistics that couldn't be verified, and hedge language either
// removed (if the underlying claim wasn't actually confirmed) or replaced
// with an honest disclosure instead of a fake-sounding guess. No new
// factual claims were added beyond what the originals stated or what
// follows directly from stated facts (e.g. "365 tablets" implying a
// roughly one-year supply at one per day).
//
// See docs/COMPARISON.md for the before/after context.

export interface ProductDescription {
  shortDescriptionHtml: string;
  descriptionHtml?: string;
  stock?: string;
}

export const productDescriptions: Record<string, ProductDescription> = {
  'ashwagandha-ksm-66': {
    shortDescriptionHtml: '<p>A high-potency, clinically studied adaptogen for stress relief and energy.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1200mg per serving (365 tablets).</p><p><strong>Key Ingredient</strong>: KSM-66®, a patented full-spectrum ashwagandha root extract standardized to 5% withanolides.</p><p><strong>Benefits</strong>: Ashwagandha is traditionally used to help the body manage stress, and may support energy, stamina, and mental focus.</p><p><strong>Usage</strong>: Take 1 tablet daily, ideally in the morning or before workouts.</p><p><strong>Vegan</strong>: Yes.</p>',
  },
  'maca-root-with-ksm-ashwagandha-ginseng': {
    shortDescriptionHtml: '<p>A synergistic blend for energy, libido, and hormonal balance.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 6000mg combined Maca Root, Ashwagandha KSM-66, and Ginseng per serving (180 capsules, a 90-day supply).</p><p><strong>Benefits</strong>: Maca root is a Peruvian staple traditionally used to support energy and libido; ginseng is commonly used for mental clarity, and ashwagandha for fatigue and stress resilience.</p><p><strong>Usage</strong>: Take 2 capsules daily. Well suited to athletes or anyone managing low energy.</p><p><strong>Vegan</strong>: Yes.</p>',
  },
  'natures-aid-digestive-enzyme-complex': {
    shortDescriptionHtml: '<p>Supports digestion, bloating relief, and nutrient absorption.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Key Enzymes</strong>: Lactase (breaks down lactose), cellulase (aids fiber digestion), and betaine HCl (supports stomach acid levels).</p><p><strong>Benefits</strong>: A broad-spectrum enzyme blend intended to ease bloating and support the digestion of dairy, fiber, and protein.</p><p><strong>Usage</strong>: Take 1–2 tablets with meals.</p>',
  },
  'natures-aid-evening-primrose-oil': {
    shortDescriptionHtml: '<p>Rich in GLA (Omega-6) for hormonal and skin health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 500mg per softgel — 120 softgels per pack (33% extra free).</p><p><strong>Benefits</strong>: Evening primrose oil is a source of gamma-linolenic acid (GLA), commonly used to help ease PMS and menopause symptoms and to support skin hydration.</p><p><strong>Usage</strong>: Take 1–2 softgels daily.</p>',
  },
  'natures-aid-fish-oil': {
    shortDescriptionHtml: '<p>Supports heart, brain, and vision with EPA/DHA.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1000mg fish oil per softgel, providing 330mg of Omega-3 (EPA/DHA) per serving.</p><p><strong>Benefits</strong>: Omega-3 fatty acids support cardiovascular health and are important for brain and eye function.</p><p><strong>Usage</strong>: Take 1–2 softgels daily.</p>',
  },
  'novomins-perimenopause-gummies-advanced-formula': {
    shortDescriptionHtml: '<p>Strawberry-flavored, sugar-free gummies formulated with herbs and nutrients to support women through perimenopause.</p>',
    descriptionHtml: '<p>Novomins Perimenopause Gummies are a nutritional supplement designed to support women experiencing perimenopause, in an easy-to-take strawberry-flavored gummy form.</p><p><strong>Form:</strong></p><ul><li>Gummies (60 strawberry-flavored per bottle)</li><li>Sugar-free, vegan-friendly, gluten-free, cruelty-free</li><li>No artificial colors and non-GMO</li></ul><p><strong>Key Ingredients:</strong></p><ul><li>Red Clover</li><li>Maca Root</li><li>Sage Leaf</li><li>Ashwagandha</li><li>Friendly Bacteria (Probiotics)</li></ul><p><strong>Benefits:</strong></p><ul><li>Supports psychological and cognitive function</li><li>Promotes muscle, bone, and gut health</li><li>Aids intimate health during hormonal changes</li><li>Helps manage common perimenopausal symptoms like mood swings, fatigue, and hot flashes</li></ul><p><strong>Usage:</strong> Take the gummies daily as directed on the product label. As with any new supplement, consult a healthcare provider first if you have an underlying condition or take medication.</p>',
  },
  'nutrition-geeks-b12-dual-power': {
    shortDescriptionHtml: '<p>Active B12 forms for energy and nerve health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1000µg per tablet (365 tablets — roughly a one-year supply at one per day).</p><p><strong>Benefits</strong>: Combines methylcobalamin, which supports nervous system function, with adenosylcobalamin, which supports cellular energy production — useful for anyone managing fatigue linked to low B12.</p>',
  },
  'nutrition-geeks-biotin-growth': {
    shortDescriptionHtml: '<p>Nutrition for hair, skin, and nails.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 10,000µg biotin per tablet (180 tablets).</p><p><strong>Formula</strong>: Also includes zinc, which supports keratin production, and selenium, which supports healthy hair follicles.</p><p><strong>Usage</strong>: Take 1 tablet daily.</p>',
  },
  'nutrition-geeks-magnesium-glycinate-3-in-1': {
    shortDescriptionHtml: '<p>Triple-formula for muscles, nerves, and fatigue.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Forms</strong>: Combines magnesium glycinate (supports muscle relaxation and sleep), magnesium malate (supports energy and reduces fatigue), and magnesium citrate (supports digestion) in one formula.</p><p><strong>Pack</strong>: 90 capsules.</p><p><strong>Vegan</strong>: Yes.</p>',
  },
  'nutrition-geeks-vitamin-d3-k2': {
    shortDescriptionHtml: '<p>Immune and bone support.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 4000IU vitamin D3 plus 100µg vitamin K2 per tablet (365 tablets — roughly a one-year supply at one per day).</p><p><strong>Why D3 + K2</strong>: Vitamin K2 works alongside D3 to help direct calcium to the bones.</p><p>Made in the UK.</p>',
  },
  'shilajit-with-ashwagandha-lions-mane': {
    shortDescriptionHtml: '<p>Ayurvedic mineral pitch for energy and cognition.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Key Additives</strong>: Lion’s Mane, traditionally used to support cognitive function, and turmeric, valued for its anti-inflammatory properties.</p><p><strong>Usage</strong>: Take 1 capsule daily (120-day supply).</p>',
  },
  'slippery-elm-bark-powder': {
    shortDescriptionHtml: '<p>A natural digestive aid and throat soother derived from the inner bark of the Slippery Elm tree.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Form</strong>: Fine powder (50g).</p><p><strong>Benefits</strong>: Traditionally used to soothe irritated throats and support digestive comfort. Rich in mucilage, a soluble fiber that coats the gut lining and promotes regularity.</p><p><strong>Usage</strong>: Mix 1–2 teaspoons in water or tea. Generally considered safe for children — consult a doctor first.</p><p><strong>Vegan/Vegetarian</strong>: Yes.</p>',
  },
  'the-pretty-smart-collagen-hydropro': {
    shortDescriptionHtml: '<p>A marine collagen supplement enhanced with superfoods for skin, hair, and joint health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1400mg hydrolyzed marine collagen per serving (90 capsules).</p><p><strong>Added Ingredients</strong>: Kelp (a source of iodine), blueberry (antioxidants), and turmeric.</p><p><strong>Benefits</strong>: Hydrolyzed collagen is commonly used to support skin elasticity and joint comfort.</p><p><strong>Usage</strong>: Take 1–2 capsules daily. Best taken alongside a source of vitamin C to support absorption.</p><p><strong>Vegan</strong>: No — this collagen is derived from marine sources (fish).</p>',
  },
  'weightworld-vitamin-d3': {
    shortDescriptionHtml: '<p>High-strength Vitamin D3 for immune and bone health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Note</strong>: exact IU strength isn’t listed on the product page — check the packaging for the precise dose.</p><p><strong>Benefits</strong>: Vitamin D3 supports calcium absorption, bone density, and normal immune function.</p><p><strong>Usage</strong>: Take 1 tablet daily, ideally with a meal containing fat to support absorption.</p><p><strong>Vegan</strong>: Vitamin D3 is often derived from lanolin (sheep’s wool) unless otherwise stated as vegan — check the label if that matters to you.</p>',
  },
  'weightworld-zinc-bisglycinate': {
    shortDescriptionHtml: '<p>Highly absorbable zinc for immunity and skin health.</p>',
    stock: '46 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 50mg zinc bisglycinate per tablet (400 tablets).</p><p><strong>Form</strong>: Zinc bisglycinate is a chelated form of zinc that’s generally gentler on the stomach than zinc oxide.</p><p><strong>Benefits</strong>: Zinc supports immune function, wound healing, and skin health.</p><p><strong>Usage</strong>: Take 1 tablet daily. Avoid exceeding 40mg of zinc per day long-term without medical advice.</p><p><strong>Vegan</strong>: Zinc bisglycinate is typically vegan-friendly — check the label to confirm for this specific product.</p>',
  },
};
