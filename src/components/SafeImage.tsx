"use client";

import { useState, ReactNode } from "react";

// Listing images are scraped hotlinks and some return 404 (blind QA #7). Show the fallback
// instead of a broken-image icon.
export default function SafeImage({
  src,
  alt,
  className,
  fallback,
  onClick,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
  onClick?: () => void;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setFailedSrc(src)}
      // The static export renders <img> before React hydrates, so a fast 404 can fire its error
      // event before onError is attached. Check the image's state when React attaches to it.
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0 && failedSrc !== src) setFailedSrc(src);
      }}
    />
  );
}
