export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Let’s work together</h2>
        <p className="mt-2 text-slate-600">Have a project in mind or just want to say hi?</p>
        <form className="mt-6 grid gap-4 sm:grid-cols-2">
          <input className="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:col-span-1" placeholder="Name" />
          <input className="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:col-span-1" placeholder="Email" />
          <textarea className="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:col-span-2" rows={4} placeholder="Message" />
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition">Send</button>
          </div>
        </form>
      </div>
    </section>
  )
}



