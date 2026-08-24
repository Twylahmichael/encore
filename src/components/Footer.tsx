import { useSettings } from '../lib/useSettings';

// The live site's global footer is a minimal copyright bar ONLY — no social
// links, map, or M-Pesa info site-wide. Contact details (phone/address/social)
// live exclusively on the Contact page itself. See docs/COMPARISON.md.
//
// The M-Pesa Till line below is a Phase 1 proposal addition ("refreshed
// footer... M-Pesa Till"), not something on the live site — added once the
// real Till number was provided (brochure + staff confirmation, 2026-08-24).
export function Footer() {
  const settings = useSettings();
  const till = settings['mpesa.till_number'];

  return (
    <footer className="bg-efn-black text-efn-white py-6">
      <div className="max-w-site mx-auto px-6 text-center text-sm space-y-1">
        {till && <p className="text-efn-white/70">Pay via M-Pesa — Till No: <span className="font-semibold text-efn-white">{till}</span></p>}
        <p>
          Copyright © 2026 Encore Fitness Studio | Built by{' '}
          <a
            href="https://imarisher.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-efn-green"
          >
            Imarisher
          </a>
        </p>
      </div>
    </footer>
  );
}
