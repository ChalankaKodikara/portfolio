import { useEffect, useState } from "react";
import { readItems, readHero, writeHero } from "../lib/storage.js";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [hero, setHero] = useState(readHero());

  useEffect(() => {
    setItems(readItems());
  }, []);

  async function fileToDataUrl(file) {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

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

      {/* Dashboard Navigation Cards */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <a
          href="/admin/projects"
          className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
        >
          <div className="text-sm text-slate-500">Manage</div>
          <div className="mt-1 font-semibold">Projects</div>
        </a>
        <a
          href="/admin/experience"
          className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
        >
          <div className="text-sm text-slate-500">Manage</div>
          <div className="mt-1 font-semibold">Experience</div>
        </a>
        <a
          href="/admin/photos"
          className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
        >
          <div className="text-sm text-slate-500">Manage</div>
          <div className="mt-1 font-semibold">Photos</div>
        </a>
        <a
          href="/admin/comments"
          className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
        >
          <div className="text-sm text-slate-500">Manage</div>
          <div className="mt-1 font-semibold">Comments</div>
        </a>
      </div>

      {/* Hero Section Settings */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-semibold text-lg">Hero Section Settings</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
            placeholder="Intro text"
            value={hero.introText || ""}
            onChange={(e) => setHero({ ...hero, introText: e.target.value })}
          />

          {/* Upload Hero Image */}
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-600">
              Hero Image (upload)
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await fileToDataUrl(file);
                const next = { ...hero, heroImage: url };
                setHero(next);
                writeHero(next);
              }}
            />
          </div>

          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-white sm:col-span-2"
            type="button"
            onClick={() => writeHero(hero)}
          >
            Save Hero
          </button>
        </div>
      </div>

      {/* Quick Overview of Stored Items */}
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
