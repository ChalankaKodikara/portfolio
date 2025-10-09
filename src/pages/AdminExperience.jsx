import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [lastLogo, setLastLogo] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    company: "",
    summary: "",
    startDate: "",
    endDate: "",
    present: false,
    logoFile: null,
  });

  const API = "http://localhost:4000/api/experience";

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setItems(data.reverse()))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      id: Date.now().toString(),
      title: form.title,
      company: form.company,
      summary: form.summary,
      startDate: form.startDate,
      endDate: form.present ? "Present" : form.endDate,
      present: form.present,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (form.logoFile) formData.append("image", form.logoFile);

    const res = await fetch(API, { method: "POST", body: formData });
    const result = await res.json();

    if (result.success) {
      setItems((prev) => [{ ...payload, companyLogo: result.logo }, ...prev]);
      if (form.logoFile) setLastLogo(URL.createObjectURL(form.logoFile));
      setForm({
        title: "",
        company: "",
        summary: "",
        startDate: "",
        endDate: "",
        present: false,
        logoFile: null,
      });
      fileInputRef.current.value = null;
    }
  }

  async function onRemove(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setForm({ ...form, logoFile: file });
  };

  const handleDragOver = (e) => e.preventDefault();

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ size: [] }, { color: [] }],
      ["link", "clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "size",
    "color",
    "link",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Experience Management</h1>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-md border border-slate-300 px-3 py-2"
          placeholder="Role / Position"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="rounded-md border border-slate-300 px-3 py-2"
          placeholder="Company Name"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />

        <input
          type="month"
          className="rounded-md border border-slate-300 px-3 py-2"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          type="month"
          disabled={form.present}
          className="rounded-md border border-slate-300 px-3 py-2"
          value={form.present ? "" : form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.present}
            onChange={(e) =>
              setForm({
                ...form,
                present: e.target.checked,
                endDate: e.target.checked ? "" : form.endDate,
              })
            }
          />
          Currently Working
        </label>

        <div className="sm:col-span-2">
          <label className="text-sm text-slate-600 mb-1 block">
            Company Logo
          </label>
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {form.logoFile ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={URL.createObjectURL(form.logoFile)}
                  alt="Logo"
                  className="h-20 w-20 rounded-md object-cover ring-1 ring-slate-200"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm({ ...form, logoFile: null });
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
                if (file) setForm({ ...form, logoFile: file });
              }}
            />
          </div>

          {lastLogo && !form.logoFile && (
            <button
              type="button"
              className="mt-2 text-xs text-blue-600 underline"
              onClick={() => setForm({ ...form, logoFile: lastLogo })}
            >
              Reuse last uploaded logo
            </button>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-slate-600 mb-1 block">Summary</label>
          <ReactQuill
            theme="snow"
            modules={quillModules}
            formats={quillFormats}
            value={form.summary}
            onChange={(v) => setForm({ ...form, summary: v })}
            placeholder="Write your summary here..."
            className="bg-white rounded-md"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-white"
          >
            Add Experience
          </button>
        </div>
      </form>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {it.companyLogo ? (
                <img
                  src={`http://localhost:4000${it.companyLogo}`}
                  alt={it.title}
                  className="h-10 w-10 rounded-md object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="h-10 w-10 bg-slate-100 rounded-md" />
              )}
              <div>
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-xs text-slate-500">
                  {it.startDate} – {it.present ? "Present" : it.endDate}
                </p>
                <p className="text-xs text-slate-600">{it.company}</p>
              </div>
              <button
                className="ml-auto text-red-600 text-sm"
                onClick={() => onRemove(it.id)}
              >
                Delete
              </button>
            </div>

            <div
              className="experience-summary mt-3 text-sm text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: it.summary }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
