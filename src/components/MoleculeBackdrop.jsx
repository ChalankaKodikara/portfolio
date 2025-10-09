export default function MoleculeBackdrop({ color = "#1d77b3" }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <rect width="1200" height="400" fill="transparent" />
        <circle cx="1100" cy="200" r="180" fill={color} />
        <circle cx="300" cy="250" r="90" fill={color} />
        <circle cx="600" cy="100" r="60" fill={color} />
        <path
          d="M250,260 C400,200 700,280 900,180"
          stroke={color}
          strokeWidth="60"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
