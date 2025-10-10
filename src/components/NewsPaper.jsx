import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function NewsPaper() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/photos`)
      .then((res) => res.json())
      .then((data) =>
        setItems(data.sort((a, b) => new Date(b.id) - new Date(a.id)))
      )
      .catch((err) => console.error("Error loading news:", err));
  }, []);

  if (!items.length) return null;

  return (
    <section id="news" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h2 className="text-3xl font-bold mb-8">News & Publications</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <a
            key={it.id}
            href={`/news/${it.id}`}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition block"
          >
            {it.localImage && (
              <img
                src={`https://back-chalanka.casknet.dev${it.localImage}`}
                alt={it.title}
                className="aspect-video w-full object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="font-semibold text-lg">{it.title}</h3>
              <div
                className="mt-2 text-sm text-slate-700 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: it.description }}
              ></div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
