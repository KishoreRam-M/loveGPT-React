import { useEffect, useState, useRef } from "react";
import {
  ClipboardCopy, RefreshCw, Sparkles,
  ChevronDown, Heart, AlertTriangle, CheckCircle, Clock,
} from "lucide-react";

interface ResultCardProps {
  plan: string;
  onReset: () => void;
}

interface ParsedBlock {
  type: "h1" | "h2" | "h3" | "paragraph" | "bullet" | "divider" | "verdict" | "score";
  content: string;
  raw: string;
}

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

function RenderInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} style={{ color: "#e8507a", fontWeight: 600 }}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

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

  const color = value >= 70 ? "#e8507a" : value >= 40 ? "#d4a853" : "#9b4d8a";

  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12.5, color: "#a07070", fontFamily: "'EB Garamond', Georgia, serif" }}>{label}</span>
        <span style={{
          fontSize: 12.5, fontWeight: 600, color,
          opacity: dotVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {value}%
        </span>
      </div>
      <div style={{ height: 4, background: "rgba(196,30,58,0.08)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, #8b0000, ${color})`,
          width: `${width}%`,
          transition: `width 1.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.13}s`,
          boxShadow: `0 0 10px ${color}66`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(248,179,157,0.2) 50%, transparent 100%)",
            animation: "rcShimmer 2.5s ease infinite",
          }} />
        </div>
      </div>
    </div>
  );
}

function VerdictBadge({ text, index }: { text: string; index: number }) {
  const isRed = text.includes("STRONGLY PRESENT") || text.includes("NONE OF THE CRITICAL") || text.includes("Red");
  const isGreen = !isRed && (text.includes("NONE") || (text.includes("PRESENT") && !text.includes("NOT"))) || text.includes("Green");
  const color = isRed ? "#c41e3a" : isGreen ? "#d4a853" : "#9b4d8a";
  const bg = isRed ? "rgba(196,30,58,0.06)" : isGreen ? "rgba(212,168,83,0.06)" : "rgba(155,77,138,0.06)";
  const border = isRed ? "rgba(196,30,58,0.18)" : isGreen ? "rgba(212,168,83,0.18)" : "rgba(155,77,138,0.18)";
  const Icon = isRed ? AlertTriangle : isGreen ? CheckCircle : Clock;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 14px", borderRadius: 10, marginBottom: 6,
      background: bg, border: `1px solid ${border}`,
      animation: `rcFadeUp 0.4s ${index * 0.05}s ease both`,
    }}>
      <Icon size={13} style={{ color, marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 13.5, color: "#a07070", lineHeight: 1.75, fontFamily: "'EB Garamond', Georgia, serif" }}>
        <RenderInline text={text} />
      </span>
    </div>
  );
}

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
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          borderRadius: open ? "12px 12px 0 0" : "12px",
          background: open ? "rgba(196,30,58,0.06)" : "rgba(20,5,12,0.4)",
          border: `1px solid ${open ? "rgba(196,30,58,0.22)" : "rgba(196,30,58,0.10)"}`,
          cursor: "pointer", textAlign: "left",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
      >
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 15, fontWeight: 400,
          color: open ? "#e8507a" : "#7a4a4a",
          transition: "color 0.2s ease",
        }}>
          {title}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: open ? "#c41e3a" : "#722f37",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), color 0.2s ease",
            flexShrink: 0,
          }}
        />
      </button>

      <div style={{
        maxHeight: open ? "9999px" : "0",
        overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.22,1,0.36,1)",
        background: "rgba(20,5,12,0.3)",
        border: open ? "1px solid rgba(196,30,58,0.08)" : "none",
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

function PlanRenderer({ plan }: { plan: string }) {
  const blocks = parseMarkdown(plan);
  const scores = extractScores(plan);

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
            <span style={{ color: "#c41e3a", marginTop: 6, flexShrink: 0, fontSize: 7 }}>♦</span>
            <span style={{ fontSize: 13.5, color: "#a07070", lineHeight: 1.82, fontFamily: "'EB Garamond', Georgia, serif" }}>
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
            fontSize: 14, color: "#a07070", lineHeight: 1.85, marginBottom: 10,
            fontFamily: "'EB Garamond', Georgia, serif",
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
      {scores.length > 0 && (
        <div style={{
          marginBottom: 24, padding: "18px 20px", borderRadius: 14,
          background: "rgba(20,5,12,0.5)",
          border: "1px solid rgba(196,30,58,0.14)",
          borderLeft: "3px solid rgba(196,30,58,0.35)",
        }}>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11, color: "#c41e3a", marginBottom: 16,
            textTransform: "uppercase", letterSpacing: 2.5, fontWeight: 500,
          }}>
            ♦ Relationship Analytics
          </div>
          {scores.map((s, i) => (
            <ScoreBar key={i} value={s.value} label={s.label} index={i} />
          ))}
        </div>
      )}

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
        border: "1px solid rgba(196,30,58,0.3)",
        background: "rgba(196,30,58,0.10)",
        color: "#e8507a", cursor: "pointer",
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=EB+Garamond:wght@400;500&family=Inter:wght@300;400;500&display=swap');

        :root {
          --primary: #c41e3a;
          --primary-dark: #8b0000;
          --accent: #e8507a;
          --secondary: #9b4d8a;
          --wine: #722f37;
          --gold: #d4a853;
          --coral: #e8b4a0;
          --pink: #f4839d;
          --text-main: #f7e7ce;
          --text-muted: #6b3a3a;
          --text-body: #a07070;
          --text-warm: #7a4a4a;
          --card-bg: rgba(20,5,12,0.5);
          --border-soft: rgba(196,30,58,0.10);
        }

        @keyframes rcFadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rcFadeDown { from{opacity:0;transform:translateY(-20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes rcScaleIn  { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes rcShimmer  { 0%{transform:translateX(-150%)} 100%{transform:translateX(150%)} }
        @keyframes rcBorderFlow { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes rcDotPulse {
          0%,100%{box-shadow:0 0 6px #c41e3a;transform:scale(1)}
          50%{box-shadow:0 0 14px #c41e3a,0 0 28px rgba(196,30,58,0.4);transform:scale(1.3)}
        }
        @keyframes rcSpin { to{transform:rotate(360deg)} }
        @keyframes rcDrift {
          0%{transform:translateY(0) rotate(0deg);opacity:0}
          5%{opacity:1} 95%{opacity:1}
          100%{transform:translateY(-110vh) rotate(45deg);opacity:0}
        }
        @keyframes orbFlicker {
          0%{opacity:0.10;transform:translate(-50%,-50%) scale(0.95)}
          100%{opacity:0.18;transform:translate(-50%,-50%) scale(1.25)}
        }
        @keyframes rcToast {
          0%  {opacity:0;transform:translate(-50%, 16px)}
          15% {opacity:1;transform:translate(-50%, 0)}
          80% {opacity:1;transform:translate(-50%, 0)}
          100%{opacity:0;transform:translate(-50%, -8px)}
        }

        .rc-root { font-family:'EB Garamond',Georgia,serif; }
        .rc-root * { box-sizing:border-box; }
        .rc-root ::-webkit-scrollbar { width:5px; }
        .rc-root ::-webkit-scrollbar-track { background:transparent; }
        .rc-root ::-webkit-scrollbar-thumb { background:rgba(196,30,58,0.2); border-radius:99px; }

        .rc-btn-primary {
          position:relative; overflow:hidden;
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 26px; border-radius:100px;
          border:1px solid rgba(196,30,58,0.35);
          background:linear-gradient(135deg,rgba(139,0,0,0.5),rgba(196,30,58,0.4));
          color:#f7e7ce; font-family:'Inter',system-ui,sans-serif;
          font-size:13px; font-weight:500; cursor:pointer; letter-spacing:0.3px;
          transition:border-color .25s ease,box-shadow .25s ease,transform .2s ease;
        }
        .rc-btn-primary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(232,80,122,0.18),transparent);
          transform:translateX(-100%); transition:transform .5s ease;
        }
        .rc-btn-primary:hover::before{transform:translateX(100%)}
        .rc-btn-primary:hover{
          border-color:rgba(232,80,122,0.55);
          box-shadow:0 0 24px rgba(196,30,58,0.3), 0 4px 20px rgba(196,30,58,0.2);
          transform:translateY(-1px);
        }
        .rc-btn-primary:active{transform:translateY(0)}

        .rc-btn-copy-ok {
          background:linear-gradient(135deg,#722f37,#c41e3a) !important;
          border-color:rgba(212,168,83,0.4) !important;
          box-shadow:0 0 20px rgba(196,30,58,0.35) !important;
        }

        .rc-btn-ghost {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 22px; border-radius:100px;
          border:1px solid rgba(196,30,58,0.15);
          background:rgba(20,5,12,0.4);
          color:#6b3a3a; font-family:'Inter',system-ui,sans-serif;
          font-size:13px; cursor:pointer; position:relative; overflow:hidden;
          transition:border-color .25s ease,color .25s ease,background .25s ease,transform .2s ease;
        }
        .rc-btn-ghost::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(196,30,58,0.06),transparent);
          transform:translateX(-100%); transition:transform .5s ease;
        }
        .rc-btn-ghost:hover::before{transform:translateX(100%)}
        .rc-btn-ghost:hover{
          border-color:rgba(196,30,58,0.28); color:#9a6060;
          background:rgba(196,30,58,0.032); transform:translateY(-1px);
        }
        .rc-btn-ghost:active{transform:translateY(0)}
      `}</style>

      <section className="rc-root" style={{
        minHeight: "100vh",
        padding: "52px 16px 100px",
        background: "linear-gradient(160deg, #0d0205, #140508, #0e0307)",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient orbs */}
        <div style={{
          position: "absolute", right: "5%", top: "20%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(114,47,55,0.14) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          animation: "orbFlicker 14s ease-in-out infinite alternate",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: "8%", top: "65%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107,45,94,0.12) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          animation: "orbFlicker 11s 2s ease-in-out infinite alternate",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: "50%", top: "40%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,30,58,0.07) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          animation: "orbFlicker 18s 1s ease-in-out infinite alternate",
          pointerEvents: "none",
        }} />

        {/* Particle field */}
        {Array.from({ length: 18 }, (_, i) => ({
          left: (i * 5.8) % 100,
          delay: (i * 0.7) % 12,
          dur: 12 + (i * 1.3) % 10,
          size: 9 + (i * 0.8) % 7,
          glyph: ["♦", "✦", "♥", "✧", "◆", "❧", "✿"][i % 7],
          color: ["#c41e3a", "#9b4d8a", "#d4a853", "#e8507a", "#722f37"][i % 5],
        })).map((p, i) => (
          <span key={i} style={{
            position: "absolute", left: `${p.left}%`, bottom: -20,
            fontSize: p.size, color: p.color, opacity: 0,
            animation: `rcDrift ${p.dur}s ${p.delay}s linear infinite`,
            pointerEvents: "none", userSelect: "none",
          }}>{p.glyph}</span>
        ))}

        {/* Content */}
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* Header */}
          <div style={{
            textAlign: "center", marginBottom: 44,
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-28px)",
            transition: "opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "4px 16px 4px 12px", borderRadius: 100, marginBottom: 20,
              background: "rgba(196,30,58,0.06)",
              border: "1px solid rgba(196,30,58,0.18)",
              fontSize: 11, color: "#e8507a", letterSpacing: 2.5,
              textTransform: "uppercase", fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              <Sparkles size={11} style={{ animation: "rcSpin 8s linear infinite" }} />
              Love Strategy Ready
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 400,
              background: "linear-gradient(135deg, #f7e7ce 0%, #e8b4a0 30%, #e8507a 60%, #9b4d8a 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "rcFadeDown 0.7s 0.1s ease both",
              marginBottom: 10, lineHeight: 1.15,
            }}>
              உங்கள் Love Plan ✨
            </h2>

            <p style={{
              color: "#6b3a3a", fontSize: 14,
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: "italic", letterSpacing: 0.4,
              animation: "rcFadeDown 0.6s 0.2s ease both",
            }}>
              Psychologically crafted, just for your story
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 22 }}>
              {[0, 1].map(k => (
                <div key={k} style={{
                  height: 1, width: 80,
                  background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.4), transparent)",
                  animation: `rcScaleIn 1.1s ${0.4 + k * 0.15}s cubic-bezier(0.22,1,0.36,1) both`,
                }} />
              ))}
              <span style={{ color: "#c41e3a", fontSize: 14, opacity: 0.7 }}>♥</span>
            </div>
          </div>

          {/* Card */}
          <div style={{
            borderRadius: 20, overflow: "hidden",
            background: "linear-gradient(160deg, rgba(20,5,12,0.97), rgba(10,2,6,0.99))",
            border: "1px solid rgba(196,30,58,0.12)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(196,30,58,0.06), 0 0 60px rgba(196,30,58,0.04)",
            animation: "rcScaleIn 0.7s 0.15s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            {/* Topbar */}
            <div style={{
              padding: "14px 22px",
              borderBottom: "1px solid rgba(196,30,58,0.08)",
              background: "rgba(196,30,58,0.025)",
              display: "flex", alignItems: "center", gap: 8,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent 0%, #8b0000 20%, #c41e3a 50%, #9b4d8a 80%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "rcBorderFlow 4s linear infinite",
              }} />
              {["#c41e3a", "#d4a853", "#9b4d8a"].map((c, i) => (
                <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.65 }} />
              ))}
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: "#c41e3a",
                animation: "rcDotPulse 2s ease-in-out infinite", marginLeft: 6,
              }} />
              <span style={{
                fontSize: 11.5, color: "#4a1a20", letterSpacing: 0.8, marginLeft: 2,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                AI Relationship Strategist · 10 Agents
              </span>
            </div>

            <div style={{ padding: "28px 24px" }}>
              <PlanRenderer plan={plan} />
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: "flex", gap: 10, justifyContent: "center",
            marginTop: 28, flexWrap: "wrap",
            animation: "rcFadeUp 0.6s 0.4s ease both",
          }}>
            <button onClick={handleCopy} className={`rc-btn-primary${copied ? " rc-btn-copy-ok" : ""}`}>
              {copied ? <CheckCircle size={15} /> : <ClipboardCopy size={15} />}
              {copied ? "Copied!" : "Copy Plan"}
            </button>
            <button onClick={onReset} className="rc-btn-ghost">
              <RefreshCw size={14} /> New Story
            </button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="rc-btn-ghost">
              <Heart size={14} /> Back to Top
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", bottom: 80, left: "50%",
            zIndex: 100, display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 100,
            background: "rgba(20,5,12,0.9)", border: "1px solid rgba(196,30,58,0.35)",
            color: "#e8b4a0", fontSize: 13,
            fontFamily: "'Inter', system-ui, sans-serif",
            backdropFilter: "blur(12px)",
            animation: "rcToast 2.6s cubic-bezier(0.34,1.56,0.64,1) both",
            whiteSpace: "nowrap",
          }}>
            <CheckCircle size={13} style={{ color: "#c41e3a" }} />
            Plan copied to clipboard
          </div>
        )}

        <ScrollFAB />
      </section>
    </>
  );
};

export default ResultCard;