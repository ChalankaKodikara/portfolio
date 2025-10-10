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
    <section id="experience" className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <h2 className="text-3xl font-bold mb-10 text-center sm:text-left">
        Professional Experience
      </h2>

      <div className="relative border-l-2 border-slate-200 ml-6 sm:ml-6 sm:border-l-2 border-none sm:border-solid">
        {items.map((it, idx) => (
          <div
            key={it.id}
            className="relative sm:pl-10 pb-12 flex flex-col items-center sm:block"
          >
            {/* Timeline dot (desktop) */}
            <span className="hidden sm:block absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm"></span>

            {/* Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition relative w-full sm:w-auto">
              {/* Timeline dot (mobile center) */}
              <div className="sm:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full shadow-sm"></div>

              {/* Logo + Title */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {it.companyLogo && (
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50 ring-1 ring-slate-200 mx-auto sm:mx-0">
                    <img
                      src={`https://back-chalanka.casknet.dev${it.companyLogo}`}
                      alt={it.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {it.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {it.company} • {it.location || "Sri Lanka"}{" "}
                    {it.workType ? `• ${it.workType}` : ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(it.startDate)} –{" "}
                    {it.present ? "Present" : formatDate(it.endDate)} •{" "}
                    {calculateDuration(it.startDate, it.endDate)}
                  </p>
                </div>
              </div>

              {/* Summary (hidden on mobile) */}
              <div
                className="experience-summary mt-3 text-sm text-slate-700 leading-relaxed hidden sm:block"
                dangerouslySetInnerHTML={{ __html: it.summary }}
              ></div>
            </div>

            {/* Timeline line (desktop only) */}
            {idx !== items.length - 1 && (
              <span className="hidden sm:block absolute left-[4px] top-6 bottom-0 w-[2px] bg-slate-200"></span>
            )}
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
