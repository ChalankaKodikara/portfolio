import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function Projects() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 3; // ✅ Show 3 projects per page

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse())) // show newest first
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(items.length / perPage);
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-semibold">Featured Projects</h2>
      <p className="mt-3 text-slate-600 max-w-2xl">
        A curated collection of recent software and creative projects showcasing
        my work in full-stack development, design, and engineering.
      </p>

      {/* Project cards */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
        {paginated.length > 0 ? (
          paginated.map((it) => (
            <a
              key={it.id}
              href={`/project/${it.id}`}
              className="group relative rounded-xl border border-slate-200 bg-white hover:shadow-lg transition overflow-hidden"
            >
              {it.localImage ? (
                <img
                  src={`https://back-chalanka.casknet.dev${it.localImage}`}
                  alt={it.title}
                  className="aspect-video object-cover"
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10" />
              )}
              <div className="p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {it.category || "General"}
                </div>
                <h3 className="font-semibold group-hover:text-slate-900 transition">
                  {it.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 line-clamp-3">
                  {it.description}
                </p>
              </div>
            </a>
          ))
        ) : (
          <p className="text-slate-500">No projects found.</p>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
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
        </div>
      )}
    </section>
  );
}
