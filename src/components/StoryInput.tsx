import { useState, useEffect, useRef } from "react";
import { KeyRound, Send, Loader2, Eye, EyeOff, Sparkles, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateLovePlan } from "@/services/api";

interface StoryInputProps {
  onResult: (plan: string) => void;
}

/* ═══════════════════════════════
   STORY INPUT — Design System
═══════════════════════════════ */

const StoryInput = ({ onResult }: StoryInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [agentIdx, setAgentIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Scroll-reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Agent ticker during loading */
  const agents = [
    "♥ Analysing your heart's story…",
    "✿ Mapping emotional resonance…",
    "♡ Crafting opening conversations…",
    "❀ Building trust and connection…",
    "✦ Designing your approach strategy…",
    "♥ Calculating compatibility vectors…",
    "✿ Personalising tone & warmth…",
    "♡ Running sentiment poetry…",
    "❀ Validating emotional fit…",
    "✦ Finalising your Love Plan…",
  ];
  useEffect(() => {
    if (!loading) { setAgentIdx(0); return; }
    const t = setInterval(() => setAgentIdx(i => (i + 1) % agents.length), 1800);
    return () => clearInterval(t);
  }, [loading]);

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      toast({ title: "API Key Required", description: "Please enter your Gemini API key to continue.", variant: "destructive" });
      return;
    }
    if (!story.trim()) {
      toast({ title: "Story Required", description: "Please write your love story before generating a plan.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const plan = await generateLovePlan(story, apiKey);
      onResult(plan);
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate love plan. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const charColor = story.length > 1800 ? "#f87171" : story.length > 1200 ? "#d4a853" : "#6b3a3a";
  const progress = Math.min((story.length / 2000) * 100, 100);

  return (
    <>
      <style>{`
        .si-section {
          padding: 0 24px 80px;
          position: relative;
        }

        /* Window chrome bar */
        .si-chrome {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-bottom: 1px solid rgba(196,30,58,0.08);
          background: rgba(196,30,58,0.015);
        }
        .si-chrome-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .si-chrome-title {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #4a2828;
          letter-spacing: 0.5px;
          margin-left: 6px;
        }

        /* Field label */
        .si-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #e8507a;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
        }

        /* Key hint */
        .si-hint {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: #4a2828;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 7px;
        }

        /* Progress bar */
        .si-progress-track {
          height: 3px;
          border-radius: 2px;
          background: rgba(196,30,58,0.08);
          overflow: hidden;
          margin-top: 8px;
        }
        .si-progress-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #8b0000, #c41e3a, #e8507a, #e8b4a0);
          transition: width 0.3s ease;
        }

        /* Agent ticker */
        .si-agent-ticker {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 22px;
          overflow: hidden;
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 14px;
          font-style: italic;
          color: #a07070;
        }
        .si-agent-dot-wrap {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .si-agent-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #e8507a;
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        .si-agent-dot:nth-child(2) { animation-delay: 0.3s; }
        .si-agent-dot:nth-child(3) { animation-delay: 0.6s; }

        /* Agent text swap */
        @keyframes agentSwap {
          0%   { opacity: 0; transform: translateY(8px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-8px); }
        }
      `}</style>

      <section id="story-input" className="si-section">
        <div
          ref={sectionRef}
          style={{
            maxWidth: 680,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Section header */}
          <div className="ds-section-header" style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div className="ds-badge">
                <span className="ds-badge-dot" />
                Your Story · Your Plan
              </div>
            </div>
            <h2 className="ds-section-title">
              Tell Your <em style={{ fontStyle: "italic" }}>Love</em> Story
            </h2>
            <p className="ds-section-subtitle">
              Share your situation and let 10 AI agents craft a personalised love strategy.
            </p>
            <div className="ds-divider" style={{ marginTop: 18 }}>
              <div className="ds-divider-line" />
              <span className="ds-divider-glyph">♥</span>
              <div className="ds-divider-line" />
            </div>
          </div>

          {/* Form card */}
          <div className="ds-surface gleam-card" style={{ borderRadius: 18 }}>
            <div className="ds-top-border" />

            {/* Window chrome */}
            <div className="si-chrome">
              <div className="si-chrome-dot" style={{ background: "#f87171" }} />
              <div className="si-chrome-dot" style={{ background: "#d4a853" }} />
              <div className="si-chrome-dot" style={{ background: "#e8507a" }} />
              <span className="si-chrome-title">LoveGPT Tamil · Gemini AI</span>
            </div>

            {/* Fields */}
            <div style={{ padding: "24px 24px 28px" }}>

              {/* API Key */}
              <div style={{ marginBottom: 24 }}>
                <label className="si-label">
                  <KeyRound size={12} />
                  Gemini API Key
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="ds-input"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Paste your Gemini API key here…"
                    disabled={loading}
                    style={{ paddingRight: 48 }}
                  />
                  <button
                    onClick={() => setShowKey(s => !s)}
                    style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: "#6b3a3a", cursor: "pointer",
                      display: "flex", alignItems: "center", padding: 4,
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e8507a")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#6b3a3a")}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="si-hint">
                  <Heart size={10} fill="currentColor" style={{ color: "#c41e3a", flexShrink: 0 }} />
                  Your key is sent directly to Gemini — never stored or logged.
                </div>
              </div>

              {/* Story textarea */}
              <div style={{ marginBottom: 24 }}>
                <label className="si-label" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Heart size={12} fill="currentColor" />
                    Your Love Story
                  </span>
                  <span style={{ color: charColor, fontFamily: "'Inter', sans-serif", font: "normal 11px/1 Inter, sans-serif", letterSpacing: "normal", textTransform: "none" }}>
                    {story.length} / 2000
                  </span>
                </label>
                <textarea
                  className="ds-input"
                  rows={7}
                  value={story}
                  onChange={e => setStory(e.target.value.slice(0, 2000))}
                  placeholder="I secretly love someone in my college but I don't know how to approach them…"
                  disabled={loading}
                  style={{ resize: "vertical", minHeight: 160 }}
                />
                <div className="si-progress-track">
                  <div
                    className="si-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="si-hint" style={{ marginTop: 6 }}>
                  <Sparkles size={10} style={{ color: "#d4a853", flexShrink: 0 }} />
                  Be specific — the more detail you share, the better the strategy.
                </div>
              </div>

              {/* Submit */}
              <button
                className="ds-btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: "100%", padding: "16px 32px", fontSize: 15, letterSpacing: 0.5 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    <span style={{ flex: 1, textAlign: "center" }}>Crafting your plan…</span>
                  </>
                ) : (
                  <>
                    <Heart size={16} fill="currentColor" />
                    <span style={{ flex: 1, textAlign: "center" }}>Generate Love Plan</span>
                    <Send size={14} />
                  </>
                )}
              </button>

              {/* Agent ticker (loading only) */}
              {loading && (
                <div className="si-agent-ticker" style={{ marginTop: 14, justifyContent: "center" }}>
                  <div className="si-agent-dot-wrap">
                    <div className="si-agent-dot" />
                    <div className="si-agent-dot" />
                    <div className="si-agent-dot" />
                  </div>
                  <span
                    key={agentIdx}
                    style={{ animation: "agentSwap 1.8s ease both" }}
                  >
                    {agents[agentIdx]}
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StoryInput;

/* Spin keyframe helper (for Loader2) */
const style = document.createElement("style");
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);