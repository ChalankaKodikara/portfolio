import { useEffect, useRef } from "react";

/**
 * FloatingShapes.jsx
 * ------------------
 * Creates soft animated circular "blob" shapes floating in the background.
 * Works across all client pages and enhances modern minimal UI.
 *
 * Props:
 *  - color: shape color (default #1d77b3)
 *  - count: number of floating elements (default 8)
 *  - parallax: enable mouse-based motion depth (default true)
 */
export default function FloatingShapes({
  color = "#1d77b3",
  count = 8,
  parallax = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // create shapes
    const shapes = Array.from({ length: count }).map(() => {
      const el = document.createElement("span");
      el.className =
        "absolute rounded-full opacity-20 blur-md will-change-transform transition-transform duration-[2000ms]";
      el.style.background = color;

      // random size + position
      const size = 80 + Math.random() * 200;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;

      // floating animation
      const duration = 12 + Math.random() * 8;
      el.style.animation = `floatMove ${duration}s ease-in-out infinite alternate`;
      el.style.animationDelay = `${Math.random() * -duration}s`;

      container.appendChild(el);
      return el;
    });

    // optional parallax motion
    if (parallax) {
      const onMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;

        shapes.forEach((el, index) => {
          const depth = (index + 1) / count;
          el.style.transform = `translate(${x * 20 * depth}px, ${
            y * 20 * depth
          }px)`;
        });
      };

      window.addEventListener("mousemove", onMouseMove);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        shapes.forEach((el) => container.removeChild(el));
      };
    }

    return () => shapes.forEach((el) => container.removeChild(el));
  }, [color, count, parallax]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes floatMove {
            0% { transform: translateY(0px) scale(1); opacity: 0.8; }
            50% { transform: translateY(-30px) scale(1.05); opacity: 1; }
            100% { transform: translateY(0px) scale(1); opacity: 0.9; }
          }
        `}
      </style>
    </div>
  );
}
