import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function GraphicDetail({ id }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0); // now controls gallery only

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/graphics/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching graphic project:", err);
        setLoading(false);
      });
  }, [id]);

  // ✅ Auto-slide only for gallery images
  useEffect(() => {
    if (!project?.gallery?.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % project.gallery.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [project?.gallery?.length]);

  if (loading)
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center text-slate-500">
        Loading project details...
      </div>
    );

  if (!project)
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center text-slate-600">
        Project not found.
      </div>
    );

  const { title, client, description, mainImage, gallery = [] } = project;

  const cleanHTML = (html = "") =>
    html
      .replace(/<span[^>]*class="ql-ui"[^>]*><\/span>/g, "")
      .replace(/data-list="[^"]*"/g, "")
      .replace(/contenteditable="[^"]*"/g, "")
      .replace(/<p><br><\/p>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

  // ✅ Navigation helper
  const goBack = () => {
    window.history.pushState({}, "", "/#graphics");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {client || "Brand Project"}
      </div>

      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
        {title}
      </h1>

      {/* 🟢 Back button */}
      <button
        onClick={goBack}
        className="mt-4 text-sm text-sky-600 underline hover:text-sky-800"
      >
        ← Back to Graphics
      </button>

      {/* ==== Main Image (Static) ==== */}
      {mainImage && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          <img
            src={`http://localhost:4000${mainImage}`}
            alt={title}
            className="w-full object-cover aspect-[16/9]"
          />
        </div>
      )}

      {/* ==== Description ==== */}
      {description && (
        <div
          className="prose prose-slate mt-10 max-w-none prose-p:text-slate-700 prose-strong:text-slate-900"
          dangerouslySetInnerHTML={{ __html: cleanHTML(description) }}
        />
      )}

      {/* ==== Gallery Slider ==== */}
      {gallery.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Gallery Preview
          </h2>

          {/* Main slider image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
            {gallery.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:4000${img}`}
                alt={`Gallery ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Dots for slider */}
          {gallery.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`transition-all duration-300 ${
                    index === i
                      ? "w-8 h-3 rounded-full bg-slate-900"
                      : "w-3 h-3 rounded-full bg-slate-400/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail grid */}
          {gallery.length > 1 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:4000${img}`}
                  alt={`Thumbnail ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`rounded-lg object-cover cursor-pointer border transition hover:scale-105 hover:shadow-md ${
                    index === i ? "ring-2 ring-slate-800" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
