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
  const [galleryPreview, setGalleryPreview] = useState([]); // ✅ for graphics gallery previews
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null); // ✅ separate ref for multiple gallery uploads

  const [form, setForm] = useState({
    title: "",
    category: "software",
    link: "",
    technologies: "",
    features: "",
    description: "",
    image: null,
    client: "", // ✅ new for graphics
    mainImage: null, // ✅ new for graphics
    gallery: [], // ✅ new for graphics
  });

  const API_SOFTWARE = "http://localhost:4000/api/projects";
  const API_GRAPHICS = "http://localhost:4000/api/graphics";

  // 🔹 Fetch all projects (software + graphics)
  useEffect(() => {
    Promise.all([
      fetch(API_SOFTWARE).then((res) => res.json()),
      fetch(API_GRAPHICS).then((res) => res.json()),
    ])
      .then(([software, graphics]) => {
        const combined = [...software, ...graphics].reverse();
        setItems(combined);
      })
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

    if (form.category === "graphics") {
      // 🎨 GRAPHICS HANDLER
      const payload = {
        id: editingId || Date.now().toString(),
        title: form.title,
        client: form.client,
        description: cleanHTML(form.description),
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (form.mainImage) formData.append("mainImage", form.mainImage);
      if (form.gallery && form.gallery.length > 0) {
        for (const file of form.gallery) {
          formData.append("gallery", file);
        }
      }

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_GRAPHICS}/${editingId}` : API_GRAPHICS;

      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (result.success) {
        if (editingId) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === editingId
                ? {
                    ...payload,
                    mainImage: result.mainImage,
                    gallery: result.gallery,
                  }
                : i
            )
          );
        } else {
          setItems((prev) => [
            {
              ...payload,
              mainImage: result.mainImage,
              gallery: result.gallery,
              category: "graphics",
            },
            ...prev,
          ]);
        }

        resetForm();
        return;
      }
    }

    // 💻 SOFTWARE HANDLER
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
    const url = editingId ? `${API_SOFTWARE}/${editingId}` : API_SOFTWARE;

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
        setItems((prev) => [
          { ...payload, localImage: result.image, category: "software" },
          ...prev,
        ]);
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
      client: "",
      mainImage: null,
      gallery: [],
    });
    setEditingId(null);
    setLastImage(null);
    setGalleryPreview([]);
  }

  // 🗑️ Delete Project
  async function onRemove(id, category) {
    const API = category === "graphics" ? API_GRAPHICS : API_SOFTWARE;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // ✏️ Edit Project — Fetch and Fill
  async function onEdit(id, category) {
    try {
      const API = category === "graphics" ? API_GRAPHICS : API_SOFTWARE;
      const res = await fetch(`${API}/${id}`);
      if (!res.ok) throw new Error("Project not found");
      const data = await res.json();

      if (category === "graphics") {
        setForm({
          category,
          title: data.title || "",
          client: data.client || "",
          description: data.description || "",
          mainImage: null,
          gallery: [],
        });

        setLastImage(
          data.mainImage
            ? `http://localhost:4000${data.mainImage}`
            : null
        );
        setGalleryPreview(
          (data.gallery || []).map(
            (g) => `http://localhost:4000${g}`
          )
        );
      } else {
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
          data.localImage
            ? `http://localhost:4000${data.localImage}`
            : null
        );
      }

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

  // 🧩 Conditional Render
  const isGraphics = form.category === "graphics";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        {editingId ? "Edit Project" : "Projects Management"}
      </h1>

      {/* ===== Add / Edit Project Form ===== */}
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        {/* 🧾 Title */}
        <input
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

        {/* 🎨 Graphics Form */}
        {isGraphics ? (
          <>
            {/* 👤 Client */}
            <input
              className="border border-slate-300 px-3 py-2 rounded-md sm:col-span-2"
              placeholder="Client Name"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              required
            />

            {/* 🖼 Main Image */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center sm:col-span-2">
              <p className="text-sm text-slate-500 mb-2">
                Upload Main Display Image
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, mainImage: e.target.files?.[0] })
                }
              />
              {form.mainImage || lastImage ? (
                <img
                  src={
                    form.mainImage
                      ? URL.createObjectURL(form.mainImage)
                      : lastImage
                  }
                  alt="Main"
                  className="mt-3 h-28 w-auto rounded-md object-cover mx-auto"
                />
              ) : null}
            </div>

            {/* 🖼 Gallery Upload */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center sm:col-span-2">
              <p className="text-sm text-slate-500 mb-2">
                Upload Gallery Images
              </p>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setForm({ ...form, gallery: files });
                  setGalleryPreview(files.map((f) => URL.createObjectURL(f)));
                }}
              />
              <div className="mt-3 flex flex-wrap gap-3 justify-center">
                {galleryPreview.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Gallery"
                    className="h-20 w-20 object-cover rounded-md ring-1 ring-slate-200"
                  />
                ))}
              </div>
            </div>

            {/* 🟡 Description */}
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600 mb-1 block">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
              />
            </div>
          </>
        ) : (
          <>
            {/* SOFTWARE FORM — unchanged */}
            <input
              className="border border-slate-300 px-3 py-2 sm:col-span-2 rounded-md"
              placeholder="Project Link (optional)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />

            {/* Image Upload */}
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center sm:col-span-2"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {form.image || lastImage ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={
                      form.image ? URL.createObjectURL(form.image) : lastImage
                    }
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

            <input
              className="border border-slate-300 px-3 py-2 sm:col-span-2 rounded-md"
              placeholder="Technologies (comma separated)"
              value={form.technologies}
              onChange={(e) =>
                setForm({ ...form, technologies: e.target.value })
              }
            />

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600 mb-1 block">
                Key Features
              </label>
              <ReactQuill
                theme="snow"
                value={form.features}
                onChange={(v) => setForm({ ...form, features: v })}
                modules={bulletModules}
                formats={bulletFormats}
                placeholder="Add bullet points describing key features..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600 mb-1 block">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
              />
            </div>
          </>
        )}

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
              {it.category || "software"}
            </div>
            <h3 className="mt-1 font-semibold text-slate-900">{it.title}</h3>

            {it.localImage || it.mainImage ? (
              <img
                src={`http://localhost:4000${
                  it.localImage || it.mainImage
                }`}
                alt={it.title}
                className="mt-2 rounded-md object-cover aspect-video ring-1 ring-slate-200"
              />
            ) : (
              <div className="h-32 bg-slate-100 rounded-md mt-2" />
            )}

            <div
              className="mt-2 text-xs text-slate-600 prose prose-slate"
              dangerouslySetInnerHTML={{
                __html: cleanHTML(it.description || ""),
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
                onClick={() => onEdit(it.id, it.category)}
                className="text-slate-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onRemove(it.id, it.category)}
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
