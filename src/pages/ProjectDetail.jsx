import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function ProjectDetail({ id }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setLoading(false);
      });
  }, [id]);

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

  const {
    title,
    category,
    description,
    localImage,
    link,
    technologies,
    features,
  } = project;

  // 🧹 Clean up Quill HTML noise
  const cleanHTML = (html = "") =>
    html
      .replace(/<span[^>]*class="ql-ui"[^>]*><\/span>/g, "")
      .replace(/data-list="[^"]*"/g, "")
      .replace(/contenteditable="[^"]*"/g, "")
      .replace(/<p><br><\/p>/g, "")
      .trim();

  // 🪄 Format features — supports both HTML + plain text
  const formatFeatures = (featuresText = "") => {
    const clean = cleanHTML(featuresText);

    // Case 1: Quill already created <ul> or <ol> lists
    if (clean.includes("<ul") || clean.includes("<ol")) return clean;

    // Case 2: Fallback to plain text -> make <ul><li>...</li></ul>
    const items = clean
      .split(/[\n•\-–,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (items.length === 0) return "";
    return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {category || "Project"}
      </div>

      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
        {title}
      </h1>

      {link && (
        <a
          className="mt-2 inline-block text-sky-600 font-medium underline hover:text-sky-800 transition"
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          Visit Project ↗
        </a>
      )}

      {/* Image */}
      {localImage && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <img
            src={`https://back-chalanka.casknet.dev${localImage}`}
            alt={title}
            className="w-full object-cover aspect-[21/9]"
          />
        </div>
      )}

      {/* Description */}
      {description && (
        <div
          className="prose prose-slate mt-8 max-w-none prose-p:text-slate-700 prose-strong:text-slate-900"
          dangerouslySetInnerHTML={{ __html: cleanHTML(description) }}
        />
      )}

      {/* Technologies */}
      {technologies?.length > 0 && (
        <div className="mt-10">
          <h2 className="font-semibold text-slate-900 mb-2">
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {technologies.map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {features && (
        <div className="mt-10">
          <h2 className="font-semibold text-slate-900 mb-2">Key Features</h2>
          <div
            className="max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: `
        <ul class="list-disc pl-6 space-y-1 marker:text-slate-500">
          ${formatFeatures(features)
            .replace(/^<ul>|<\/ul>$/g, "") // remove wrapping <ul> if any
            .trim()}
        </ul>
      `,
            }}
          />
        </div>
      )}
    </div>
  );
}
