import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ScrollAnimator({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true, 
      easing: "ease-out-cubic",
      offset: 80, 
    });
  }, []);

  return <>{children}</>;
}
