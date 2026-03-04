import { BookHeart, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════
   EXAMPLE STORY — Design System
═══════════════════════════════ */

const ExampleStory = () => {
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          setTimeout(() => setTextVisible(true), 250);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const words = `"Arjun never believed in love until he met Meera in the college library. Their conversations began with books but slowly turned into shared dreams. One rainy evening under a silent bus stop, Arjun finally gathered courage to speak his heart."`.split(" ");
  const highlight = new Set([3, 11, 22]);

  return (
    <>
      <style>{`
        .ex-section {
          padding: 0 24px 80px;
          position: relative;
        }

        /* Card */
        .ex-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: linear-gradient(160deg, rgba(22,6,14,0.97) 0%, rgba(12,3,8,0.99) 100%);
          border: 1px solid rgba(196,30,58,0.14);
          box-shadow: 0 30px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(196,30,58,0.05);
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.45s ease,
                      border-color 0.3s ease;
        }
        .ex-card:hover {
          transform: translateY(-5px);
          border-color: rgba(196,30,58,0.24);
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 30px rgba(196,30,58,0.08);
        }

        /* Shimmer on hover */
        .ex-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent, rgba(247,231,206,0.025), transparent);
          transform: translateX(-100%) skewX(-14deg);
          transition: transform 0s;
          pointer-events: none;
          z-index: 0;
        }
        .ex-card:hover::after {
          transform: translateX(200%) skewX(-14deg);
          transition: transform 0.65s ease;
        }

        /* Card body */
        .ex-body {
          padding: 28px 28px 0;
          position: relative;
          z-index: 1;
        }

        /* Header row */
        .ex-header-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        /* Title inside card */
        .ex-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 17px;
          font-weight: 500;
          color: #f4839d;
        }
        .ex-card-sub {
          font-family: 'Inter', sans-serif;
          font-size: 11.5px;
          color: #4a2828;
          letter-spacing: 0.3px;
          margin-top: 2px;
        }

        /* Quote text */
        .ex-quote-block {
          padding-left: 14px;
          border-left: 2px solid rgba(196,30,58,0.18);
          margin-bottom: 0;
        }
        .ex-word-base {
          display: inline;
          font-family: 'EB Garamond', Georgia, serif;
          font-style: italic;
          font-size: clamp(15px, 2.2vw, 18px);
          line-height: 1.85;
          margin-right: 4px;
          transition: opacity 0.4s ease, color 0.35s ease;
        }
        .ex-quote-mark {
          position: absolute;
          top: 22px; left: 22px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 72px;
          line-height: 0.6;
          color: rgba(196,30,58,0.07);
          pointer-events: none;
          user-select: none;
          transition: color 0.3s ease;
          z-index: 0;
        }
        .ex-card:hover .ex-quote-mark { color: rgba(196,30,58,0.12); }

        /* Bottom strip */
        .ex-footer-strip {
          padding: 12px 28px;
          border-top: 1px solid rgba(196,30,58,0.08);
          background: rgba(196,30,58,0.018);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
        }
        .ex-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .ex-strip-center {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 11px;
          color: #3a1a1a;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          flex: 1;
          text-align: center;
        }
        .ex-strip-line {
          height: 1px;
          flex: 1;
          transition: background 0.5s ease;
        }
      `}</style>

      <section className="ex-section">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div
            ref={ref}
            className="ex-card gleam-card"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* Top accent */}
            <div className="ds-top-border" />

            {/* Quote mark watermark */}
            <div className="ex-quote-mark">"</div>

            <div className="ex-body">
              {/* Badge + header */}
              <div className="ex-header-row">
                <div className="ds-icon-badge">
                  <BookHeart size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="ds-badge" style={{ marginBottom: 6 }}>
                    <span className="ds-badge-dot" />
                    Example Story
                  </div>
                  <div className="ex-card-title">Example Love Story</div>
                  <div className="ex-card-sub">LoveGPT Tamil · Sample Input</div>
                </div>
                <Sparkles size={16} color="#4a2828" style={{ animation: "heartbeat 4s ease-in-out infinite", flexShrink: 0 }} />
              </div>

              {/* Story text */}
              <div className="ex-quote-block">
                <p style={{ lineHeight: 1.9 }}>
                  {words.map((word, i) => (
                    <span
                      key={i}
                      className="ex-word-base"
                      style={{
                        opacity: textVisible ? 1 : 0,
                        transform: textVisible ? "translateY(0)" : "translateY(6px)",
                        transition: `opacity 0.4s ease ${i * 0.035}s, transform 0.4s ease ${i * 0.035}s, color 0.3s ease`,
                        color: highlight.has(i) ? "#f4839d" : "#a07070",
                      }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Footer strip */}
            <div className="ex-footer-strip">
              <div
                className="ex-strip-line"
                style={{ background: textVisible ? "linear-gradient(90deg, transparent, #e8507a)" : "transparent" }}
              />
              <span className="ex-strip-center">Your Story Could Start Here</span>
              <div
                className="ex-strip-line"
                style={{ background: textVisible ? "linear-gradient(90deg, #d4a853, transparent)" : "transparent" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExampleStory;