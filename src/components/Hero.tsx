import { Heart, ChevronDown, Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   HERO — Design System Implementation
   Uses: ds-badge, ds-btn-primary, ds-btn-ghost, ds-badge-dot,
         ds-section, ds-divider, ds-orb
═══════════════════════════════════════════════════════════════ */

const Hero = () => {
  const scrollToStory = () => {
    const el = document.getElementById("story-input");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToGuide = () => {
    const el = document.getElementById("user-guide");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        .hero-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          overflow: hidden;
          text-align: center;
        }

        /* Ambient orbs */
        .hero-orb-crimson {
          position: absolute;
          width: 560px; height: 560px;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(140,10,30,0.30) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          animation: orbFlicker 10s ease-in-out infinite alternate;
        }
        .hero-orb-velvet {
          position: absolute;
          width: 400px; height: 400px;
          bottom: 80px; right: -80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,45,94,0.16) 0%, transparent 70%);
          filter: blur(70px);
          pointer-events: none;
          animation: orbFlicker 12s 2s ease-in-out infinite alternate;
        }
        .hero-orb-gold {
          position: absolute;
          width: 320px; height: 320px;
          bottom: 60px; left: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180,140,40,0.08) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          animation: orbFlicker 14s 4s ease-in-out infinite alternate;
        }

        /* Brand title */
        .hero-brand-line1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(52px, 9vw, 96px);
          font-weight: 700;
          line-height: 1.0;
          background: linear-gradient(135deg, #f9c0c8 0%, #e8507a 30%, #c41e3a 60%, #a31428 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
          letter-spacing: -1px;
        }
        .hero-brand-line2 {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(42px, 7vw, 80px);
          color: #d4a853;
          line-height: 1.1;
          filter: drop-shadow(0 0 20px rgba(212,168,83,0.35));
        }

        /* Divider */
        .hero-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 24px 0;
        }
        .hero-divider-line {
          height: 1px;
          width: 64px;
          background: linear-gradient(90deg, transparent, rgba(196,30,58,0.5), transparent);
        }
        .hero-divider-heart {
          color: #d4a853;
          font-size: 13px;
          filter: drop-shadow(0 0 6px rgba(212,168,83,0.5));
        }

        /* Subtitle */
        .hero-subtitle {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: clamp(16px, 2.2vw, 20px);
          font-style: italic;
          color: #a07070;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto 32px;
          animation: fadeUp 0.8s 0.3s var(--ease-out) both;
        }

        /* CTA row */
        .hero-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 52px;
          flex-wrap: wrap;
          animation: fadeUp 0.8s 0.5s var(--ease-out) both;
        }

        /* Stat pills */
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          animation: fadeUp 0.8s 0.7s var(--ease-out) both;
        }
        .hero-stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(196, 30, 58, 0.04);
          border: 1px solid rgba(196, 30, 58, 0.12);
          transition: all 0.25s ease;
          cursor: default;
        }
        .hero-stat-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .hero-stat-label {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        .hero-stat-desc {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13px;
          color: #6b3a3a;
        }

        /* Scroll cue */
        .hero-scroll-cue {
          position: absolute;
          bottom: 32px; left: 50%;
          transform: translateX(-50%);
          color: rgba(196,30,58,0.35);
          animation: scrollBounce 2.5s ease-in-out infinite;
          cursor: pointer;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.35; }
          50%       { transform: translateX(-50%) translateY(6px); opacity: 0.65; }
        }

        @keyframes orbFlicker {
          0%   { opacity: 0.8; transform: translateX(-50%) scale(0.94); }
          100% { opacity: 1.0; transform: translateX(-50%) scale(1.12); }
        }

        /* badge animation */
        .hero-badge {
          animation: fadeDown 0.7s var(--ease-out) both;
          margin-bottom: 20px;
        }
        .hero-title-wrap {
          animation: scaleIn 0.8s 0.15s var(--ease-out) both;
          margin-bottom: 0;
        }
      `}</style>

      <section className="hero-root">
        {/* Ambient light */}
        <div className="hero-orb-crimson" />
        <div className="hero-orb-velvet" />
        <div className="hero-orb-gold" />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 680, width: "100%" }}>

          {/* Badge */}
          <div className="hero-badge" style={{ display: "flex", justifyContent: "center" }}>
            <div className="ds-badge">
              <span className="ds-badge-dot" />
              AI Love Strategist
            </div>
          </div>

          {/* Brand name */}
          <div className="hero-title-wrap">
            <div className="hero-brand-line1">LoveGPT</div>
            <div className="hero-brand-line2">Tamil</div>
          </div>

          {/* Divider */}
          <div className="hero-divider">
            <div className="hero-divider-line" />
            <span className="hero-divider-heart">♥</span>
            <div className="hero-divider-line" />
          </div>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Transform your love story into a winning plan.<br />
            AI-powered relationship strategy — crafted for the Tamil heart.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta-row">
            <button className="ds-btn-primary" onClick={scrollToStory}>
              <Heart size={16} fill="currentColor" />
              Start Your Story
            </button>
            <button className="ds-btn-ghost" onClick={scrollToGuide}>
              <ChevronDown size={16} />
              Learn How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { color: "#e8507a", label: "AI Analysis", desc: "Real-time" },
              { color: "#d4a853", label: "Tamil", desc: "Language support" },
              { color: "#9b4d8a", label: "Strategy", desc: "Personalised plan" },
            ].map(({ color, label, desc }) => (
              <div key={label} className="hero-stat-pill">
                <div className="hero-stat-dot" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
                <span className="hero-stat-label" style={{ color }}>{label}</span>
                <span className="hero-stat-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hero-scroll-cue" onClick={scrollToStory}>
          <ChevronDown size={22} />
        </div>
      </section>
    </>
  );
};

export default Hero;
