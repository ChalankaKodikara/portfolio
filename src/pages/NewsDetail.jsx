import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function NewsDetail({ id }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/photos`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((n) => n.id === id);
        setNews(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center text-slate-500">
        Loading news article...
      </div>
    );

  if (!news)
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center text-slate-600">
        Article not found.
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <button
        onClick={() => (window.location.href = "/")}
        className="text-slate-600 text-sm hover:text-slate-900 mb-6"
      >
        ← Back to News
      </button>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
        {news.title}
      </h1>

      {news.localImage && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <img
            src={`https://back-chalanka.casknet.dev${news.localImage}`}
            alt={news.title}
            className="w-full object-cover aspect-[21/9]"
          />
        </div>
      )}

      <div
        className="mt-8 text-slate-700 leading-relaxed prose max-w-none"
        dangerouslySetInnerHTML={{ __html: news.description }}
      ></div>
    </div>
  );
}
