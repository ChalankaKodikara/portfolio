import { useEffect, useMemo, useState } from 'react'
import { readItems } from '../lib/storage.js'

export default function ProjectDetail({ id }) {
  const [items, setItems] = useState([])
  useEffect(() => setItems(readItems()), [])
  const item = useMemo(() => items.find(i => i.id === id), [items, id])

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <p className="text-slate-600">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="text-xs uppercase tracking-wide text-slate-500">{item.category}</div>
      <h1 className="mt-1 text-3xl font-bold">{item.title}</h1>
      {item.link ? <a className="text-slate-900 underline" href={item.link} target="_blank" rel="noreferrer">Visit</a> : null}

      {item.images?.length ? (
        <>
          {/* Hero main image */}
          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-black/5">
            <img src={item.images[0]} alt="" className="w-full object-cover aspect-[21/9]" />
          </div>
          {/* Slider thumbnails */}
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {item.images.slice(1).map((src, i) => (
              <img key={i} src={src} alt="" className="h-28 w-auto rounded-md object-cover" />
            ))}
          </div>
        </>
      ) : null}

      <p className="mt-6 text-slate-700">{item.description}</p>

      {item.technologies?.length ? (
        <div className="mt-6">
          <h2 className="font-semibold">Technologies</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {item.technologies.map((t, i) => (
              <span key={i} className="rounded-full border border-slate-300 px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
      ) : null}

      {item.features?.length ? (
        <div className="mt-6">
          <h2 className="font-semibold">Features</h2>
          <ul className="mt-2 list-disc pl-5 text-slate-700">
            {item.features.map((f, i) => (<li key={i}>{f}</li>))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}


