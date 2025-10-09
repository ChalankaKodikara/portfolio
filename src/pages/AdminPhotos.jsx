import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function AdminPhotos() {
  const [items, setItems] = useState([]);
  const [lastImage, setLastImage] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    image: null,
    description: "",
  });

  const API = "http://localhost:4000/api/photos";

  // Fetch all existing newspaper posts
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse()))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  // Handle submit (create new publication)
  async function onSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      id: Date.now().toString(),
      title: form.title,
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
      setForm({ title: "", image: null, description: "" });
      fileInputRef.current.value = null;
    }
  }

  // Handle delete
  async function onRemove(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Drag & Drop upload
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setForm({ ...form, image: file });
  };

  const handleDragOver = (e) => e.preventDefault();

  // Quill editor setup (supports multiple font sizes and formatting)
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "clean"],
    ],
  };

  const quillFormats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Newspaper Publications</h1>

      {/* Add Form */}
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
          placeholder="Headline / Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        {/* 🖼️ Image uploader */}
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
                className="h-40 w-auto rounded-md object-cover ring-1 ring-slate-200"
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
              Click or drag image here to upload newspaper image
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

        {/* 📰 Rich-text Description */}
        <div className="sm:col-span-2">
          <label className="text-sm text-slate-600 mb-1 block">
            News Description / Story
          </label>
          <ReactQuill
            theme="snow"
            modules={quillModules}
            formats={quillFormats}
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            placeholder="Write your news article, use bold/italic, font sizes, bullet points..."
            className="bg-white rounded-md"
          />
        </div>

        <div className="sm:col-span-2">
          <button className="bg-slate-900 text-white rounded-md px-4 py-2">
            Publish News
          </button>
        </div>
      </form>

      {/* 📜 Published Articles */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="font-semibold text-lg">{it.title}</h3>

            {it.localImage ? (
              <img
                src={`http://localhost:4000${it.localImage}`}
                alt={it.title}
                className="mt-3 rounded-md object-cover aspect-video ring-1 ring-slate-200"
              />
            ) : (
              <div className="h-32 bg-slate-100 rounded-md mt-3" />
            )}

            <div
              className="mt-3 text-sm text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: it.description }}
            ></div>

            <button
              onClick={() => onRemove(it.id)}
              className="mt-4 text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* 🖼️ Bottom Gallery Section */}
      {items.length > 0 && (
        <div className="mt-16 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">
            📰 Latest Publication Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items
              .filter((it) => it.localImage)
              .map((it) => (
                <div
                  key={it.id}
                  className="rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:scale-[1.02] transition-transform duration-200"
                >
                  <img
                    src={`http://localhost:4000${it.localImage}`}
                    alt={it.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}


