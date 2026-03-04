import { Github, Linkedin } from "lucide-react";

/* ═══════════════════════════════
   FOOTER — Design System
═══════════════════════════════ */

const Footer = () => (
  <>
    <style>{`
      .footer-root {
        position: relative;
        overflow: hidden;
        padding: 64px 24px 40px;
        font-family: 'EB Garamond', Georgia, serif;
      }

      /* Top border accent */
      .footer-top-border {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(196,30,58,0.6) 25%,
          #e8507a 50%,
          rgba(212,168,83,0.5) 75%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: borderFlow 5s linear infinite;
        box-shadow: 0 0 10px rgba(196,30,58,0.2);
      }

      /* Orbs */
      .footer-orb-l {
        position: absolute;
        width: 360px; height: 360px;
        top: -60px; left: -80px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(107,45,94,0.14) 0%, transparent 70%);
        filter: blur(80px);
        pointer-events: none;
        animation: orbFlicker 12s ease-in-out infinite alternate;
      }
      .footer-orb-r {
        position: absolute;
        width: 280px; height: 280px;
        top: -40px; right: -60px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(140,10,30,0.12) 0%, transparent 70%);
        filter: blur(80px);
        pointer-events: none;
        animation: orbFlicker 15s 3s ease-in-out infinite alternate;
      }

      .footer-inner {
        position: relative;
        z-index: 5;
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      /* Brand */
      .footer-brand {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .footer-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 3px 12px;
        border-radius: 999px;
        background: rgba(196,30,58,0.07);
        border: 1px solid rgba(196,30,58,0.18);
        font-family: 'Inter', sans-serif;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: #f07da0;
        margin-bottom: 8px;
      }
      .footer-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 26px;
        font-weight: 700;
        background: linear-gradient(135deg, #f9c0c8 0%, #e8507a 40%, #c41e3a 70%, #d4a853 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        background-size: 200% 200%;
        animation: gradientShift 6s ease infinite;
        line-height: 1.2;
      }
      .footer-sub {
        font-size: 13px;
        color: #6b3a3a;
        font-style: italic;
        margin-top: 2px;
      }

      /* Divider */
      .footer-divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(196,30,58,0.18), transparent);
      }

      /* Creator */
      .footer-creator {
        font-size: 15px;
        color: #6b3a3a;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .footer-creator-name {
        font-weight: 500;
        color: #e8b4a0;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
      }
      .footer-heart {
        color: #c41e3a;
        font-size: 14px;
        filter: drop-shadow(0 0 4px rgba(196,30,58,0.5));
      }

      /* Links */
      .footer-links {
        display: flex;
        gap: 12px;
      }
      .footer-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 18px;
        border-radius: 999px;
        background: rgba(196,30,58,0.04);
        border: 1px solid rgba(196,30,58,0.14);
        color: #a07070;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        text-decoration: none;
        transition: all 0.25s ease;
        cursor: pointer;
      }
      .footer-link:hover {
        background: rgba(196,30,58,0.08);
        border-color: rgba(196,30,58,0.32);
        color: #f4839d;
        transform: translateY(-2px);
        box-shadow: 0 0 14px rgba(196,30,58,0.10);
      }

      /* Copyright */
      .footer-copy {
        font-size: 12px;
        color: #3a1a1a;
        letter-spacing: 0.5px;
      }
    `}</style>

    <footer className="footer-root">
      <div className="footer-top-border" />
      <div className="footer-orb-l" />
      <div className="footer-orb-r" />

      <div className="footer-inner">
        {/* Brand block */}
        <div className="footer-brand">
          <div className="footer-badge">
            <span className="ds-badge-dot" />
            AI Powered
          </div>
          <div className="footer-title">LoveGPT Tamil</div>
          <div className="footer-sub">AI-Powered Love Advisor</div>
        </div>

        <div className="footer-divider" />

        {/* Creator */}
        <div className="footer-creator">
          Created with <span className="footer-heart">♥</span> by
          <span className="footer-creator-name">Kishore Ram M</span>
        </div>

        {/* Links */}
        <div className="footer-links">
          <a
            className="footer-link"
            href="https://github.com/KishoreRam-M"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={14} />
            GitHub
          </a>
          <a
            className="footer-link"
            href="https://linkedin.com/in/kishorerammuthukrishnan"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
        </div>

        <div className="footer-divider" />

        {/* Copyright */}
        <p className="footer-copy">
          © 2026 LoveGPT Tamil · Built with ♥ in Tamil Nadu
        </p>
      </div>
    </footer>
  </>
);

export default Footer;
