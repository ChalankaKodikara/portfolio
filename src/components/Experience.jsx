import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api.js";

export default function Experience() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/experience`)
      .then((res) => res.json())
      .then((data) =>
        setItems(
          data.sort(
            (a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0)
          )
        )
      )
      .catch((err) => console.error("Error loading experience:", err));
  }, []);

  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h2 className="text-3xl font-bold mb-8">Professional Experience</h2>

      <div className="grid gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="group flex flex-col sm:flex-row items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Left company image */}
            {it.companyLogo && (
              <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-50 ring-1 ring-slate-200">
                <img
                  src={`http://localhost:4000${it.companyLogo}`}
                  alt={it.company}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Right content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {it.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1 sm:mt-0">
                  {formatDate(it.startDate)} –{" "}
                  {it.present ? "Present" : formatDate(it.endDate)} •{" "}
                  {calculateDuration(it.startDate, it.endDate)}
                </p>
              </div>

              <p className="text-sm text-slate-500 mt-0.5">
                {it.company} • {it.location || "Sri Lanka"}{" "}
                {it.workType ? `• ${it.workType}` : ""}
              </p>

              <div
                className="experience-summary mt-3 text-sm text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: it.summary }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ------------------ Helpers ------------------
function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function calculateDuration(start, end) {
  if (!start) return "";
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  return [
    years > 0 ? `${years} yr${years > 1 ? "s" : ""}` : "",
    remaining > 0 ? `${remaining} mo${remaining > 1 ? "s" : ""}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
