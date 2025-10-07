export default function Icon() {
  // Simple, valid 32x32 SVG favicon rendered by Next.js (App Router supports icon.tsx)
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6D28D9"/>
          <stop offset="100%" stopColor="#06B6D4"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="6" fill="url(#g)"/>
      <path d="M8 20c3-6 6-9 8-9s5 3 8 9" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="16" cy="13" r="2" fill="white"/>
    </svg>
  );
}
