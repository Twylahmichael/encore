// The live site's global footer is a minimal copyright bar ONLY — no social
// links, map, or M-Pesa info site-wide. Contact details (phone/address/social)
// live exclusively on the Contact page itself. See docs/COMPARISON.md.
export function Footer() {
  return (
    <footer className="bg-efn-black text-efn-white py-6">
      <div className="max-w-site mx-auto px-6 text-center text-sm">
        Copyright © 2026 Encore Fitness Studio | Built by{' '}
        <a
          href="https://imarisher.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-efn-green"
        >
          Imarisher
        </a>
      </div>
    </footer>
  );
}
