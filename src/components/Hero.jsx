import { useEffect, useState } from "react";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    texts: ["", ""],
    description: "",
    images: [],
  });
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typingPhase, setTypingPhase] = useState("typing");
  const [messageIndex, setMessageIndex] = useState(0);

  const API_BASE = "http://localhost:4000/api";

  // 🔹 Fetch hero data from backend
  useEffect(() => {
    fetch(`${API_BASE}/hero`)
      .then((res) => res.json())
      .then((data) => setHeroData(data))
      .catch((err) => console.error("Error loading hero:", err));
  }, []);

  const messages = heroData.texts?.length
    ? heroData.texts
    : [
        "Hi, I'm Chalanka Kodikara",
        "I'm a Software Engineer and Graphic Designer",
      ];
const images = heroData.images?.length
  ? heroData.images.map((img) => `http://localhost:4000${img}`)
  : [];

  // 🧠 Typewriter logic
  useEffect(() => {
    if (!messages.length) return;
    let timeout;

    if (typingPhase === "typing") {
      if (displayText.length < messages[messageIndex].length) {
        timeout = setTimeout(() => {
          setDisplayText(
            messages[messageIndex].slice(0, displayText.length + 1)
          );
        }, 90);
      } else {
        timeout = setTimeout(() => setTypingPhase("deleting"), 2000);
      }
    } else if (typingPhase === "deleting") {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(
            messages[messageIndex].slice(0, displayText.length - 1)
          );
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % messages.length);
          setTypingPhase("typing");
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, typingPhase, messageIndex, messages]);

  // 🔁 Image auto-slide
  useEffect(() => {
    if (!images.length) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      5000
    );
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section
      id="home"
      className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 sm:px-10 py-20 text-slate-900 overflow-hidden"
    >
      {/* ==== Left Content ==== */}
      <div className="relative z-10 max-w-xl text-center lg:text-left space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Software Engineer • Designer
        </p>

        {/* 🔹 Dynamic Typewriter */}
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-tight font-[system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,sans-serif]">
          <span className="border-r-2 border-slate-800 pr-1 animate-pulse">
            {displayText}
          </span>
        </h1>

        {/* 🔹 Description from backend */}
        <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
          {heroData.description ||
            "I craft scalable, high-performance software systems with a passion for clean design, seamless user experience, and reliable architecture."}
        </p>

        {/* 🔹 Buttons */}
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

      {/* ==== Right Image Slider ==== */}
      <div className="relative mt-12 lg:mt-0">
        {/* Blurred accent blobs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-300/30 rounded-full blur-3xl"></div>

        {/* Image container */}
        <div className="relative aspect-[4/5] w-72 sm:w-80 lg:w-96 overflow-hidden rounded-[2rem] backdrop-blur-lg shadow-lg">
          {images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Slide ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm bg-slate-100">
              No images
            </div>
          )}

          {/* floating accents */}
          <div className="absolute -top-3 -right-3 w-10 h-10 border-4 border-yellow-400 rounded-full"></div>
          <div className="absolute bottom-8 -left-4 w-10 h-10 border-4 border-rose-400 rounded-full rotate-45"></div>
        </div>

        {/* 🔹 Custom Slider Indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`transition-all duration-300 ${
                  index === i
                    ? "w-8 h-3 rounded-full bg-slate-900"
                    : "w-3 h-3 rounded-full bg-slate-400/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
