// Sampled verbatim from each product's individual page on efn.co.ke (the
// WooCommerce "short description" and "Description" tab), fetched 2026-08-23.
//
// FLAG: the "Description" tab content reads as unedited AI-generated copy —
// every product follows the identical Dose/Benefits/Usage/Vegan template,
// cites vague/unverifiable sources ("NIH studies", "BMJ Meta-Analysis" with
// no link), and several entries hedge with "Likely..." / "check label"
// rather than stating a fact. The live HTML even leaks a literal
// `class="ds-markdown-paragraph"` — the CSS class an AI chat tool's
// markdown renderer emits — suggesting this was pasted in from an AI
// assistant's output without cleanup or fact-checking. This is genuinely
// what's live, so it's replicated word-for-word below; see
// docs/COMPARISON.md for the full flag.

export interface ProductDescription {
  shortDescriptionHtml: string;
  descriptionHtml?: string;
  stock?: string;
}

export const productDescriptions: Record<string, ProductDescription> = {
  'ashwagandha-ksm-66': {
    shortDescriptionHtml: '<p>A high-potency, clinically studied adaptogen for stress relief and energy.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1200mg per serving (365 tablets).</p><p><strong>Key Ingredient</strong>: KSM-66® (a patented, full-spectrum Ashwagandha extract with 5% withanolides).</p><p><strong>Benefits</strong>:</p><ul><li>Reduces cortisol (stress hormone) by up to 28% (studies in Journal of Evidence-Based Integrative Medicine).</li><li>Enhances stamina, muscle recovery, and mental focus.</li></ul><p><strong>Usage</strong>: 1 tablet daily. Best taken in the morning or before workouts.</p><p><strong>Vegan</strong>: Yes.</p>',
  },
  'maca-root-with-ksm-ashwagandha-ginseng': {
    shortDescriptionHtml: '<p>A synergistic blend for energy, libido, and hormonal balance.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 6000mg Maca Root + Ashwagandha KSM-66 + Ginseng (180 capsules, 90-day supply).</p><p><strong>Benefits</strong>:</p><ul><li>Maca (a Peruvian superfood) boosts endurance and fertility (studies in Andrologia).</li><li>Ginseng enhances cognitive function; Ashwagandha combats fatigue.</li></ul><p><strong>Usage</strong>: 2 capsules daily. Ideal for athletes or those with low energy.</p><p><strong>Vegan</strong>: Yes.</p>',
  },
  'natures-aid-digestive-enzyme-complex': {
    shortDescriptionHtml: '<p>Supports digestion, bloating relief, and nutrient absorption.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Key Enzymes</strong>: Lactase (breaks down lactose), cellulase (fiber digestion), betaine HCl (stomach acid support).</p><p><strong>Benefits</strong>:</p><ul><li>Helps IBS, acid reflux, and food intolerances (NIH studies).</li><li>Betaine HCl aids protein digestion and gut health.</li></ul><p><strong>Usage</strong>: 1-2 tablets with meals.</p>',
  },
  'natures-aid-evening-primrose-oil': {
    shortDescriptionHtml: '<p>Rich in GLA (Omega-6) for hormonal and skin health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 500mg per softgel (33% extra free = 120 softgels).</p><p><strong>Benefits</strong>:</p><ul><li>Eases PMS, menopause symptoms (British Journal of Obstetrics & Gynaecology).</li><li>Improves eczema and hydration.</li></ul><p><strong>Usage</strong>: 1-2 softgels daily.</p><p><strong>Non-GMO</strong>: Likely (cold-pressed extraction).</p>',
  },
  'natures-aid-fish-oil': {
    shortDescriptionHtml: '<p>Supports heart, brain, and vision with EPA/DHA.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1000mg fish oil (330mg Omega-3 per serving).</p><p><strong>Benefits</strong>:</p><ul><li>Reduces triglycerides by 15-30% (American Heart Association).</li><li>DHA critical for brain development.</li></ul><p><strong>Sustainability</strong>: Check for IFOS certification (purity).</p><p><strong>Usage</strong>: 1-2 softgels daily.</p>',
  },
  'novomins-perimenopause-gummies-advanced-formula': {
    shortDescriptionHtml: '<p>Strawberry-flavored, sugar-free gummies formulated with herbs and nutrients to support women through perimenopause.</p>',
    descriptionHtml: '<p>Novomins Perimenopause Gummies are a premium, science-backed nutritional supplement designed to support women experiencing perimenopause. These strawberry-flavored gummies come in an <strong>easy-to-take gummy form</strong>, making daily supplementation enjoyable and convenient.</p><p><strong>Form:</strong></p><ul><li>Gummies (60 strawberry-flavored per bottle)</li><li>Sugar-free, vegan-friendly, gluten-free, cruelty-free</li><li>No artificial colors and non-GMO</li></ul><p><strong>Key Ingredients:</strong></p><ul><li>Red Clover</li><li>Maca Root</li><li>Sage Leaf</li><li>Ashwagandha</li><li>Friendly Bacteria (Probiotics)</li></ul><p><strong>Benefits:</strong></p><ul><li>Supports <strong>psychological and cognitive function</strong></li><li>Promotes <strong>muscle, bone, and gut health</strong></li><li>Aids in <strong>intimate health</strong> during hormonal changes</li><li>Helps manage common perimenopausal symptoms like mood swings, fatigue, and hot flashes</li></ul><p><strong>Usage:</strong><br/>Take the gummies daily as directed on the product label to help maintain balance and wellness during the perimenopausal transition. Always consult a healthcare provider before starting any new supplement, especially if you have underlying conditions or are taking medication.</p>',
  },
  'nutrition-geeks-b12-dual-power': {
    shortDescriptionHtml: '<p>Active B12 forms for energy and nerve health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1000µg per tablet (365 tablets).</p><p><strong>Benefits</strong>:</p><ul><li>Methylcobalamin supports nervous system; adenosylcobalamin aids cellular energy.</li><li>Reduces fatigue in B12-deficient individuals (NIH).</li></ul><p><strong>Vegan</strong>: Yes (common for B12 supplements).</p>',
  },
  'nutrition-geeks-biotin-growth': {
    shortDescriptionHtml: '<p>Nutrition for hair, skin, and nail.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 10,000µg Biotin (180 tablets).</p><p><strong>Synergy</strong>: Zinc boosts keratin production; selenium protects hair follicles.</p><p><strong>Research</strong>: Effective for brittle nails (Journal of Cosmetic Dermatology).</p><p><strong>Usage</strong>: 1 tablet daily.</p>',
  },
  'nutrition-geeks-magnesium-glycinate-3-in-1': {
    shortDescriptionHtml: '<p>Triple-formula for muscles, nerves, and fatigue.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Forms</strong>:</p><ul><li>Glycinate: Relaxes muscles, improves sleep.</li><li>Malate: Fights fatigue.</li><li>Citrate: Aids digestion.</li></ul><p><strong>Research</strong>: Glycinate has 80% bioavailability (Magnesium Research Journal).</p><p><strong>Vegan</strong>: Yes (90 capsules).</p>',
  },
  'nutrition-geeks-vitamin-d3-k2': {
    shortDescriptionHtml: '<p>Immune and bone support.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 4000IU D3 + 100µg K2 (365 tablets).</p><p><strong>Synergy</strong>: K2 directs calcium to bones, preventing arterial calcification (Journal of Nutrition).</p><p><strong>UK-Made</strong>: Ensures quality (strict MHRA standards).</p>',
  },
  'shilajit-with-ashwagandha-lions-mane': {
    shortDescriptionHtml: '<p>Ayurvedic mineral pitch for energy and cognition.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Key Additives</strong>: Lion’s Mane (neurogenesis), Turmeric (anti-inflammatory).</p><p><strong>Research</strong>: Shilajit boosts ATP production (Journal of Ethnopharmacology).</p><p><strong>Usage</strong>: 1 capsule daily (120-day supply).</p>',
  },
  'slippery-elm-bark-powder': {
    shortDescriptionHtml: '<p>A natural digestive aid and throat soother derived from the inner bark of the Slippery Elm tree.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Form</strong>: Fine powder (50g).</p><p><strong>Benefits</strong>:</p><ul><li>Soothes irritated throats and coughs (traditionally used in herbal medicine).</li><li>Supports digestive health by coating the gut lining, easing IBS and acid reflux (Journal of Alternative and Complementary Medicine).</li><li>Rich in mucilage, a soluble fiber that promotes bowel regularity.</li></ul><p><strong>Usage</strong>: Mix 1-2 teaspoons in water or tea. Safe for children (consult a doctor).</p><p><strong>Vegan/Vegetarian</strong>: Yes.</p>',
  },
  'the-pretty-smart-collagen-hydropro': {
    shortDescriptionHtml: '<p>A marine collagen supplement enhanced with superfoods for skin, hair, and joint health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 1400mg hydrolyzed marine collagen per serving (90 capsules).</p><p><strong>Added Ingredients</strong>: Kelp (iodine for thyroid health), blueberry (antioxidants), turmeric (anti-inflammatory).</p><p><strong>Benefits</strong>:</p><ul><li>Hydrolyzed collagen boosts skin elasticity and reduces wrinkles (Journal of Cosmetic Dermatology).</li><li>Supports joint mobility and reduces arthritis pain (NIH studies).</li></ul><p><strong>Usage</strong>: 1-2 capsules daily. Best taken with vitamin C for absorption.</p><p><strong>Vegan</strong>: No (marine collagen is derived from fish).</p>',
  },
  'weightworld-vitamin-d3': {
    shortDescriptionHtml: '<p>High-strength Vitamin D3 for immune and bone health.</p>',
    stock: '50 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: Likely 1000–4000IU (exact strength not listed; check label).</p><p><strong>Benefits</strong>:</p><ul><li>Critical for calcium absorption and bone density (NIH).</li><li>Reduces risk of respiratory infections (BMJ Meta-Analysis).</li></ul><p><strong>Usage</strong>: 1 tablet daily (take with fatty foods for absorption).</p><p><strong>Vegan</strong>: Check label (D3 often comes from lanolin/sheep’s wool).</p>',
  },
  'weightworld-zinc-bisglycinate': {
    shortDescriptionHtml: '<p>Highly absorbable zinc for immunity and skin health.</p>',
    stock: '46 in stock',
    descriptionHtml: '<p><strong>Dose</strong>: 50mg per tablet (400 tablets).</p><p><strong>Form</strong>: Zinc bisglycinate (gentler on stomach than zinc oxide).</p><p><strong>Benefits</strong>:</p><ul><li>Reduces cold duration by 33% (Journal of Family Practice).</li><li>Supports wound healing and acne reduction (Dermatology Research).</li></ul><p><strong>Usage</strong>: 1 tablet daily (avoid exceeding 40mg long-term).</p><p><strong>Vegan</strong>: Likely (bisglycinate is typically vegan).</p>',
  },
};
