// Simple generic pictograms, one per parts category — stands in for real
// product photography (the app has none) in the ivoirelite-style product
// grid. All strokes use currentColor so they inherit .product-card__icon's
// accent color.
const ICONS: Record<string, JSX.Element> = {
  Freinage: (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="5.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Filtration: (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16l-6 8v6l-4 2v-8z" strokeLinejoin="round" />
    </svg>
  ),
  Suspension: (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v3M6 7l12-2M6 9l12 2M6 13l12-2M6 15l12 2M12 19v3" strokeLinecap="round" />
    </svg>
  ),
  "Électricité": (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" stroke="none">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  ),
  Moteur: (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3.2" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
      />
    </svg>
  ),
  Consommables: (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3c3 4 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 3-7 6-11z" strokeLinejoin="round" />
    </svg>
  ),
  Accessoires: (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 8 12 4l8 4-8 4-8-4Z" strokeLinejoin="round" />
      <path d="M4 8v8l8 4 8-4V8M12 12v8" strokeLinejoin="round" />
    </svg>
  ),
};

const FALLBACK = (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

export default function CategoryIcon({ category }: { category: string }) {
  return ICONS[category] ?? FALLBACK;
}
