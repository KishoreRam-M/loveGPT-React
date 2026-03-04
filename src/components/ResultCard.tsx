import { useEffect, useState, useRef } from "react";
import {
  ClipboardCopy, RefreshCw, Sparkles,
  ChevronDown, Heart, AlertTriangle, CheckCircle, Clock,
} from "lucide-react";

interface ResultCardProps {
  plan: string;
  onReset: () => void;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ParsedBlock {
  type: "h1" | "h2" | "h3" | "paragraph" | "bullet" | "divider" | "verdict" | "score";
  content: string;
  raw: string;
}

// ─── Markdown Parser ──────────────────────────────────────────────────────────
function parseMarkdown(text: string): ParsedBlock[] {
  const lines = text.split("\n");
  const blocks: ParsedBlock[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("### ")) blocks.push({ type: "h3", content: t.slice(4), raw: t });
    else if (t.startsWith("## ")) blocks.push({ type: "h2", content: t.slice(3), raw: t });
    else if (t.startsWith("# ")) blocks.push({ type: "h1", content: t.slice(2), raw: t });
    else if (t === "---") blocks.push({ type: "divider", content: "", raw: t });
    else if (t.match(/^[\*\-]\s/) || t.match(/^\d+\.\s/)) {
      const c = t.replace(/^[\*\-]\s/, "").replace(/^\d+\.\s/, "");
      const isVerdict = c.includes("STRONGLY PRESENT") || c.includes("NOT PRESENT") ||
        c.includes("NONE OF") || (c.includes("PRESENT") && !c.includes("NOT"));
      blocks.push({ type: isVerdict ? "verdict" : "bullet", content: c, raw: t });
    } else if (t.match(/\d+%/)) {
      blocks.push({ type: "score", content: t, raw: t });
    } else {
      blocks.push({ type: "paragraph", content: t, raw: t });
    }
  }
  return blocks;
}

// ─── Inline bold renderer ──────────────────────────────────────────────────────
function RenderInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} style={{ color: "#67e8f9", fontWeight: 600 }}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ─── Score extraction ─────────────────────────────────────────────────────────
function extractScores(text: string) {
  const scores: { label: string; value: number }[] = [];
  const regex = /([^:\n(]+?)[:：]\s*(\d+)%/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const label = m[1].replace(/[\*\#\-]/g, "").trim();
    const value = parseInt(m[2]);
    if (label.length > 3 && label.length < 60) scores.push({ label, value });
  }
  return scores.slice(0, 6);
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ value, label, index }: { value: number; label: string; index: number }) {
  const [width, setWidth] = useState(0);
  const [dotVisible, setDotVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setWidth(value), index * 130);
        setTimeout(() => setDotVisible(true), index * 130 + 800);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, index]);

  const color = value >= 70 ? "#34d399" : value >= 40 ? "#fbbf24" : "#f87171";

  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, color: "#64748b" }}>{label}</span>
        <span style={{
          fontSize: 12.5, fontWeight: 600, color,
          opacity: dotVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}>
          {value}%
        </span>
      </div>
      {/* Track */}
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
        {/* Fill */}
        <div style={{
          height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${color}88, ${color}, white)`,
          width: `${width}%`,
          transition: `width 1.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.13}s`,
          boxShadow: `0 0 12px ${color}88, 0 0 24px ${color}44`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Shimmer */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
            animation: "rcShimmer 2.5s ease infinite",
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Verdict Badge ────────────────────────────────────────────────────────────
function VerdictBadge({ text, index }: { text: string; index: number }) {
  const isRed = text.includes("STRONGLY PRESENT") || text.includes("NONE OF THE CRITICAL") || text.includes("Red");
  const isGreen = !isRed && (text.includes("NONE") || (text.includes("PRESENT") && !text.includes("NOT"))) || text.includes("Green");
  const color = isRed ? "#f87171" : isGreen ? "#34d399" : "#fbbf24";
  const bg = isRed ? "rgba(248,113,113,0.07)" : isGreen ? "rgba(52,211,153,0.07)" : "rgba(251,191,36,0.07)";
  const border = isRed ? "rgba(248,113,113,0.2)" : isGreen ? "rgba(52,211,153,0.2)" : "rgba(251,191,36,0.2)";
  const Icon = isRed ? AlertTriangle : isGreen ? CheckCircle : Clock;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 14px", borderRadius: 10, marginBottom: 6,
      background: bg, border: `1px solid ${border}`,
      animation: `rcFadeUp 0.4s ${index * 0.05}s ease both`,
    }}>
      <Icon size={13} style={{ color, marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.75 }}>
        <RenderInline text={text} />
      </span>
    </div>
  );
}

// ─── Section (collapsible) ────────────────────────────────────────────────────
function Section({
  title, children, defaultOpen = false, index,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean; index: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      marginBottom: 10,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
    }}>
      {/* Header button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          borderRadius: open ? "12px 12px 0 0" : "12px",
          background: open
            ? "rgba(14,165,233,0.10)"
            : "rgba(255,255,255,0.025)",
          border: `1px solid ${open ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.06)"}`,
          cursor: "pointer", textAlign: "left",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
      >
        <span style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 15, fontWeight: 400,
          color: open ? "#67e8f9" : "#94a3b8",
          transition: "color 0.2s ease",
        }}>
          {title}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: open ? "#38bdf8" : "#475569",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), color 0.2s ease",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Body */}
      <div style={{
        maxHeight: open ? "9999px" : "0",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
        background: "rgba(255,255,255,0.012)",
        border: open ? "1px solid rgba(14,165,233,0.09)" : "none",
        borderTop: "none",
        borderRadius: "0 0 12px 12px",
      }}>
        <div style={{ padding: "16px 18px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Plan Renderer ────────────────────────────────────────────────────────────
function PlanRenderer({ plan }: { plan: string }) {
  const blocks = parseMarkdown(plan);
  const scores = extractScores(plan);

  // Group blocks into sections
  const sections: { title: string; blocks: ParsedBlock[]; idx: number }[] = [];
  let current: typeof sections[0] | null = null;
  let si = 0;

  for (const block of blocks) {
    if (["h1", "h2", "h3"].includes(block.type)) {
      if (current) sections.push(current);
      current = { title: block.content, blocks: [], idx: si++ };
    } else if (block.type === "divider") {
      if (current) { sections.push(current); current = null; }
    } else {
      if (!current) current = { title: "", blocks: [], idx: si++ };
      current.blocks.push(block);
    }
  }
  if (current) sections.push(current);

  let verdictCount = 0;
  let bulletCount = 0;
  let paraCount = 0;

  function renderBlock(b: ParsedBlock) {
    switch (b.type) {
      case "verdict":
        return <VerdictBadge key={verdictCount} text={b.content} index={verdictCount++} />;
      case "bullet": {
        const i = bulletCount++;
        return (
          <div key={i} style={{
            display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start",
            animation: `rcFadeUp 0.35s ${i * 0.04}s ease both`,
          }}>
            <span style={{ color: "#38bdf8", marginTop: 5, flexShrink: 0, fontSize: 8 }}>◆</span>
            <span style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.82 }}>
              <RenderInline text={b.content} />
            </span>
          </div>
        );
      }
      case "score": return null;
      default: {
        const i = paraCount++;
        return (
          <p key={i} style={{
            fontSize: 13.5, color: "#94a3b8", lineHeight: 1.85, marginBottom: 10,
            animation: `rcFadeUp 0.35s ${i * 0.03}s ease both`,
          }}>
            <RenderInline text={b.content} />
          </p>
        );
      }
    }
  }

  return (
    <div>
      {/* Analytics Panel */}
      {scores.length > 0 && (
        <div style={{
          marginBottom: 24, padding: "18px 20px", borderRadius: 14,
          background: "linear-gradient(135deg, rgba(14,165,233,0.07), rgba(99,102,241,0.05))",
          border: "1px solid rgba(14,165,233,0.14)",
        }}>
          <div style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, color: "#38bdf8", marginBottom: 16,
            textTransform: "uppercase", letterSpacing: 2.5, fontWeight: 500,
          }}>
            ◈ Relationship Analytics
          </div>
          {scores.map((s, i) => (
            <ScoreBar key={i} value={s.value} label={s.label} index={i} />
          ))}
        </div>
      )}

      {/* Sections */}
      {sections.map((sec, i) =>
        sec.title ? (
          <Section key={i} title={sec.title} defaultOpen={i === 0} index={i}>
            {sec.blocks.map(b => renderBlock(b))}
          </Section>
        ) : (
          <div key={i} style={{ marginBottom: 16 }}>
            {sec.blocks.map(b => renderBlock(b))}
          </div>
        )
      )}
    </div>
  );
}

// ─── Scroll FAB ───────────────────────────────────────────────────────────────
function ScrollFAB() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 50,
        width: 44, height: 44, borderRadius: "50%",
        border: "1px solid rgba(56,189,248,0.3)",
        background: "rgba(14,165,233,0.12)",
        color: "#38bdf8", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: show ? 1 : 0,
        transform: show ? "scale(1)" : "scale(0.7)",
        transition: "opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        pointerEvents: show ? "auto" : "none",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Back to top"
    >
      <ChevronDown size={16} style={{ transform: "rotate(180deg)" }} />
    </button>
  );
}

// ─── Main ResultCard ──────────────────────────────────────────────────────────
const ResultCard = ({ plan, onReset }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plan);
    setCopied(true);
    setToast(true);
    setTimeout(() => setCopied(false), 2200);
    setTimeout(() => setToast(false), 2600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes rcFadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rcFadeDown { from{opacity:0;transform:translateY(-20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes rcScaleIn  { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes rcShimmer  { 0%{transform:translateX(-150%)} 100%{transform:translateX(150%)} }
        @keyframes rcBorderFlow { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes rcDotPulse {
          0%,100%{box-shadow:0 0 6px #38bdf8;transform:scale(1)}
          50%{box-shadow:0 0 14px #38bdf8,0 0 28px #38bdf855;transform:scale(1.3)}
        }
        @keyframes rcSpin { to{transform:rotate(360deg)} }
        @keyframes rcDrift {
          0%{transform:translateY(0) rotate(0deg);opacity:0}
          5%{opacity:1} 95%{opacity:1}
          100%{transform:translateY(-110vh) rotate(45deg);opacity:0}
        }
        @keyframes rcOrbPulse {
          0%{transform:translate(-50%,-50%) scale(0.95);opacity:0.08}
          100%{transform:translate(-50%,-50%) scale(1.3);opacity:0.16}
        }
        @keyframes rcToast {
          0%  {opacity:0;transform:translateY(16px)}
          15% {opacity:1;transform:translateY(0)}
          80% {opacity:1;transform:translateY(0)}
          100%{opacity:0;transform:translateY(-8px)}
        }

        .rc-root { font-family:'DM Sans',system-ui,sans-serif; }
        .rc-root * { box-sizing:border-box; }

        /* Scrollbar */
        .rc-root ::-webkit-scrollbar        { width:6px; }
        .rc-root ::-webkit-scrollbar-track  { background:transparent; }
        .rc-root ::-webkit-scrollbar-thumb  { background:rgba(56,189,248,0.2); border-radius:99px; }

        .rc-btn-primary {
          position:relative; overflow:hidden;
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 24px; border-radius:100px;
          border:1px solid rgba(56,189,248,0.3);
          background:linear-gradient(135deg,rgba(14,165,233,0.18),rgba(99,102,241,0.14));
          color:#e2eaf4; font-family:'DM Sans',system-ui,sans-serif;
          font-size:13.5px; font-weight:500; cursor:pointer;
          transition:border-color .25s ease,box-shadow .25s ease,transform .2s ease;
        }
        .rc-btn-primary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(56,189,248,0.14),transparent);
          transform:translateX(-100%); transition:transform .45s ease;
        }
        .rc-btn-primary:hover::before{transform:translateX(100%)}
        .rc-btn-primary:hover{
          border-color:rgba(56,189,248,0.55);
          box-shadow:0 0 20px rgba(56,189,248,0.18);
          transform:translateY(-1px);
        }
        .rc-btn-primary:active{transform:translateY(0)}

        .rc-btn-copy-ok {
          background:linear-gradient(135deg,#22c55e,#16a34a) !important;
          border-color:rgba(34,197,94,0.5) !important;
          box-shadow:0 0 18px rgba(34,197,94,0.25) !important;
        }

        .rc-btn-ghost {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 22px; border-radius:100px;
          border:1px solid rgba(56,189,248,0.15);
          background:rgba(255,255,255,0.025);
          color:#64748b; font-family:'DM Sans',system-ui,sans-serif;
          font-size:13.5px; cursor:pointer; position:relative; overflow:hidden;
          transition:border-color .25s ease,color .25s ease,background .25s ease,transform .2s ease;
        }
        .rc-btn-ghost::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(56,189,248,0.08),transparent);
          transform:translateX(-100%); transition:transform .45s ease;
        }
        .rc-btn-ghost:hover::before{transform:translateX(100%)}
        .rc-btn-ghost:hover{
          border-color:rgba(56,189,248,0.3); color:#94a3b8;
          background:rgba(56,189,248,0.04); transform:translateY(-1px);
        }
        .rc-btn-ghost:active{transform:translateY(0)}
      `}</style>

      <section className="rc-root" style={{
        minHeight: "100vh",
        padding: "52px 16px 100px",
        background: "linear-gradient(160deg, #020812, #040c18, #030a14)",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* ── Ambient orbs ── */}
        {[
          { x: "12%", y: "18%", c: "#0ea5e9", s: 600, d: "9s", dl: "0s" },
          { x: "78%", y: "55%", c: "#6366f1", s: 480, d: "11s", dl: "1.1s" },
          { x: "45%", y: "88%", c: "#06b6d4", s: 400, d: "8s", dl: "2.2s" },
          { x: "88%", y: "8%", c: "#8b5cf6", s: 360, d: "13s", dl: "3.3s" },
          { x: "30%", y: "50%", c: "#34d399", s: 280, d: "14s", dl: "4.4s" },
          { x: "60%", y: "25%", c: "#f87171", s: 200, d: "10s", dl: "5.5s" },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute", left: o.x, top: o.y,
            width: o.s, height: o.s, borderRadius: "50%",
            background: o.c, filter: "blur(100px)", opacity: 0.2,
            transform: "translate(-50%,-50%)",
            animation: `rcOrbPulse ${o.d} ${o.dl} ease-in-out infinite alternate`,
            pointerEvents: "none",
          }} />
        ))}

        {/* ── Particle field ── */}
        {Array.from({ length: 20 }, (_, i) => ({
          left: Math.random() * 100,
          delay: Math.random() * 12,
          dur: 10 + Math.random() * 14,
          size: 9 + Math.random() * 8,
          glyph: ["✦", "◈", "⬡", "✧", "◆", "♦", "⟡"][i % 7],
          color: ["#38bdf8", "#818cf8", "#34d399", "#67e8f9", "#a78bfa"][i % 5],
        })).map((p, i) => (
          <span key={i} style={{
            position: "absolute", left: `${p.left}%`, bottom: -20,
            fontSize: p.size, color: p.color, opacity: 0,
            animation: `rcDrift ${p.dur}s ${p.delay}s linear infinite`,
            pointerEvents: "none", userSelect: "none",
          }}>{p.glyph}</span>
        ))}

        {/* ── Content ── */}
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* Header */}
          <div style={{
            textAlign: "center", marginBottom: 44,
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-28px)",
            transition: "opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "4px 14px 4px 10px", borderRadius: 100, marginBottom: 18,
              background: "rgba(14,165,233,0.06)", border: "1px solid rgba(56,189,248,0.18)",
              fontSize: 11, color: "#67e8f9", letterSpacing: 2.5, textTransform: "uppercase",
            }}>
              <Sparkles size={11} style={{ animation: "rcSpin 8s linear infinite" }} />
              Love Strategy Ready
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(30px, 6vw, 50px)", fontWeight: 400,
              background: "linear-gradient(135deg, #e2eaf4 0%, #67e8f9 35%, #818cf8 65%, #a78bfa 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "rcFadeDown 0.7s 0.1s ease both, rcShimmer 5s ease infinite",
              marginBottom: 10, lineHeight: 1.18,
            }}>
              உங்கள் Love Plan ✨
            </h2>

            {/* Subtitle */}
            <p style={{
              color: "#64748b", fontSize: 13.5,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontStyle: "italic", letterSpacing: 0.3,
              animation: "rcFadeDown 0.6s 0.2s ease both",
            }}>
              Psychologically crafted, just for your story
            </p>

            {/* Divider lines */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 20 }}>
              {[0, 1].map(k => (
                <div key={k} style={{
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.35), transparent)",
                  animation: `rcScaleIn 1.1s ${0.4 + k * 0.15}s cubic-bezier(0.22,1,0.36,1) both`,
                  width: 80,
                }} />
              ))}
              <span style={{ color: "#38bdf8", fontSize: 13, opacity: 0.6 }}>✦</span>
            </div>
          </div>

          {/* Card */}
          <div style={{
            borderRadius: 20, overflow: "hidden",
            background: "linear-gradient(160deg, rgba(10,18,32,0.98), rgba(5,10,18,0.99))",
            border: "1px solid rgba(56,189,248,0.12)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(56,189,248,0.06), 0 0 40px rgba(56,189,248,0.05)",
            animation: "rcScaleIn 0.7s 0.15s cubic-bezier(0.22,1,0.36,1) both",
          }} className="gleam-card">
            {/* Card topbar */}
            <div style={{
              padding: "14px 22px",
              borderBottom: "1px solid rgba(56,189,248,0.07)",
              background: "rgba(14,165,233,0.025)",
              display: "flex", alignItems: "center", gap: 8,
              position: "relative", overflow: "hidden",
            }}>
              {/* Animated top border */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent 0%, #38bdf8 20%, #06b6d4 50%, #6366f1 80%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "rcBorderFlow 4s linear infinite",
              }} />

              {/* Traffic lights */}
              {["#f87171", "#fbbf24", "#34d399"].map((c, i) => (
                <div key={i} style={{
                  width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.65,
                }} />
              ))}

              {/* Live dot */}
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: "#38bdf8",
                animation: "rcDotPulse 2s ease-in-out infinite", marginLeft: 6,
              }} />

              <span style={{
                fontSize: 11.5, color: "#1e3a5f", letterSpacing: 0.8, marginLeft: 2,
              }}>
                AI Relationship Strategist · 10 Agents
              </span>
            </div>

            {/* Plan content */}
            <div style={{ padding: "28px 24px" }}>
              <PlanRenderer plan={plan} />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: "flex", gap: 10, justifyContent: "center",
            marginTop: 28, flexWrap: "wrap",
            animation: "rcFadeUp 0.6s 0.4s ease both",
          }}>
            <button
              onClick={handleCopy}
              className={`rc-btn-primary${copied ? " rc-btn-copy-ok" : ""}`}
            >
              {copied
                ? <CheckCircle size={15} />
                : <ClipboardCopy size={15} />}
              {copied ? "Copied!" : "Copy Plan"}
            </button>

            <button onClick={onReset} className="rc-btn-ghost">
              <RefreshCw size={14} />
              New Story
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rc-btn-ghost"
            >
              <Heart size={14} />
              Back to Top
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
            zIndex: 100, display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 100,
            background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)",
            color: "#67e8f9", fontSize: 13, backdropFilter: "blur(12px)",
            animation: "rcToast 2.6s cubic-bezier(0.34,1.56,0.64,1) both",
            whiteSpace: "nowrap",
          }}>
            <CheckCircle size={13} />
            Plan copied to clipboard
          </div>
        )}

        {/* Scroll FAB */}
        <ScrollFAB />
      </section>
    </>
  );
};

export default ResultCard;