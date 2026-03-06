/**
 * Memphis-style geometric background decorations
 * Scattered shapes: circles, triangles, rectangles, dots, diamonds, lines
 */
export default function MemphisBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Large circle - top left */}
      <div
        className="absolute rounded-full border-[3px] border-black opacity-20"
        style={{ width: 120, height: 120, top: -30, left: -30 }}
      />
      {/* Filled circle - mint */}
      <div
        className="absolute rounded-full animate-float"
        style={{
          width: 48,
          height: 48,
          top: 60,
          right: 24,
          background: "oklch(0.88 0.10 160)",
          border: "2.5px solid black",
          animationDelay: "0s",
        }}
      />
      {/* Triangle - top right */}
      <div
        className="absolute animate-float2"
        style={{
          width: 0,
          height: 0,
          top: 140,
          right: 60,
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "34px solid oklch(0.85 0.12 290)",
          animationDelay: "0.5s",
          filter: "drop-shadow(2px 2px 0 black)",
        }}
      />
      {/* Small dots cluster - left */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute rounded-full bg-black"
          style={{
            width: 6,
            height: 6,
            top: 200 + Math.floor(i / 3) * 20,
            left: 16 + (i % 3) * 16,
            opacity: 0.25,
          }}
        />
      ))}
      {/* Lemon rectangle */}
      <div
        className="absolute animate-float"
        style={{
          width: 36,
          height: 20,
          top: 300,
          right: 30,
          background: "oklch(0.93 0.13 100)",
          border: "2.5px solid black",
          borderRadius: 4,
          animationDelay: "1s",
        }}
      />
      {/* Diamond - left middle */}
      <div
        className="absolute animate-float2"
        style={{
          width: 22,
          height: 22,
          top: 380,
          left: 20,
          background: "oklch(0.72 0.18 30)",
          border: "2.5px solid black",
          transform: "rotate(45deg)",
          animationDelay: "0.8s",
        }}
      />
      {/* Wavy line dots - bottom left */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute rounded-full bg-black"
          style={{
            width: 5,
            height: 5,
            bottom: 120 + i * 18,
            left: 30 + Math.sin(i) * 10,
            opacity: 0.2,
          }}
        />
      ))}
      {/* Circle outline - bottom right */}
      <div
        className="absolute rounded-full border-[3px] border-black opacity-15"
        style={{ width: 90, height: 90, bottom: 60, right: -20 }}
      />
      {/* Sky blue square */}
      <div
        className="absolute animate-spin-slow"
        style={{
          width: 28,
          height: 28,
          bottom: 180,
          right: 40,
          background: "oklch(0.82 0.10 220)",
          border: "2.5px solid black",
          borderRadius: 4,
        }}
      />
      {/* Small triangle - bottom left */}
      <div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          bottom: 200,
          left: 50,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: "20px solid oklch(0.88 0.10 160)",
          opacity: 0.6,
          filter: "drop-shadow(1px 1px 0 black)",
        }}
      />
      {/* Horizontal dashes */}
      <div
        className="absolute flex gap-2"
        style={{ top: 500, right: 16, opacity: 0.2 }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-black" style={{ width: 16, height: 3, borderRadius: 2 }} />
        ))}
      </div>
    </div>
  );
}
