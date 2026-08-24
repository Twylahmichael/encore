import { useState } from 'react';

// Product-detail hover zoom: wherever the cursor sits over the image, that
// point zooms in — matches the live site's WooCommerce gallery zoom.
// Implemented as a scaled image with transform-origin tracking the cursor
// position (as a %), rather than a separate magnifier pane — simpler, and
// avoids needing a second full-res image element/library.
export function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [origin, setOrigin] = useState('center center');
  const [zoomed, setZoomed] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      className="aspect-square bg-efn-offwhite overflow-hidden cursor-zoom-in"
      onMouseMove={handleMove}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-150 ease-out"
        style={{ transformOrigin: origin, transform: zoomed ? 'scale(2)' : 'scale(1)' }}
      />
    </div>
  );
}
