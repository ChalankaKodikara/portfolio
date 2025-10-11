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

  // 🧠 Typewriter messages
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
          img.startsWith("http") ? img : `${API_BASE}${img}`
        )
      : [];

  // ✍️ Typewriter logic
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

  // 🎞️ Animations
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
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex flex-col-reverse lg:flex-row items-center justify-between 
                 max-w-7xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 lg:py-28 
                 text-slate-900 overflow-hidden"
    >
      {/* ==== LEFT CONTENT ==== */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeUp}
        className="relative z-10 max-w-lg text-center lg:text-left space-y-5 sm:space-y-6"
      >
        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-[0.7rem] sm:text-sm md:text-base uppercase tracking-[0.25em] text-slate-500"
        >
          Developer • Designer
        </motion.p>

        {/* Typewriter Text */}
        <motion.h1
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="mx-auto lg:mx-0 text-[1.8rem] sm:text-[2.3rem] md:text-5xl lg:text-6xl 
                     font-semibold tracking-tight leading-snug sm:leading-tight 
                     min-h-[3.5rem] sm:min-h-[5rem] md:min-h-[6rem]"
        >
          <span className="border-r-2 border-slate-800 pr-1 animate-pulse inline-block min-w-[16ch] text-center">
            {displayText}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.5 }}
          className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed 
                     max-w-sm sm:max-w-md mx-auto lg:mx-0"
        >
          {heroData.description ||
            "I build reliable, high-performance digital systems that blend clean architecture with purposeful design. My work focuses on crafting scalable web and mobile solutions engineered for performance, designed for users, and driven by real-world impact."}
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 pt-3 sm:pt-5"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white 
                       px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-semibold 
                       shadow-sm hover:bg-slate-800 transition"
          >
            🚀 View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 
                       px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-semibold 
                       text-slate-800 hover:bg-slate-50 transition"
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
        className="relative mb-10 lg:mb-0 w-full flex justify-center"
      >
        {/* Soft blobs */}
        <div
          className="absolute -top-10 -left-10 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 
                        bg-cyan-400/30 rounded-full blur-3xl"
        ></div>
        <div
          className="absolute bottom-0 right-0 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 
                        bg-fuchsia-300/30 rounded-full blur-3xl"
        ></div>

        {/* Image */}
        <div
          className="relative aspect-[4/5] w-52 sm:w-64 md:w-72 lg:w-96 overflow-hidden 
                        rounded-[1.75rem] sm:rounded-[2rem] backdrop-blur-lg shadow-lg"
        >
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
            className="absolute -top-3 -right-3 w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 
                       border-4 border-yellow-400 rounded-full"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <motion.div
            className="absolute bottom-8 -left-4 w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 
                       border-4 border-rose-400 rounded-full rotate-45"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        {/* Slider dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 absolute -bottom-10 left-1/2 -translate-x-1/2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => handleIndicatorClick(i)}
                className={`transition-all duration-300 ${
                  index === i
                    ? "w-7 h-3 rounded-full bg-slate-900"
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
