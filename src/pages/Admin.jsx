import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000/api";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [hero, setHero] = useState({
    texts: ["", ""],
    description: "",
    images: [],
  });

  // Fetch items (optional local storage for quick overview)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("portfolio_items") || "[]");
    setItems(stored);
  }, []);

  // 🧠 Load Hero data from backend
  useEffect(() => {
    fetch(`${API_BASE}/hero`)
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch((err) => console.error("Error loading hero:", err));
  }, []);

  // 💾 Save hero data (text, description, images)
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

  // 🧩 Update text fields
  const updateText = (index, value) => {
    const nextTexts = [...(hero.texts || [])];
    nextTexts[index] = value;
    saveHero({ ...hero, texts: nextTexts });
  };

  // 🧩 Update description
  const updateDescription = (value) => {
    saveHero({ ...hero, description: value });
  };

  // 📸 Handle image uploads
  const updateImage = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API_BASE}/hero/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const nextImages = [...(hero.images || [])];
      nextImages[index] = data.url;
      saveHero({ ...hero, images: nextImages });
    } catch (err) {
      console.error("Image upload failed:", err);
    }
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

      {/* 🦸 Hero Section Settings */}
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Hero Section Settings</h2>

        {/* Text Fields */}
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
            placeholder="Second text (e.g. I'm a Software Engineer and Graphic Designer)"
            value={hero.texts?.[1] || ""}
            onChange={(e) => updateText(1, e.target.value)}
          />
        </div>

        {/* 🆕 Hero Description Field */}
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

        {/* Image Uploads */}
        <label className="text-sm text-slate-600 mb-2 block">
          Hero Images (3 for the slider)
        </label>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-center"
            >
              {hero.images?.[i] ? (
                <img
                  src={`http://localhost:4000${hero.images[i]}`}
                  alt={`Hero ${i + 1}`}
                  className="rounded-md w-full aspect-[4/5] object-cover mb-2"
                />
              ) : (
                <div className="aspect-[4/5] rounded-md bg-slate-200 flex items-center justify-center text-slate-500 text-sm mb-2">
                  No Image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateImage(i, e.target.files?.[0])}
                className="text-xs"
              />
            </div>
          ))}
        </div>

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
