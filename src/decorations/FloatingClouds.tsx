import "./FloatingClouds.css";

function Cloud({ size, top, delay }: { size: number; top: number; delay: number }) {
  return (
    <svg
      className="floating-cloud"
      style={{
        width: size,
        height: size * 0.55,
        top,
        animationDelay: `${delay}s`,
        animationDuration: `${30 + delay * 5}s`,
      }}
      viewBox="0 0 40 22"
      fill="currentColor"
    >
      <ellipse cx="20" cy="15" rx="18" ry="7" />
      <ellipse cx="14" cy="11" rx="10" ry="8" />
      <ellipse cx="26" cy="10" rx="8" ry="7" />
      <ellipse cx="20" cy="8" rx="7" ry="6" />
    </svg>
  );
}

export function FloatingClouds() {
  return (
    <div className="floating-clouds" aria-hidden="true">
      <Cloud size={18} top={4} delay={0} />
      <Cloud size={14} top={12} delay={8} />
      <Cloud size={11} top={6} delay={18} />
    </div>
  );
}
