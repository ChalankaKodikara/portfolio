import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

  const API_BASE = "https://back-chalanka.casknet.dev/api";

  // 🧩 Fetch hero data
  useEffect(() => {
    fetch(`${API_BASE}/hero`)
      .then((res) => res.json())
      .then((data) => setHeroData(data))
      .catch((err) => console.error("Error loading hero:", err));
  }, []);

  // 🧠 Messages for typewriter
  const messages = heroData.texts?.length
    ? heroData.texts
    : [
        "Hi, I'm Chalanka Kodikara",
        "I'm a Software Engineer and Graphic Designer",
      ];

  // 🖼️ Image list
  const images =
    heroData.images?.length > 0
      ? heroData.images.map((img) =>
          img.startsWith("http") ? img : `https://back-chalanka.casknet.dev${img}`
        )
      : [];

  // ✍️ Typewriter Effect
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

  // 🔁 Auto image change
  useEffect(() => {
    if (!images.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleIndicatorClick = (i) => setIndex(i);

  // 🎞️ Animation setup
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 sm:px-10 py-20 lg:py-28 text-slate-900 overflow-hidden"
    >
      {/* ==== LEFT CONTENT ==== */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeUp}
        className="relative z-10 max-w-xl text-center lg:text-left space-y-6"
      >
        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-500"
        >
          Developer• Designer
        </motion.p>

        {/* 🧠 Typewriter Heading with fixed space */}
        <motion.h1
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight min-h-[4.5rem] sm:min-h-[5rem] md:min-h-[6rem]"
        >
          <span className="border-r-2 border-slate-800 pr-1 animate-pulse inline-block min-w-[20ch] text-center">
            {displayText}
          </span>
        </motion.h1>

        {/* ✍️ Description */}
        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.5 }}
          className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
        >
          {heroData.description ||
            "I craft scalable, high-performance software systems with a passion for clean design, seamless user experience, and reliable architecture."}
        </motion.p>

        {/* 🔹 Buttons */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 pt-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm sm:text-base font-semibold shadow-sm hover:bg-slate-800 transition"
          >
            🚀 View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm sm:text-base font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            💬 Contact Me
          </a>
        </motion.div>
      </motion.div>

      {/* ==== RIGHT IMAGE SLIDER ==== */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeLeft}
        className="relative mt-12 lg:mt-0 w-full flex justify-center"
      >
        {/* Accent blobs */}
        <div className="absolute -top-10 -left-10 w-60 sm:w-72 h-60 sm:h-72 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-56 sm:w-64 h-56 sm:h-64 bg-fuchsia-300/30 rounded-full blur-3xl"></div>

        {/* Image container */}
        <div className="relative aspect-[4/5] w-64 sm:w-72 md:w-80 lg:w-96 overflow-hidden rounded-[2rem] backdrop-blur-lg shadow-lg">
          {images.length > 0 ? (
            images.map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt={`Slide ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                animate={{ opacity: index === i ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm bg-slate-100">
              No images
            </div>
          )}

          {/* Floating accents */}
          <motion.div
            className="absolute -top-3 -right-3 w-8 sm:w-10 h-8 sm:h-10 border-4 border-yellow-400 rounded-full"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <motion.div
            className="absolute bottom-8 -left-4 w-8 sm:w-10 h-8 sm:h-10 border-4 border-rose-400 rounded-full rotate-45"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        {/* 🔹 Slider Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 absolute -bottom-10 left-1/2 -translate-x-1/2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => handleIndicatorClick(i)}
                className={`transition-all duration-300 ${
                  index === i
                    ? "w-8 h-3 rounded-full bg-slate-900"
                    : "w-3 h-3 rounded-full bg-slate-400/50 hover:bg-slate-600/70"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
