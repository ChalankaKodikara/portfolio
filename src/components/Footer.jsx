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
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-slate-700">
        {/* === Top Section: Contact Info + Socials === */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {/* 📧 Contact Info */}
          <div className="space-y-3">
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-blue-600 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-blue-600 transition">
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="hover:text-blue-600 transition"
                >
                  Experience
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-600 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* 🔗 Social Media */}
          <div className="space-y-3">
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

        {/* === Bottom Section: Copyright === */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-slate-700">
              Chalanka Kodikara
            </span>
            . All rights reserved.
          </p>

          <div className="mt-3 sm:mt-0">
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

// 🔹 Small reusable contact item
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

// 🔹 Small social link icon
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
