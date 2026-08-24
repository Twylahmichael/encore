import { useState, type ReactNode } from 'react';

// Small collapsible section — used on the product detail page for
// Description/Reviews, matching the live site's WooCommerce-style
// accordion (starts with a −/+ depending on defaultOpen).
export function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-efn-gray/30 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left font-semibold uppercase text-sm tracking-wide"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
