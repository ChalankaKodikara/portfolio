import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Globe,
} from "lucide-react";

export default function Footer() {
  // 🔹 Smooth scroll helper
  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 text-slate-700">
        {/* === Top Section === */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* 📧 Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Contact</h3>
            <FooterItem
              icon={<Mail size={18} />}
              text="ischalankakodikara@gmail.com"
              href="mailto:ischalankakodikara@gmail.com"
            />
            <FooterItem
              icon={<Phone size={18} />}
              text="+94 719550343"
              href="tel:+94719550343"
            />
            <FooterItem icon={<MapPin size={18} />} text="Colombo, Sri Lanka" />
          </div>

          {/* 🌐 Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("#home")}
                  className="hover:text-blue-600 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#projects")}
                  className="hover:text-blue-600 transition"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#experience")}
                  className="hover:text-blue-600 transition"
                >
                  Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="hover:text-blue-600 transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* 🔗 Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Connect</h3>
            <div className="flex items-center gap-4 mt-2">
              <SocialLink
                href="https://github.com/ChalankaKodikara"
                icon={<Github size={20} />}
                label="GitHub"
              />
              <SocialLink
                href="https://www.linkedin.com/in/chalanka-kodikara-ab1a23194/"
                icon={<Linkedin size={20} />}
                label="LinkedIn"
              />
              <SocialLink
                href="https://www.instagram.com/iitsschalaa/"
                icon={<Instagram size={20} />}
                label="Instagram"
              />
              <SocialLink
                href="https://www.threads.net/@iitsschalaa"
                icon={<Globe size={20} />}
                label="Threads"
              />
            </div>
          </div>
        </div>

        {/* === Bottom Section === */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-slate-700">
              Chalanka Kodikara
            </span>
            . All rights reserved.
          </p>

          <div className="mt-4 sm:mt-0">
            <a
              href="/files/cv.pdf"
              download="Chalanka_Kodikara_CV.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 font-medium text-sm shadow-sm hover:bg-blue-700 transition"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* 🔹 Footer Contact Item */
function FooterItem({ icon, text, href }) {
  const content = (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-600">{icon}</span>
      <span className="text-slate-700 hover:text-blue-600 transition">
        {text}
      </span>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

/* 🔹 Footer Social Icon */
function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 rounded-full border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-600 transition"
    >
      {icon}
    </a>
  );
}
