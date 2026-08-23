/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Sampled directly from efn.co.ke's live Blocksy theme palette
      // (--theme-palette-color-1 … 8) — see CLAUDE.md "Design system".
      colors: {
        'efn-green': '#7cb041',       // palette-1 — primary brand green (buttons, accents)
        'efn-black': '#000000',       // palette-2 — body text, dark sections
        'efn-green-deep': '#225625',  // palette-3 — dark green (hover, deep accents)
        'efn-gray': '#b6b6b6',        // palette-4 — muted text, borders
        'efn-mint': '#f2ffe3',        // palette-5 — pale green tint
        'efn-offwhite': '#f2f5f7',    // palette-6 — section backgrounds
        'efn-near-white': '#fafbfc',  // palette-7
        'efn-white': '#ffffff',       // palette-8
      },
      fontFamily: {
        // Figtree 700 = headings, Onest = body, Rock Salt = decorative script accent
        heading: ['Figtree', 'sans-serif'],
        body: ['Onest', 'sans-serif'],
        script: ['"Rock Salt"', 'cursive'],
      },
      maxWidth: {
        site: '1300px',
      },
    },
  },
  plugins: [],
};
