import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { API_BASE } from "../lib/api.js";

export default function Projects() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 3;

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Fetch data
  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data.reverse());
        else setItems([]);
      })
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  const totalPages = Math.ceil(items.length / perPage);
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  // 🧹 Clean HTML description
  const cleanHTML = (html = "") =>
    html
      .replace(/<p[^>]*>/g, "")
      .replace(/<\/p>/g, " ")
      .replace(/<br\s*\/?>/g, " ")
      .trim();

  return (
    <section
      id="projects"
      ref={ref}
      className="mx-auto max-w-7xl px-4 sm:px-6 py-16"
    >
      {/* ==== Section Header ==== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center sm:text-left"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Featured Projects
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto sm:mx-0 text-sm sm:text-base">
          A curated selection of software and creative solutions that showcase
          innovation, precision, and design excellence.
        </p>
      </motion.div>

      {/* ==== Project Cards ==== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {paginated.length > 0 ? (
          paginated.map((it) => (
            <motion.a
              key={it.id}
              href={`/project/${it.id}`}
              variants={cardVariants}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-slate-200 hover:shadow-2xl transition-all duration-300"
            >
              {/* Project Image */}
              {it.localImage ? (
                <div className="relative">
                  <img
                    src={`http://localhost:4000${it.localImage}`}
                    alt={it.title}
                    className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-cyan-100 to-slate-100" />
              )}

              {/* Card Content */}
              <div className="flex flex-col justify-between flex-grow p-6">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                    {it.category || "Software"}
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                    {it.title}
                  </h3>

                  <p
                    className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: cleanHTML(it.description),
                    }}
                  />
                </div>

                <button className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-900 hover:text-sky-700 transition sm:hidden">
                  View Details →
                </button>
              </div>
            </motion.a>
          ))
        ) : (
          <motion.p
            variants={cardVariants}
            className="text-slate-500 col-span-full text-center py-10"
          >
            No projects found.
          </motion.p>
        )}
      </motion.div>

      {/* ==== Pagination ==== */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex flex-wrap gap-3 items-center justify-center"
        >
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              page === 1
                ? "border-slate-200 text-slate-400 cursor-not-allowed"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            ← Previous
          </button>

          <span className="text-slate-600 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              page === totalPages
                ? "border-slate-200 text-slate-400 cursor-not-allowed"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Next →
          </button>
        </motion.div>
      )}
    </section>
  );
}
