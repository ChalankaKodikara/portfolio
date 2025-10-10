import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000/api";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [hero, setHero] = useState({
    texts: ["", ""],
    description: "",
    images: [],
  });

  // 🧠 Load initial data
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("portfolio_items") || "[]");
    setItems(stored);

    fetch(`${API_BASE}/hero`)
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch((err) => console.error("Error loading hero:", err));
  }, []);

  // 💾 Save hero data
  const saveHero = async (data) => {
    setHero(data);
    try {
      await fetch(`${API_BASE}/hero`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Error saving hero:", err);
    }
  };

  // 🧩 Update texts & description
  const updateText = (index, value) => {
    const next = [...(hero.texts || [])];
    next[index] = value;
    saveHero({ ...hero, texts: next });
  };

  const updateDescription = (value) => {
    saveHero({ ...hero, description: value });
  };

  // 📸 Upload multiple hero images (with live preview)
  const uploadMultipleImages = async (files) => {
    if (!files || !files.length) return;

    // Temporary previews before upload
    const previews = Array.from(files).map((f) => URL.createObjectURL(f));
    const tempPreviews = [...(hero.images || []), ...previews];
    setHero((prev) => ({ ...prev, images: tempPreviews }));

    // Upload to backend
    const formData = new FormData();
    for (const file of files) formData.append("images", file);

    try {
      const res = await fetch(`${API_BASE}/hero/upload-multiple`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        // Replace temporary previews with actual server URLs
        const finalUrls = [
          ...(hero.images || []).filter((img) => img.startsWith("/uploads")),
          ...data.urls,
        ];
        saveHero({ ...hero, images: finalUrls });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // 🗑 Remove image (client + server)
  const removeImage = async (index) => {
    const imageUrl = hero.images[index];
    const filename = imageUrl.split("/").pop();

    try {
      await fetch(`${API_BASE}/hero/image/${filename}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting image:", err);
    }

    const next = hero.images.filter((_, i) => i !== index);
    saveHero({ ...hero, images: next });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          className="rounded-md border border-slate-300 px-3 py-1.5"
          onClick={() => {
            localStorage.removeItem("ck_auth_v1");
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
        >
          Logout
        </button>
      </div>
      <p className="text-slate-600">
        Manage your portfolio content and settings
      </p>

      {/* Navigation */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          ["projects", "Projects"],
          ["experience", "Experience"],
          ["photos", "Photos"],
          ["comments", "Comments"],
        ].map(([path, label]) => (
          <a
            key={path}
            href={`/admin/${path}`}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition"
          >
            <div className="text-sm text-slate-500">Manage</div>
            <div className="mt-1 font-semibold">{label}</div>
          </a>
        ))}
      </div>

      {/* 🦸 Hero Section */}
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Hero Section Settings</h2>

        {/* Typewriter Texts */}
        <div className="grid gap-3 mb-6">
          <label className="text-sm text-slate-600">Typewriter Texts</label>
          <input
            type="text"
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="First text (e.g. Hi, I'm Chalanka Kodikara)"
            value={hero.texts?.[0] || ""}
            onChange={(e) => updateText(0, e.target.value)}
          />
          <input
            type="text"
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Second text (e.g. I'm a Software Engineer and Designer)"
            value={hero.texts?.[1] || ""}
            onChange={(e) => updateText(1, e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-sm text-slate-600 mb-1">
            Hero Description
          </label>
          <textarea
            rows={3}
            className="rounded-md border border-slate-300 px-3 py-2 w-full"
            placeholder="Write a short introduction for your hero section..."
            value={hero.description || ""}
            onChange={(e) => updateDescription(e.target.value)}
          />
        </div>

        {/* Multiple Image Uploads */}
        <label className="text-sm text-slate-600 mb-2 block">
          Hero Slider Images (Preview & Manage)
        </label>

        {/* Image grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {hero.images?.length > 0 ? (
            hero.images.map((img, i) => (
              <div
                key={i}
                className="relative border border-slate-200 rounded-lg p-3 bg-slate-50 text-center"
              >
                <img
                  src={
                    img.startsWith("/uploads")
                      ? `http://localhost:4000${img}`
                      : img
                  }
                  alt={`Hero ${i + 1}`}
                  className="rounded-md w-full aspect-[4/5] object-cover"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs rounded-md px-2 py-1 hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-sm">No images uploaded yet</div>
          )}
        </div>

        {/* Upload input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => uploadMultipleImages(e.target.files)}
          className="text-sm mb-4"
        />

        <button
          onClick={() => saveHero(hero)}
          className="rounded-md bg-slate-900 text-white px-4 py-2 font-medium hover:bg-slate-800 transition"
        >
          💾 Save Hero
        </button>
      </div>

      {/* Quick Overview */}
      <div className="mt-10">
        <h2 className="font-semibold mb-3">Recent Items Overview</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 6).map((it) => (
            <div
              key={it.id}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition"
            >
              <div className="text-xs uppercase tracking-wide text-slate-500">
                {it.category}
              </div>
              <h3 className="mt-1 font-semibold">{it.title}</h3>
              {it.images?.length ? (
                <img
                  src={Array.isArray(it.images) ? it.images[0] : it.images}
                  alt=""
                  className="mt-2 rounded-md object-cover aspect-video"
                />
              ) : null}
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                {it.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
