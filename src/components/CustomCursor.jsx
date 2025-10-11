import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      cursorDot.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;

      // Show cursor when moved
      cursor.style.opacity = 1;
      cursorDot.style.opacity = 1;

      // Reset hide timer
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        cursor.style.opacity = 0;
        cursorDot.style.opacity = 0;
      }, 2000);
    };

    const addHover = () => cursor.classList.add("cursor-hover");
    const removeHover = () => cursor.classList.remove("cursor-hover");

    // Event listeners
    window.addEventListener("mousemove", moveCursor);
    document.querySelectorAll("a, button, .hoverable").forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.querySelectorAll("a, button, .hoverable").forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] w-10 h-10 border border-slate-400 rounded-full pointer-events-none transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2 opacity-0"
      ></div>

      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 bg-slate-900 rounded-full pointer-events-none transition-all duration-100 ease-out -translate-x-1/2 -translate-y-1/2 opacity-0"
      ></div>

      <style jsx global>{`
        .cursor-hover {
          transform: scale(1.5);
          border-color: #0ea5e9; /* sky-500 */
        }
      `}</style>
    </>
  );
}
