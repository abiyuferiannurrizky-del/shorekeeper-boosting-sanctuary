import { Butterfly } from "./Butterfly";

// Deterministic layout so server and client render the same markup.
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 1 + (i % 3),
  delay: (i * 1.7) % 14,
  duration: 14 + ((i * 5) % 12),
}));

export function Atmosphere({ butterflies = true }: { butterflies?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="wave-layer absolute -bottom-10 left-0 h-48 w-[120%] text-glow" style={{ animation: "wave 12s ease-in-out infinite" }} viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 120 Q150 80 300 120 T600 120 T900 120 T1200 120" stroke="currentColor" strokeOpacity="0.25" fill="none" />
        <path d="M0 150 Q150 110 300 150 T600 150 T900 150 T1200 150" stroke="currentColor" strokeOpacity="0.15" fill="none" />
      </svg>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute bottom-0 rounded-full bg-primary"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 6px var(--glow)",
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
      {butterflies && (
        <>
          <Butterfly className="animate-flutter absolute left-[8%] top-[22%] h-8 w-10 opacity-60" />
          <Butterfly className="animate-flutter absolute left-[42%] top-[12%] h-5 w-7 opacity-40 [animation-delay:2s]" />
          <Butterfly className="animate-flutter absolute bottom-[18%] left-[30%] h-6 w-8 opacity-50 [animation-delay:4s]" />
        </>
      )}
    </div>
  );
}

export function OrnamentDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
      <span className="ornament-line flex-1" />
      <span className="h-1.5 w-1.5 rotate-45 border border-primary" />
      {label && <span>{label}</span>}
      {label && <span className="h-1.5 w-1.5 rotate-45 border border-primary" />}
      <span className="ornament-line flex-1" />
    </div>
  );
}
