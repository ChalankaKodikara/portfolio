import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function Comments() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/comments`)
      .then((res) => res.json())
      .then((data) =>
        setItems(data.sort((a, b) => new Date(b.id) - new Date(a.id)))
      )
      .catch((err) => console.error("Error loading comments:", err));
  }, []);

  // 🔁 Auto-slide every 5 seconds
  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section
      id="comments"
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center overflow-hidden"
    >
      <h2 className="text-3xl font-bold mb-8">What People Say</h2>

      {/* === Slider Container === */}
      <div className="relative h-64 sm:h-72 md:h-80 flex items-center justify-center">
        {items.map((it, i) => (
          <div
            key={it.id}
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
              index === i
                ? "opacity-100 translate-y-0 z-10"
                : "opacity-0 translate-y-6 z-0"
            }`}
          >
            {it.localImage ? (
              <img
                src={`http://localhost:4000${it.localImage}`}
                alt={it.title}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200 shadow-md mb-4"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold mb-4">
                {it.title?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <p className="text-slate-700 italic text-lg leading-relaxed max-w-xl mx-auto mb-4">
              “{it.description}”
            </p>
            <div className="font-semibold text-slate-900">{it.title}</div>
            <div className="text-sm text-slate-500">Commenter</div>
          </div>
        ))}
      </div>

      {/* === Slider Dots === */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 ${
              index === i
                ? "w-6 h-2 rounded-full bg-slate-900"
                : "w-2 h-2 rounded-full bg-slate-400/60"
            }`}
          />
        ))}
      </div>

      {/* === Background Blur Glow === */}
      <div className="absolute -z-10 inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-cyan-100/40 blur-3xl rounded-full"></div>
      </div>
    </section>
  );
}
