import { useEffect, useState } from "react";

/**
 * TypeWriter Component
 * ---------------------
 * Features:
 * ✅ Supports multiple messages (auto looping)
 * ✅ Smooth typing and deleting animation
 * ✅ Customizable speed
 * ✅ Blinking cursor built-in
 */

export default function TypeWriter({
  texts = [
    "Hi, I'm Chalanka Kodikara",
    "I'm a Software Engineer and Graphic Designer",
  ],
  speed = 70,
  pause = 1500,
  className = "",
}) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (isDeleting) {
      // deleting
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length - 1));
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      // typing
      if (displayed.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, textIndex, texts, speed, pause]);

  return (
    <span className={`inline-block font-medium ${className}`}>
      {displayed}
      <span className="ml-0.5 inline-block w-[3px] h-6 bg-slate-900 animate-pulse align-[-2px]" />
    </span>
  );
}
