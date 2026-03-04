import {
  Globe, Key, Link2, Sparkles, Copy, ClipboardPaste,
  PenLine, Heart, User, Users, MapPin, Clock,
  MessageCircle, HeartHandshake, HelpCircle, Target, Star,
  ChevronDown, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════
   USER GUIDE — How to Get a Gemini API Key + Story Format
   Full, accurate instructional content.
═══════════════════════════════════════════════════════ */

/* ── Tab definitions ── */
type Tab = "api" | "story";

/* ── API steps ── */
type ApiStep = { icon: LucideIcon; title: string; desc: string; link?: string; linkLabel?: string };

const API_STEPS: ApiStep[] = [
  {
    icon: Globe,
    title: "Create a Google Cloud Project",
    desc: "Go to Google Cloud Console and create a new project. This project will manage your Gemini API access.",
    link: "https://console.cloud.google.com",
    linkLabel: "console.cloud.google.com",
  },
  {
    icon: Sparkles,
    title: "Open Google AI Studio",
    desc: "Visit Google AI Studio — the hub for accessing and managing Gemini AI models.",
    link: "https://aistudio.google.com",
    linkLabel: "aistudio.google.com",
  },
  {
    icon: Link2,
    title: "Select or Link Your Project",
    desc: "Inside Google AI Studio, select or link the Google Cloud project you created in Step 1.",
  },
  {
    icon: Key,
    title: "Generate a Gemini API Key",
    desc: "Click \"Get API Key\" and create a new Gemini API key for your project. It's completely free.",
  },
  {
    icon: Copy,
    title: "Copy the API Key",
    desc: "Copy the generated API key. Keep it secure — treat it like a password. Never share it publicly.",
  },
  {
    icon: ClipboardPaste,
    title: "Paste the Key in LoveGPT",
    desc: "Open the LoveGPT form above, paste your API key in the \"Gemini API Key\" field, write your story, and submit.",
  },
];

const API_COLORS = ["#c41e3a", "#9b4d8a", "#e8507a", "#d4a853", "#722f37", "#e8b4a0"];

/* ── Story format sections ── */
type StorySection = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  questions: string[];
  example: string;
};

const STORY_SECTIONS: StorySection[] = [
  {
    icon: User,
    title: "Basic Information",
    subtitle: "Provide the essential details about both people.",
    questions: ["Your name", "Their name", "Where you met (college, office, Instagram, etc.)", "How long you have known each other"],
    example: "Your Name: Arjun\nTheir Name: Meera\nWhere you met: College cultural event\nKnown each other: 1 year",
  },
  {
    icon: MessageCircle,
    title: "First Interaction",
    subtitle: "Describe the first time you noticed or spoke to them.",
    questions: ["When did you first see them?", "What did you feel?", "What happened during the first conversation?"],
    example: "I first noticed her during a college event. She was organizing the program and looked very confident. Later, I helped her fix a website issue for the event, which became our first real conversation.",
  },
  {
    icon: HeartHandshake,
    title: "Relationship Development",
    subtitle: "Explain how the relationship grew over time.",
    questions: ["How did your conversations start?", "Did you become friends?", "Did you spend time together?"],
    example: "We started talking daily about college work. Over time, we became close friends and started sharing personal stories.",
  },
  {
    icon: Heart,
    title: "Feelings",
    subtitle: "Explain your emotions toward the person.",
    questions: ["When did you start liking them?", "What do you admire about them?"],
    example: "After a few months, I realized I liked her. I admire her confidence and the way she supports everyone around her.",
  },
  {
    icon: Users,
    title: "Current Situation",
    subtitle: "Explain what is happening right now.",
    questions: ["Are you friends?", "Are you in love?", "Are you unsure about their feelings?"],
    example: "We are very good friends now, but I am not sure if she likes me the same way.",
  },
  {
    icon: HelpCircle,
    title: "Challenge or Problem",
    subtitle: "Explain what is stopping the relationship.",
    questions: ["Fear of rejection?", "Long-distance?", "Friend zone?", "Already in another relationship?"],
    example: "I am afraid to confess my feelings because I don't want to lose our friendship.",
  },
  {
    icon: Target,
    title: "What You Want",
    subtitle: "Explain your goal clearly.",
    questions: ["Do you want to confess your feelings?", "Improve the relationship?", "Ask them on a date?"],
    example: "I want to confess my feelings and ask her out for a date.",
  },
  {
    icon: Star,
    title: "Extra Details (Optional)",
    subtitle: "Add any information that helps the AI understand the situation better.",
    questions: ["Their interests (books, music, sports…)", "Their personality traits", "Any cultural or family context"],
    example: "She likes books, coffee, and traveling. She is very emotional and sensitive.",
  },
];

const STORY_COLORS = ["#c41e3a", "#9b4d8a", "#e8507a", "#d4a853", "#722f37", "#e8b4a0", "#f4839d", "#d4a853"];

/* ── Full example ── */
const FULL_EXAMPLE = `Your Name: Arjun
Their Name: Meera
Where you met: College
Known each other: 1 year

First Interaction:
I helped her fix a website for the college event.

Relationship Development:
We started talking daily and became very close friends.

Feelings:
I realized I like her because she is kind and confident.

Current Situation:
We are good friends but I don't know her feelings.

Challenge:
I am afraid of losing our friendship.

Goal:
I want to confess my love and ask her on a date.

Extra Details:
She loves books and coffee.`;

/* ─────────────────────────────────── */

const UserGuide = () => {
  const [tab, setTab] = useState<Tab>("api");
  const [openStory, setOpenStory] = useState<number | null>(null);
  const [headerVis, setHeaderVis] = useState(false);
  const [stepsVis, setStepsVis] = useState<boolean[]>(new Array(API_STEPS.length).fill(false));
  const [copied, setCopied] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const hObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVis(true); hObs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (headerRef.current) hObs.observe(headerRef.current);

    const sObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = stepRefs.current.indexOf(entry.target as HTMLDivElement);
          if (idx >= 0) setStepsVis(prev => { const n = [...prev]; n[idx] = true; return n; });
        }
      });
    }, { threshold: 0.1 });
    stepRefs.current.forEach(el => { if (el) sObs.observe(el); });

    return () => { hObs.disconnect(); sObs.disconnect(); };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(FULL_EXAMPLE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{`
        .ug-root {
          padding: 80px 24px 96px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient orbs */
        .ug-orb-r {
          position: absolute; width: 380px; height: 380px;
          top: -60px; right: -80px; border-radius: 50%;
          background: radial-gradient(circle, rgba(114,47,55,0.14)0%,transparent 70%);
          filter: blur(90px); pointer-events: none;
          animation: orbFlicker 14s ease-in-out infinite alternate;
        }
        .ug-orb-l {
          position: absolute; width: 300px; height: 300px;
          bottom: 0; left: -60px; border-radius: 50%;
          background: radial-gradient(circle, rgba(107,45,94,0.12)0%,transparent 70%);
          filter: blur(90px); pointer-events: none;
          animation: orbFlicker 18s 4s ease-in-out infinite alternate;
        }

        /* Tab bar */
        .ug-tab-bar {
          display: flex;
          gap: 6px;
          background: rgba(196,30,58,0.04);
          border: 1px solid rgba(196,30,58,0.12);
          border-radius: 999px;
          padding: 5px;
          margin-bottom: 44px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        .ug-tab {
          padding: 8px 22px;
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.22s ease;
          white-space: nowrap;
        }
        .ug-tab-active {
          background: linear-gradient(135deg, #8b0000, #c41e3a);
          color: #f7e7ce;
          box-shadow: 0 2px 12px rgba(196,30,58,0.35);
        }
        .ug-tab-inactive {
          background: transparent;
          color: #6b3a3a;
        }
        .ug-tab-inactive:hover {
          color: #a07070;
          background: rgba(196,30,58,0.05);
        }

        /* API step card */
        .ug-step-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding: 18px 20px 18px 22px;
          border-radius: 14px;
          border: 1px solid rgba(196,30,58,0.10);
          background: rgba(20,5,12,0.5);
          position: relative; overflow: hidden;
          cursor: default;
          transition: border-color 0.25s ease, background 0.25s ease,
                      transform 0.22s ease, box-shadow 0.25s ease;
        }
        .ug-step-card:hover {
          border-color: rgba(196,30,58,0.24);
          background: rgba(196,30,58,0.032);
          transform: translateX(5px);
          box-shadow: -2px 0 16px rgba(196,30,58,0.07);
        }
        /* Left bar */
        .ug-step-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 2.5px;
          border-radius: 2px 0 0 2px; opacity: 0;
          transition: opacity 0.25s ease;
        }
        .ug-step-card:hover .ug-step-bar { opacity: 1; }
        /* Step num label */
        .ug-step-num {
          font-family: 'Inter', sans-serif;
          font-size: 10.5px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 3px;
        }
        /* Step title */
        .ug-step-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px; font-weight: 500;
          color: #f7e7ce; line-height: 1.45; margin-bottom: 5px;
        }
        /* Step desc */
        .ug-step-desc {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13.5px; color: #6b3a3a;
          font-style: italic; line-height: 1.65;
          transition: color 0.25s ease;
        }
        .ug-step-card:hover .ug-step-desc { color: #9a6060; }
        /* Step link */
        .ug-step-link {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 11.5px; color: #c41e3a;
          text-decoration: none;
          border-bottom: 1px solid rgba(196,30,58,0.25);
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }
        .ug-step-link:hover { color: #e8507a; border-color: rgba(232,80,122,0.4); }
        /* Watermark */
        .ug-step-wm {
          flex-shrink: 0; font-family: 'Playfair Display', Georgia, serif;
          font-size: 30px; font-weight: 700; line-height: 1;
          user-select: none; transition: color 0.25s;
        }
        /* Connector */
        .ug-conn-wrap {
          height: 14px; display: flex; justify-content: center; align-items: center;
        }
        .ug-conn-line {
          width: 1px;
          background: linear-gradient(180deg, rgba(196,30,58,0.30), transparent);
          transition: height 0.3s ease, opacity 0.3s ease;
        }

        /* Story accordion */
        .ug-accordion {
          border: 1px solid rgba(196,30,58,0.10);
          border-radius: 14px;
          overflow: hidden;
          background: rgba(20,5,12,0.5);
          transition: border-color 0.25s ease;
          margin-bottom: 6px;
        }
        .ug-accordion:hover,
        .ug-accordion.open { border-color: rgba(196,30,58,0.22); }
        .ug-accordion-header {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s ease;
          user-select: none;
        }
        .ug-accordion-header:hover { background: rgba(196,30,58,0.03); }
        .ug-accordion-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 14.5px; font-weight: 500; color: #f7e7ce;
          flex: 1;
        }
        .ug-accordion-sub {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13px; color: #6b3a3a; font-style: italic;
          margin-top: 1px;
        }
        .ug-accordion-body {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
        }
        .ug-accordion-inner {
          padding: 0 20px 20px;
          border-top: 1px solid rgba(196,30,58,0.07);
        }
        /* Questions */
        .ug-q-list {
          list-style: none; padding: 0; margin: 14px 0;
          display: flex; flex-direction: column; gap: 6px;
        }
        .ug-q-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 14px; color: #a07070; font-style: italic;
          line-height: 1.6;
        }
        .ug-q-bullet {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(196,30,58,0.5); flex-shrink: 0; margin-top: 7px;
        }
        /* Example block */
        .ug-example-block {
          background: rgba(196,30,58,0.04);
          border: 1px solid rgba(196,30,58,0.10);
          border-left: 3px solid rgba(196,30,58,0.35);
          border-radius: 0 8px 8px 0;
          padding: 12px 14px;
        }
        .ug-example-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(196,30,58,0.6);
          margin-bottom: 7px;
        }
        .ug-example-text {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13.5px; color: #a07070;
          font-style: italic; line-height: 1.7;
          white-space: pre-wrap;
        }

        /* Full example */
        .ug-full-ex {
          border-radius: 14px;
          border: 1px solid rgba(196,30,58,0.14);
          overflow: hidden;
          margin-top: 32px;
        }
        .ug-full-ex-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          background: rgba(196,30,58,0.04);
          border-bottom: 1px solid rgba(196,30,58,0.10);
        }
        .ug-full-ex-title {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(196,30,58,0.7);
        }
        .ug-copy-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 13px; border-radius: 999px;
          background: rgba(196,30,58,0.06);
          border: 1px solid rgba(196,30,58,0.15);
          color: #a07070; font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; cursor: pointer;
          transition: all 0.2s ease;
        }
        .ug-copy-btn:hover {
          background: rgba(196,30,58,0.10);
          border-color: rgba(196,30,58,0.28);
          color: #f4839d;
        }
        .ug-full-ex-body {
          padding: 18px 20px;
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 14px; color: #7a4a4a;
          font-style: italic; line-height: 1.85;
          white-space: pre-wrap;
          background: rgba(10,2,6,0.5);
        }

        /* Notes */
        .ug-note-list {
          display: flex; flex-direction: column; gap: 8px;
          margin-top: 28px;
        }
        .ug-note {
          display: flex; align-items: flex-start; gap: 10px;
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13.5px; color: #6b3a3a;
          font-style: italic; line-height: 1.65;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(196,30,58,0.025);
          border: 1px solid rgba(196,30,58,0.07);
        }
        .ug-note-icon { color: #c41e3a; flex-shrink: 0; margin-top: 2px; }

        /* Free pill */
        .ug-free-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 20px; border-radius: 999px;
          border: 1px solid rgba(196,30,58,0.18);
          background: rgba(196,30,58,0.04);
          font-size: 13px; color: #a07070;
          font-style: italic;
          font-family: 'EB Garamond', Georgia, serif;
        }

        /* Chevron */
        .ug-chevron {
          color: #4a2828; flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), color 0.2s;
        }
        .ug-chevron.open { transform: rotate(90deg); color: #c41e3a; }
      `}</style>

      <section id="user-guide" className="ug-root">
        <div className="ug-orb-r" />
        <div className="ug-orb-l" />

        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* ── Section Header ── */}
          <div
            ref={headerRef}
            style={{
              textAlign: "center", marginBottom: 36,
              opacity: headerVis ? 1 : 0,
              transform: headerVis ? "translateY(0)" : "translateY(-18px)",
              transition: "opacity 0.7s ease, transform 0.7s var(--ease-out)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div className="ds-badge">
                <Sparkles size={11} style={{ opacity: 0.8 }} />
                Complete Guide
              </div>
            </div>
            <h2 className="ds-section-title">
              How to Use <em>LoveGPT</em>
            </h2>
            <p className="ds-section-subtitle">
              Get your free Gemini API key in minutes and write your first love plan.
            </p>
            <div className="ds-divider" style={{ marginTop: 20 }}>
              <div className="ds-divider-line" />
              <span className="ds-divider-glyph">♥</span>
              <div className="ds-divider-line" />
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div className="ug-tab-bar">
            {(["api", "story"] as Tab[]).map(t => (
              <button
                key={t}
                className={`ug-tab ${tab === t ? "ug-tab-active" : "ug-tab-inactive"}`}
                onClick={() => setTab(t)}
              >
                {t === "api" ? "🔑  Get API Key" : "✍️  Story Format"}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════
              TAB A — Get API Key (6 steps)
          ══════════════════════════════════════ */}
          {tab === "api" && (
            <div>
              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {API_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const color = API_COLORS[i % API_COLORS.length];
                  const isLast = i === API_STEPS.length - 1;

                  return (
                    <div key={i}>
                      <div
                        ref={el => { stepRefs.current[i] = el; }}
                        className="ug-step-card"
                        style={{
                          opacity: stepsVis[i] ? 1 : 0,
                          transform: stepsVis[i] ? "translateX(0)" : "translateX(-16px)",
                          transition: `opacity 0.5s ${i * 0.07}s ease, transform 0.5s ${i * 0.07}s ease`,
                        }}
                      >
                        <div className="ug-step-bar" style={{ background: `linear-gradient(180deg,${color},transparent)` }} />

                        {/* Icon badge */}
                        <div
                          className="ds-icon-badge"
                          style={{
                            background: `${color}14`,
                            border: `1px solid ${color}30`,
                            color,
                            animation: stepsVis[i]
                              ? `scaleIn 0.4s ${i * 0.07 + 0.12}s cubic-bezier(0.34,1.56,0.64,1) both`
                              : "none",
                          }}
                        >
                          <Icon size={17} />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="ug-step-num" style={{ color }}>Step {i + 1}</div>
                          <div className="ug-step-title">{step.title}</div>
                          <div className="ug-step-desc">{step.desc}</div>
                          {step.link && (
                            <a
                              href={step.link}
                              target="_blank"
                              rel="noreferrer"
                              className="ug-step-link"
                            >
                              <Globe size={10} />
                              {step.linkLabel || step.link}
                            </a>
                          )}
                        </div>

                        {/* Watermark */}
                        <div className="ug-step-wm" style={{ color: `${color}15` }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {!isLast && (
                        <div className="ug-conn-wrap">
                          <div
                            className="ug-conn-line"
                            style={{
                              height: stepsVis[i] ? 14 : 0,
                              opacity: stepsVis[i] ? 1 : 0,
                              transition: `height 0.3s ${i * 0.07 + 0.2}s ease, opacity 0.3s ${i * 0.07 + 0.2}s ease`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              <div className="ug-note-list">
                {[
                  "You only need one Google Cloud project to generate a Gemini API key.",
                  "If you use paid Gemini models, responses depend on your usage limits and billing plan.",
                  "The same API key can generate multiple requests within the application.",
                ].map((note, i) => (
                  <div key={i} className="ug-note">
                    <span className="ug-note-icon">♥</span>
                    {note}
                  </div>
                ))}
              </div>

              {/* Free pill */}
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <div className="ug-free-pill" style={{ display: "inline-flex" }}>
                  <span style={{ color: "#d4a853" }}>♥</span>
                  Free to use · No credit card required · Your key stays private
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB B — Story Format
          ══════════════════════════════════════ */}
          {tab === "story" && (
            <div>
              <p style={{
                textAlign: "center",
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 15, fontStyle: "italic", color: "#7a4a4a",
                marginBottom: 28, lineHeight: 1.7,
              }}>
                The more detail you share, the more precise and personalised your love strategy will be.
              </p>

              {/* Accordion sections */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {STORY_SECTIONS.map((section, i) => {
                  const Icon = section.icon;
                  const color = STORY_COLORS[i % STORY_COLORS.length];
                  const isOpen = openStory === i;

                  return (
                    <div
                      key={i}
                      className={`ug-accordion ${isOpen ? "open" : ""}`}
                    >
                      {/* Header (clickable) */}
                      <div
                        className="ug-accordion-header"
                        onClick={() => setOpenStory(isOpen ? null : i)}
                      >
                        <div
                          className="ds-icon-badge"
                          style={{ background: `${color}12`, border: `1px solid ${color}28`, color, flexShrink: 0 }}
                        >
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="ug-accordion-title">
                            <span style={{ color: `${color}cc`, fontSize: "0.82em", fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginRight: 8 }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            {section.title}
                          </div>
                          <div className="ug-accordion-sub">{section.subtitle}</div>
                        </div>
                        <ChevronRight
                          size={15}
                          className={`ug-chevron ${isOpen ? "open" : ""}`}
                        />
                      </div>

                      {/* Body */}
                      <div
                        className="ug-accordion-body"
                        style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
                      >
                        <div className="ug-accordion-inner">
                          {/* Questions */}
                          <ul className="ug-q-list">
                            {section.questions.map((q, qi) => (
                              <li key={qi} className="ug-q-item">
                                <span className="ug-q-bullet" />
                                {q}
                              </li>
                            ))}
                          </ul>
                          {/* Example */}
                          <div className="ug-example-block">
                            <div className="ug-example-label">Example</div>
                            <div className="ug-example-text">{section.example}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full example */}
              <div className="ug-full-ex">
                <div className="ug-full-ex-header">
                  <div className="ug-full-ex-title">Full Example Input</div>
                  <button className="ug-copy-btn" onClick={handleCopy}>
                    {copied ? (
                      <><span>✓</span> Copied!</>
                    ) : (
                      <><Copy size={11} /> Copy</>
                    )}
                  </button>
                </div>
                <div className="ug-full-ex-body">{FULL_EXAMPLE}</div>
              </div>

              {/* Tip note */}
              <div className="ug-note-list">
                <div className="ug-note">
                  <span className="ug-note-icon">♥</span>
                  Be honest and specific. All input is confidential and goes directly to Gemini AI — never stored.
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default UserGuide;