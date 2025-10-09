import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function AdminProjects() {
  const [items, setItems] = useState([]);
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

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse()))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    const payload = {
      id: Date.now().toString(),
      title: form.title,
      category: form.category,
      link: form.link,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      features: form.features,
      description: form.description,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (form.image) formData.append("image", form.image);

    const res = await fetch(API, { method: "POST", body: formData });
    const result = await res.json();

    if (result.success) {
      setItems((prev) => [{ ...payload, localImage: result.image }, ...prev]);
      if (form.image) setLastImage(URL.createObjectURL(form.image));
      setForm({
        title: "",
        category: "software",
        link: "",
        technologies: "",
        features: "",
        description: "",
        image: null,
      });
    }
  }

  async function onRemove(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setForm({ ...form, image: file });
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Projects Management</h1>

      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <input
          className="border border-slate-300 px-3 py-2 rounded-md"
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <select
          className="border border-slate-300 px-3 py-2 rounded-md"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="software">Software</option>
          <option value="graphics">Graphics</option>
        </select>

        <input
          className="border border-slate-300 px-3 py-2 sm:col-span-2 rounded-md"
          placeholder="Project Link (optional)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        <div
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition cursor-pointer sm:col-span-2"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {form.image ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={URL.createObjectURL(form.image)}
                alt="Preview"
                className="h-20 w-20 rounded-md object-cover ring-1 ring-slate-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, image: null });
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

        {lastImage && !form.image && (
          <button
            type="button"
            className="mt-2 text-xs text-blue-600 underline sm:col-span-2"
            onClick={() => setForm({ ...form, image: lastImage })}
          >
            Reuse last uploaded image
          </button>
        )}

        <input
          className="border border-slate-300 px-3 py-2 sm:col-span-2 rounded-md"
          placeholder="Technologies (comma separated)"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
        />

        <div className="sm:col-span-2">
          <label className="text-sm text-slate-600 mb-1 block">
            Features (Rich Text)
          </label>
          <ReactQuill
            theme="snow"
            value={form.features}
            onChange={(v) => setForm({ ...form, features: v })}
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

        <div className="sm:col-span-2">
          <button className="bg-slate-900 text-white rounded-md px-4 py-2">
            Add Project
          </button>
        </div>
      </form>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xs uppercase text-slate-500">
              {it.category}
            </div>
            <h3 className="mt-1 font-semibold">{it.title}</h3>

            {it.localImage ? (
              <img
                src={`http://localhost:4000${it.localImage}`}
                alt={it.title}
                className="mt-2 rounded-md object-cover aspect-video ring-1 ring-slate-200"
              />
            ) : (
              <div className="h-32 bg-slate-100 rounded-md mt-2" />
            )}

            <div
              className="mt-3 text-sm text-slate-700"
              dangerouslySetInnerHTML={{ __html: it.features }}
            />
            <div
              className="mt-2 text-xs text-slate-600"
              dangerouslySetInnerHTML={{ __html: it.description }}
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
