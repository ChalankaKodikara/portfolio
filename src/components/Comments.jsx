import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function Comments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error("Error fetching comments:", err));
  }, []);

  return (
    <section id="comments" className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-semibold mb-4">What People Say</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="flex gap-3 border border-slate-200 bg-white rounded-xl p-4 shadow-sm"
          >
            {c.localImage ? (
              <img
                src={`http://localhost:4000${c.localImage}`}
                alt={c.title}
                className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                {c.title?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <div className="font-semibold">{c.title}</div>
              <p className="text-slate-600 text-sm mt-1">{c.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
