export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-slate-900"
            href="https://github.com/ChalankaKodikara"
          >
            GitHub
          </a>
          <a
            className="hover:text-slate-900"
            href="https://www.linkedin.com/in/chalanka-kodikara-ab1a23194/"
          >
            LinkedIn
          </a>
          <a
            className="hover:text-slate-900"
            href="https://www.instagram.com/iitsschalaa/"
          >
            Instagram
          </a>
          <a
            className="hover:text-slate-900"
            href="https://www.threads.com/@iitsschalaa?xmt=AQF0bbgKcRPkSDr82ktN9JgiaDyOALLMY4mcJYCzZqgl1yI"
          >
            Threads
          </a>
        </div>
      </div>
    </footer>
  );
}
