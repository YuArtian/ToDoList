import "./GrassFooter.css";

export function GrassFooter() {
  return (
    <svg
      className="grass-footer"
      viewBox="0 0 320 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,14 L0,10 Q8,4 16,8 Q24,2 32,7 Q40,3 48,9 Q56,1 64,6 Q72,3 80,8 Q88,2 96,7 Q104,4 112,9 Q120,1 128,6 Q136,3 144,8 Q152,2 160,7 Q168,4 176,9 Q184,1 192,6 Q200,3 208,8 Q216,2 224,7 Q232,4 240,9 Q248,1 256,6 Q264,3 272,8 Q280,2 288,7 Q296,4 304,9 Q312,2 320,7 L320,14 Z"
        fill="var(--ghibli-grass)"
      />
      <path
        d="M0,14 L0,11 Q10,7 20,10 Q30,5 40,9 Q50,6 60,10 Q70,4 80,9 Q90,6 100,10 Q110,5 120,9 Q130,7 140,10 Q150,4 160,9 Q170,6 180,10 Q190,5 200,9 Q210,7 220,10 Q230,4 240,9 Q250,6 260,10 Q270,5 280,9 Q290,7 300,10 Q310,5 320,9 L320,14 Z"
        fill="var(--ghibli-grass-dark)"
        opacity="0.6"
      />
    </svg>
  );
}
