export default function RibbonPattern({
  color = "blue",
  opacity = 0.2,
  position = "top",
}) {
  const rotation = position === "bottom" ? "rotate-180" : "";
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${rotation}`}
    >
      <svg
        viewBox="0 0 1200 400"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-[140%] left-[-20%] top-0"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M0,300 Q300,100 600,300 T1200,300"
          fill="none"
          stroke={color}
          strokeWidth="80"
          strokeLinecap="round"
          strokeOpacity={opacity}
        />
      </svg>
    </div>
  );
}
