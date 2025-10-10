// src/pages/Graphics.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function Graphics() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  // Fetch graphics
  useEffect(() => {
    fetch(`${API_BASE}/graphics`)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse())) // newest first
      .catch((err) => console.error("Error loading graphics:", err));
  }, []);

  // 🔁 Auto slide
  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % items.length),
      5000
    );
    return () => clearInterval(timer);
  }, [items]);

  // ✅ Navigate manually
  const nextSlide = () => setIndex((i) => (i + 1) % items.length);
  const prevSlide = () =>
    setIndex((i) => (i - 1 + items.length) % items.length);

  // ✅ Navigate within app
  const navigate = (url) => {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (!items.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center text-slate-500">
        Loading graphics...
      </section>
    );
  }

  const current = items[index];

  return (
    <section
      id="graphics"
      className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 overflow-hidden"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-center">
        Graphic Design
      </h2>
      <p className="mt-3 text-slate-600 text-center max-w-2xl mx-auto">
        A showcase of visual identity, branding, and creative direction projects
        crafted with precision and bold storytelling aesthetics.
      </p>

      {/* ==== Slider ==== */}
      <div className="relative mt-12 w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {item.mainImage ? (
              <img
                src={`http://localhost:4000${item.mainImage}`}
                alt={item.title}
                onClick={() => navigate(`/graphic/${item.id}`)}
                className="w-full h-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 to-blue-100" />
            )}

            {/* Overlay text */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <h3
                className="text-xl font-semibold cursor-pointer hover:underline"
                onClick={() => navigate(`/graphic/${item.id}`)}
              >
                {item.title}
              </h3>
              <p
                className="mt-1 text-sm line-clamp-2 opacity-90"
                dangerouslySetInnerHTML={{
                  __html: item.description?.slice(0, 150) || "",
                }}
              />
            </div>
          </div>
        ))}

        {/* 🔹 Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-slate-800 p-3 rounded-full shadow transition"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-slate-800 p-3 rounded-full shadow transition"
        >
          ›
        </button>
      </div>

      {/* 🔹 Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 ${
              i === index
                ? "w-8 h-3 rounded-full bg-slate-900"
                : "w-3 h-3 rounded-full bg-slate-400/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
