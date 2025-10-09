import BubbleField from "./BubbleField.jsx";
import TypeWriter from "./TypeWriter.jsx";
import myPhoto from "../assets/myphoto.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 sm:px-10 py-20 text-slate-900"
    >
      {/* ==== Left Content ==== */}
      <div className="relative z-10 max-w-xl text-center lg:text-left space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Software Engineer • Designer
        </p>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-tight font-[system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,sans-serif]">
          Hi, I'm{" "}
          <span className="italic font-serif text-slate-800 font-normal">
            Chalanka Kodikara
          </span>
          <br />a <span className="font-bold">Software Engineer</span>
        </h1>

        <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
          I craft scalable, high-performance software systems with a passion for
          clean design, seamless user experience, and reliable architecture.
        </p>

        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-5 py-2.5 font-semibold shadow-sm hover:bg-slate-800 transition"
          >
            🚀 View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            💬 Contact Me
          </a>
        </div>
      </div>

      {/* ==== Right Image Section ==== */}
      <div className="relative mt-12 lg:mt-0">
        {/* Colored blurred background blobs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-300/30 rounded-full blur-3xl"></div>

        {/* Photo container */}
        <div className="relative aspect-[4/5] w-72 sm:w-80 lg:w-96 overflow-hidden rounded-[2rem]  backdrop-blur-lg">
          <img
            src={myPhoto}
            alt="Chalanka Kodikara"
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
          />

          {/* floating shapes */}
          <div className="absolute -top-3 -right-3 w-10 h-10 border-4 border-yellow-400 rounded-full"></div>
          <div className="absolute bottom-8 -left-4 w-10 h-10 border-4 border-rose-400 rounded-full rotate-45"></div>
        </div>
      </div>
    </section>
  );
}
