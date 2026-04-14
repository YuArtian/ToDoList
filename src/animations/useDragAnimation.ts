import { useCallback } from "react";
import gsap from "gsap";
import { EASE_ENTER, DURATION } from "./gsapConfig";

export function useDragAnimation() {
  const animateDragStart = useCallback((el: HTMLElement) => {
    gsap.to(el, {
      scale: 1.03,
      boxShadow: "0 6px 20px rgba(61, 53, 41, 0.15)",
      duration: DURATION.fast,
      ease: "power2.out",
    });
  }, []);

  const animateDragEnd = useCallback((el: HTMLElement) => {
    gsap.to(el, {
      scale: 1,
      boxShadow: "0 0px 0px rgba(61, 53, 41, 0)",
      duration: DURATION.normal,
      ease: EASE_ENTER,
    });
  }, []);

  return { animateDragStart, animateDragEnd };
}
