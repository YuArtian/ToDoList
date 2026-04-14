import { useCallback } from "react";
import gsap from "gsap";

const PARTICLE_COUNT = 5;

function createStar(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("width", "8");
  svg.setAttribute("height", "8");
  svg.style.position = "absolute";
  svg.style.pointerEvents = "none";

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M10 0l2.4 7.6H20l-6.2 4.5 2.4 7.6L10 15.2 3.8 19.7l2.4-7.6L0 7.6h7.6z");
  path.setAttribute("fill", "#EDA65D");
  svg.appendChild(path);

  return svg;
}

export function useSparkle() {
  const emit = useCallback((origin: HTMLElement) => {
    const rect = origin.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const star = createStar();
      star.style.left = `${cx}px`;
      star.style.top = `${cy}px`;
      star.style.zIndex = "9999";
      document.body.appendChild(star);
      return star;
    });

    particles.forEach((star) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 20;

      gsap.fromTo(
        star,
        { scale: 0, opacity: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: 0.6 + Math.random() * 0.6,
          opacity: 0,
          duration: 0.4 + Math.random() * 0.2,
          ease: "power2.out",
          onComplete: () => star.remove(),
        }
      );
    });
  }, []);

  return emit;
}
