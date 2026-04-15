import { useCallback } from "react";
import gsap from "gsap";
import { EASE_ENTER, EASE_EXIT, DURATION } from "./gsapConfig";

export function useTodoAnimations() {
  const animateAdd = useCallback((el: HTMLElement) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 12, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: DURATION.normal, ease: EASE_ENTER }
    );
  }, []);

  const animateRemove = useCallback((el: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      gsap.to(el, {
        opacity: 0,
        x: -30,
        height: 0,
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: DURATION.normal,
        ease: EASE_EXIT,
        onComplete: resolve,
      });
    });
  }, []);

  const animateComplete = useCallback((item: HTMLElement, checkbox: HTMLElement) => {
    // Checkbox pop
    gsap.fromTo(
      checkbox,
      { scale: 1 },
      { scale: 1.35, duration: DURATION.fast, ease: EASE_ENTER, yoyo: true, repeat: 1 }
    );
    // Row green flash to make completion obvious across the whole row
    const row = item.querySelector<HTMLElement>(".todo-row");
    if (row) {
      gsap.fromTo(
        row,
        { backgroundColor: "rgba(139, 191, 110, 0.4)" },
        {
          backgroundColor: "rgba(139, 191, 110, 0)",
          duration: DURATION.slow,
          ease: "power2.out",
          clearProps: "backgroundColor",
        }
      );
    }
  }, []);

  return { animateAdd, animateRemove, animateComplete };
}
