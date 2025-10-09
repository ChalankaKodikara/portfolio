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

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center text-slate-500">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center text-slate-600">
        Project not found.
      </div>
    );
  }

  const {
    title,
    category,
    description,
    localImage,
    link,
    technologies,
    features,
  } = project;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
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

      {localImage && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <img
            src={`http://localhost:4000${localImage}`}
            alt={title}
            className="w-full object-cover aspect-[21/9]"
          />
        </div>
      )}

      <p className="mt-6 text-slate-700 leading-relaxed">{description}</p>

      {technologies?.length > 0 && (
        <div className="mt-8">
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

      {features && (
        <div className="mt-8">
          <h2 className="font-semibold text-slate-900 mb-2">Key Features</h2>

          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            {(Array.isArray(features)
              ? features
              : typeof features === "string"
              ? features.split(",").map((f) => f.trim())
              : []
            ).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
