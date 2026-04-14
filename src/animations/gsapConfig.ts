import gsap from "gsap";

gsap.defaults({
  ease: "power2.out",
  duration: 0.35,
});

export const EASE_ENTER = "back.out(1.4)";
export const EASE_EXIT = "power2.in";
export const EASE_BOUNCE = "elastic.out(1, 0.5)";

export const DURATION = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
} as const;
