export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-900" href="#">GitHub</a>
          <a className="hover:text-slate-900" href="#">LinkedIn</a>
          <a className="hover:text-slate-900" href="#">Twitter</a>
        </div>
      </div>
    </footer>
  )
}



