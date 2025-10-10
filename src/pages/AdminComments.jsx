import { useEffect, useState, useRef } from "react";

export default function AdminComments() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [lastImage, setLastImage] = useState(null);
  const fileInputRef = useRef(null);

  const API = "https://back-chalanka.casknet.dev/api/comments";

  // Fetch all comments
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse()))
      .catch((err) => console.error("Error fetching comments:", err));
  }, []);

  // Submit handler
  async function onSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

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
      setForm({ title: "", description: "", image: null });
      fileInputRef.current.value = null;
    }
  }

  // Delete handler
  async function onRemove(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Drag and drop support
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setForm({ ...form, image: file });
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Comments Management</h1>

      {/* Form */}
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
          placeholder="Commenter Name"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
          rows={3}
          placeholder="Comment text..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        {/* Image uploader */}
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
                alt="Avatar Preview"
                className="h-20 w-20 rounded-full object-cover ring-1 ring-slate-200"
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
              Click or drag to upload commenter avatar
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

        <div className="sm:col-span-2">
          <button className="bg-slate-900 text-white rounded-md px-4 py-2">
            Add Comment
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="mt-8 space-y-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-start gap-3 border border-slate-200 bg-white rounded-xl p-4 shadow-sm"
          >
            {it.localImage ? (
              <img
                src={`https://back-chalanka.casknet.dev${it.localImage}`}
                alt={it.title}
                className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg">
                {it.title?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-slate-800">{it.title}</div>
              <p className="text-slate-600 text-sm mt-1">{it.description}</p>
              <button
                onClick={() => onRemove(it.id)}
                className="text-red-600 text-xs mt-2"
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
