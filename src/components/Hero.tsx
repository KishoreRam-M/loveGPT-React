import { Heart } from "lucide-react";
import { useMemo } from "react";

const FloatingHearts = () => {
  const hearts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 12,
        size: 12 + Math.random() * 20,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h) => (
        <Heart
          key={h.id}
          className="absolute animate-float-heart text-primary fill-primary"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            bottom: "-20px",
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(280 60% 12%) 0%, hsl(270 60% 7%) 50%, hsl(260 50% 5%) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 80%, hsl(340 80% 20%) 0%, transparent 50%)",
        }}
      />

      <FloatingHearts />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-foreground">LoveGPT</span>{" "}
          <span className="text-primary">Tamil</span>{" "}
          <span className="text-primary">❤️</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          AI-powered relationship strategist that transforms your love story
          into a winning plan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() =>
              document
                .getElementById("story-input")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="glow-button text-lg"
          >
            <Heart className="inline mr-2 h-5 w-5" /> Start Your Story
          </button>
          <button
            onClick={() =>
              document
                .getElementById("user-guide")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 rounded-xl border border-border/60 text-foreground font-semibold hover:bg-secondary/50 transition-all duration-300"
          >
            Learn How It Works
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
