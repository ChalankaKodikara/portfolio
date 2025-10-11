import { useState, useRef } from "react";
import { API_BASE } from "../lib/api.js"; // ✅ Import your global base URL

export default function AddComment() {
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const API = `${API_BASE}/comments`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    setLoading(true);

    const payload = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch(API, { method: "POST", body: formData });
      const result = await res.json();

      if (result.success) {
        alert("Thank you! Your comment has been submitted.");
        setForm({ title: "", description: "", image: null });
        setPreview(null);
        fileInputRef.current.value = null;
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Error submitting comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="add-comment"
      className="mx-auto max-w-xl px-4 sm:px-6 py-12 bg-white/70 rounded-2xl shadow-sm border border-slate-200 mt-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
        Share Your Thoughts 💬
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="rounded-md border border-slate-300 px-3 py-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Write your comment..."
          className="rounded-md border border-slate-300 px-3 py-2"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        {/* Image uploader */}
        <div
          className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={preview}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover ring-1 ring-slate-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setForm({ ...form, image: null });
                  setPreview(null);
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Click to upload your avatar (optional)
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setForm({ ...form, image: file });
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white rounded-md py-2 font-semibold hover:bg-slate-800 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Comment"}
        </button>
      </form>
    </section>
  );
}
