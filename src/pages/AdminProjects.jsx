import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// 🟢 Quill config
const bulletModules = {
  toolbar: [
    [{ list: "bullet" }, { list: "ordered" }],
    ["bold", "italic"],
    ["clean"],
  ],
};
const bulletFormats = ["list", "bold", "italic"];

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [lastImage, setLastImage] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    category: "software",
    link: "",
    technologies: "",
    features: "",
    description: "",
    image: null,
  });

  const API = "http://localhost:4000/api/projects";

  // 🔹 Fetch all projects
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse()))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // 🧹 Clean HTML before saving
  const cleanHTML = (html = "") =>
    html
      .replace(/<span[^>]*class="ql-ui"[^>]*><\/span>/g, "")
      .replace(/data-list="[^"]*"/g, "")
      .replace(/contenteditable="[^"]*"/g, "")
      .replace(/<p><br><\/p>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

  // 🧠 Add or Update Project
  async function onSubmit(e) {
    e.preventDefault();

    const payload = {
      id: editingId || Date.now().toString(),
      title: form.title,
      category: form.category,
      link: form.link,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      features: cleanHTML(form.features),
      description: cleanHTML(form.description),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (form.image) formData.append("image", form.image);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    const res = await fetch(url, { method, body: formData });
    const result = await res.json();

    if (result.success) {
      if (editingId) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === editingId
              ? { ...payload, localImage: result.image || i.localImage }
              : i
          )
        );
      } else {
        setItems((prev) => [{ ...payload, localImage: result.image }, ...prev]);
      }

      if (form.image) setLastImage(URL.createObjectURL(form.image));
      resetForm();
    }
  }

  // 🧹 Reset Form
  function resetForm() {
    setForm({
      title: "",
      category: "software",
      link: "",
      technologies: "",
      features: "",
      description: "",
      image: null,
    });
    setEditingId(null);
    setLastImage(null);
  }

  // 🗑️ Delete Project
  async function onRemove(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // ✏️ Edit Project — Fetch and Fill
  async function onEdit(id) {
    try {
      const res = await fetch(`${API}/${id}`);
      if (!res.ok) throw new Error("Project not found");
      const data = await res.json();

      const cleanFeatures = (data.features || "")
        .replace(/<ol/g, "<ul")
        .replace(/<\/ol/g, "</ul");

      setForm({
        title: data.title || "",
        category: data.category || "software",
        link: data.link || "",
        technologies: Array.isArray(data.technologies)
          ? data.technologies.join(", ")
          : data.technologies || "",
        features: cleanFeatures,
        description: data.description || "",
        image: null,
      });

      setLastImage(
        data.localImage ? `http://localhost:4000${data.localImage}` : null
      );

      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  }

  // 🖱️ Drag & Drop Upload
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setForm({ ...form, image: file });
  };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        {editingId ? "Edit Project" : "Projects Management"}
      </h1>

      {/* ===== Add / Edit Project Form ===== */}
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        {/* 🧾 Title */}
        <input
          key={editingId ? `${editingId}-title` : "new-title"}
          className="border border-slate-300 px-3 py-2 rounded-md"
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        {/* 🗂 Category */}
        <select
          className="border border-slate-300 px-3 py-2 rounded-md"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="software">Software</option>
          <option value="graphics">Graphics</option>
        </select>

        {/* 🔗 Link */}
        <input
          key={editingId ? `${editingId}-link` : "new-link"}
          className="border border-slate-300 px-3 py-2 sm:col-span-2 rounded-md"
          placeholder="Project Link (optional)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        {/* 🖼 Image Upload */}
        <div
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition cursor-pointer sm:col-span-2"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {form.image || lastImage ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={form.image ? URL.createObjectURL(form.image) : lastImage}
                alt="Preview"
                className="h-20 w-20 rounded-md object-cover ring-1 ring-slate-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, image: null });
                  setLastImage(null);
                }}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Click or drag file to upload
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setForm({ ...form, image: file });
            }}
          />
        </div>

        {/* 🧠 Technologies */}
        <input
          key={editingId ? `${editingId}-tech` : "new-tech"}
          className="border border-slate-300 px-3 py-2 sm:col-span-2 rounded-md"
          placeholder="Technologies (comma separated)"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
        />

        {/* 🟢 Features */}
        <div className="sm:col-span-2">
          <label className="text-sm text-slate-600 mb-1 block">
            Key Features
          </label>
          <ReactQuill
            key={editingId ? `${editingId}-features` : "new-features"}
            theme="snow"
            value={form.features}
            onChange={(v) => setForm({ ...form, features: v })}
            modules={bulletModules}
            formats={bulletFormats}
            placeholder="Add bullet points describing key features..."
          />
        </div>

        {/* 🟡 Description */}
        <div className="sm:col-span-2">
          <label className="text-sm text-slate-600 mb-1 block">
            Description
          </label>
          <ReactQuill
            key={editingId ? `${editingId}-description` : "new-description"}
            theme="snow"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />
        </div>

        {/* 🧩 Buttons */}
        <div className="sm:col-span-2 flex gap-3">
          <button className="bg-slate-900 text-white rounded-md px-4 py-2">
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              className="border border-slate-300 px-4 py-2 rounded-md"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== Project Cards ===== */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xs uppercase text-slate-500">
              {it.category}
            </div>
            <h3 className="mt-1 font-semibold text-slate-900">{it.title}</h3>

            {it.localImage ? (
              <img
                src={`http://localhost:4000${it.localImage}`}
                alt={it.title}
                className="mt-2 rounded-md object-cover aspect-video ring-1 ring-slate-200"
              />
            ) : (
              <div className="h-32 bg-slate-100 rounded-md mt-2" />
            )}

            {it.features && (
              <div
                className="mt-3 text-sm text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: `
                    <ul class="list-disc pl-5 space-y-1 marker:text-slate-500">
                      ${cleanHTML(it.features)
                        .replace(/^<ul>|<\/ul>$/g, "")
                        .trim()}
                    </ul>
                  `,
                }}
              />
            )}

            <div
              className="mt-2 text-xs text-slate-600 prose prose-slate"
              dangerouslySetInnerHTML={{
                __html: cleanHTML(it.description),
              }}
            />

            <div className="mt-3 flex items-center gap-2">
              {it.link && (
                <a
                  href={it.link}
                  className="text-blue-600 underline text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit
                </a>
              )}
              <button
                onClick={() => onEdit(it.id)}
                className="text-slate-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onRemove(it.id)}
                className="ml-auto text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
