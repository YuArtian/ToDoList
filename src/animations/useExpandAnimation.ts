import { useCallback } from "react";
import gsap from "gsap";
import { EASE_ENTER, DURATION } from "./gsapConfig";

export function useExpandAnimation() {
  const animateExpand = useCallback((el: HTMLElement) => {
    gsap.fromTo(
      el,
      { height: 0, opacity: 0, overflow: "hidden" },
      { height: "auto", opacity: 1, duration: DURATION.normal, ease: EASE_ENTER }
    );
  }, []);

  const animateCollapse = useCallback((el: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        overflow: "hidden",
        duration: DURATION.fast,
        ease: "power2.in",
        onComplete: resolve,
      });
    });
  }, []);

  return { animateExpand, animateCollapse };
}
