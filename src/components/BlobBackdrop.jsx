export default function BlobBackdrop({ color = "#1d77b3" }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="1200" height="400" fill="transparent" />
        {/* Large right blob */}
        <circle cx="780" cy="220" r="280" fill={color} />
        {/* Connecting nub right */}
        <path d="M1060,220 C1080,180 1140,170 1180,210 C1210,240 1250,242 1280,220" fill={color} />
        {/* Mid-left molecule */}
        <circle cx="250" cy="180" r="80" fill={color} />
        <circle cx="330" cy="180" r="24" fill={color} />
        <circle cx="210" cy="110" r="30" fill={color} />
        <path d="M280,180 C300,180 308,180 318,180" stroke={color} strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M230,150 C235,140 245,130 255,125" stroke={color} strokeWidth="28" fill="none" strokeLinecap="round" />
        {/* Top-left and far-left cutoffs */}
        <circle cx="40" cy="30" r="70" fill={color} />
        {/* Edge left big cutoff */}
        <circle cx="-20" cy="200" r="110" fill={color} />
      </svg>
    </div>
  )
}


