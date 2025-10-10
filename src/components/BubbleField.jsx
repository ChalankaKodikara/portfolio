import { useEffect, useRef } from "react";

export default function BubbleField({
  color = "#2476b3", // calm blue tone
  opacity = 1,
  speed = 0.2,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      el.style.setProperty("--scroll", String(y));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1600 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{
          transform: `translate3d(0, calc(var(--scroll, 0px) * ${speed}), 0)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <path
          fill={color}
          fillOpacity={opacity}
          d="M250 200c100-150 300-150 400 0 100 150 400 150 500 0 100-150 300-150 450 0v400H0V200z"
        />
        <circle cx="150" cy="150" r="80" fill={color} fillOpacity={opacity} />
        <circle cx="800" cy="550" r="200" fill={color} fillOpacity={opacity} />
        <circle cx="1300" cy="100" r="120" fill={color} fillOpacity={opacity} />
        <circle cx="1550" cy="250" r="70" fill={color} fillOpacity={opacity} />
        <circle cx="1400" cy="500" r="150" fill={color} fillOpacity={opacity} />
      </svg>
    </div>
  );
}
