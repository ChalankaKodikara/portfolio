import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "../lib/api.js";

export default function Graphics() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  // ✅ Safely resolve image paths
  const resolveImage = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // 🔹 Fetch graphics data
  useEffect(() => {
    fetch(`${API_BASE}/graphics`)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse()))
      .catch((err) => console.error("Error loading graphics:", err));
  }, []);

  // 🔁 Auto-slide every 5 seconds
  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % items.length),
      5000
    );
    return () => clearInterval(timer);
  }, [items]);

  // 🔹 Manual navigation
  const nextSlide = () => setIndex((i) => (i + 1) % items.length);
  const prevSlide = () =>
    setIndex((i) => (i - 1 + items.length) % items.length);

  // 🔹 Navigate to Graphic Details
  const navigate = (url) => {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (!items.length)
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center text-slate-500">
        Loading graphics...
      </section>
    );

  return (
    <section
      id="graphics"
      className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center"
    >
      {/* ==== Section Title ==== */}
      <h2 className="text-3xl font-semibold mb-3">Graphic Design</h2>
      <p className="text-slate-600 max-w-2xl mx-auto">
        Explore selected creative design works.
      </p>

      {/* ==== DESKTOP CAROUSEL ==== */}
      <div className="hidden sm:block relative mt-16 h-[420px]">
        <div className="relative flex justify-center items-center h-full">
          {items.map((item, i) => {
            const total = items.length;
            const diff = (i - index + total) % total;
            const distance = diff > total / 2 ? diff - total : diff;
            const translate = distance * 260;
            const scale = Math.max(0.8, 1 - Math.abs(distance) * 0.12);
            const opacity = Math.max(0.3, 1 - Math.abs(distance) * 0.3);
            const zIndex = 20 - Math.abs(distance);

            return (
              <div
                key={item.id}
                className="absolute transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  transform: `translateX(${translate}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  width: "260px",
                  height: "380px",
                }}
                onClick={() => navigate(`/graphic/${item.id}`)}
              >
                <div
                  className={`w-full h-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 backdrop-blur-md transition-transform ${
                    i === index ? "ring-2 ring-slate-900 scale-105" : ""
                  }`}
                >
                  {item.mainImage ? (
                    <img
                      src={resolveImage(item.mainImage)}
                      alt={item.title}
                      className="w-full h-2/3 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-2/3 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="h-1/3 bg-slate-900 text-white p-5 text-left flex flex-col justify-between">
                    <h3 className="text-base font-semibold leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p
                      className="text-sm opacity-80 line-clamp-2 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: item.description?.slice(0, 90) || "",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==== Controls ==== */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-3 rounded-full shadow-md transition"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-3 rounded-full shadow-md transition"
        >
          ›
        </button>
      </div>

      {/* ==== MOBILE VIEW (Animated Centered Card Style) ==== */}
      <div className="sm:hidden flex justify-center mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={items[index].id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.4 }}
            className="relative w-[90%] max-w-xs bg-white/90 backdrop-blur-lg border border-slate-200 rounded-3xl shadow-xl overflow-hidden p-6 text-center"
          >
            {/* Image */}
            {items[index].mainImage ? (
              <img
                src={resolveImage(items[index].mainImage)}
                alt={items[index].title}
                className="w-full h-48 object-cover rounded-2xl mb-5"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-2xl mb-5 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {items[index].title}
            </h3>

            {/* Description */}
            <p
              className="text-slate-600 text-sm leading-relaxed mb-6"
              dangerouslySetInnerHTML={{
                __html: items[index].description?.slice(0, 90) || "",
              }}
            />

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  setIndex((prev) => (prev - 1 + items.length) % items.length)
                }
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 text-lg font-bold shadow-sm active:scale-95"
              >
                ‹
              </button>
              <button
                onClick={() => navigate(`/graphic/${items[index].id}`)}
                className="px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-medium shadow-md active:scale-95"
              >
                View Details
              </button>
              <button
                onClick={() => setIndex((prev) => (prev + 1) % items.length)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 text-lg font-bold shadow-sm active:scale-95"
              >
                ›
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`transition-all duration-300 ${
                    i === index
                      ? "w-6 h-2 rounded-full bg-slate-900"
                      : "w-2 h-2 rounded-full bg-slate-400/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ==== Dots (Desktop) ==== */}
      <div className="hidden sm:flex justify-center gap-2 mt-10">
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
