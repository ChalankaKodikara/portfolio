export default function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <a href="#home" className="font-semibold tracking-tight text-slate-900">YourName</a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-slate-900 text-slate-600 transition">About</a>
            <a href="#projects" className="hover:text-slate-900 text-slate-600 transition">Projects</a>
            <a href="#experience" className="hover:text-slate-900 text-slate-600 transition">Experience</a>
            <a href="#contact" className="hover:text-slate-900 text-slate-600 transition">Contact</a>
            <a href="/resume.pdf" className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800 transition">Resume</a>
          </nav>
        </div>
      </div>
    </header>
  )
}



