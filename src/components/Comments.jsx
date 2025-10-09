import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function Comments() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/comments`)
      .then((res) => res.json())
      .then((data) =>
        setItems(data.sort((a, b) => new Date(b.id) - new Date(a.id)))
      )
      .catch((err) => console.error("Error loading comments:", err));
  }, []);

  if (!items.length) return null;

  return (
    <section id="comments" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h2 className="text-3xl font-bold mb-8">What People Say</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              {it.localImage ? (
                <img
                  src={`http://localhost:4000${it.localImage}`}
                  alt={it.title}
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-semibold">
                  {it.title?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <div className="font-semibold text-slate-800">{it.title}</div>
                <div className="text-sm text-slate-500">Commenter</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              “{it.description}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
