import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  // 🧠 Scroll tracking for active link highlight
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const onScroll = () => {
      const scrollPos = window.scrollY + 150;
      sections.forEach((section) => {
        if (
          section.offsetTop <= scrollPos &&
          section.offsetTop + section.offsetHeight > scrollPos
        ) {
          setActive(section.getAttribute("id"));
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🧩 Smooth scroll to section
  const scrollTo = (id) => {
    setMenuOpen(false);
    const section = document.querySelector(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Name */}
          <a
            href="#home"
            onClick={() => scrollTo("#home")}
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-blue-600 transition"
          >
            Chalanka.
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[ 
              ["#home", "Home"],
              ["#projects", "Projects"],
              ["#experience", "Experience"],
              ["#contact", "Contact"],
            ].map(([link, label]) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className={`relative transition ${
                  active === link.slice(1)
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-blue-600 transition-all duration-300 ${
                    active === link.slice(1)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
            ))}

            {/* Resume Download Button */}
            <a
              href="/files/cv.pdf"
              download="Chalanka_Kodikara_CV.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Download CV
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur border-t border-slate-200 py-4 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-sm font-medium">
            {[
              ["#home", "Home"],
              ["#projects", "Projects"],
              ["#experience", "Experience"],
              ["#contact", "Contact"],
            ].map(([link, label]) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className={`transition ${
                  active === link.slice(1)
                    ? "text-blue-600 font-semibold"
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            ))}

            <a
              href="/files/cv.pdf"
              download="Chalanka_Kodikara_CV.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
