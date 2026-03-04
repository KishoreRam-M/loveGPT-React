import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   REALISTIC ROMANCE OVERLAY
   Tasteful, cinematic — not chaotic.
   
   What's here:
   - 8 subtle floating hearts (gentle, slow, sparse)
   - 6 rose petals drifting softly 
   - 40 twinkling stars in upper sky
   - Glitter click burst (small, tasteful)
   - Single ripple ring on click
   - Shooting star every ~8s
   - Candlelight orbs (ambient only)
   - Heart confetti ONLY on result reveal
   
   What's NOT here:
   - No cursor sparkle trail  
   - No emoji rain
   - No button flashing every 4s
   - No dot color cycling
   - No score bar flashing
   
   ZERO logic changes.
═══════════════════════════════════════════════════════════════ */

/* Romantic palette */
const ROSE_PALETTE = ["#e8507a", "#f4839d", "#c41e3a", "#e8b4a0", "#d4a853"];
const STAR_PALETTE = ["#f7e7ce", "#e8b4a0", "#f9c0c8", "#ffffff", "#d4a853"];

/* ── 8 slow, gentle hearts ── */
function seedHearts(container: HTMLElement) {
    const positions = [8, 18, 30, 45, 55, 67, 80, 92]; // spread left→right
    positions.forEach((left, i) => {
        const el = document.createElement("span");
        const size = 10 + Math.random() * 12; // 10–22px
        const dur = 14 + Math.random() * 10; // 14–24s slow
        const delay = i * 2 + Math.random() * 4;
        const color = ROSE_PALETTE[i % ROSE_PALETTE.length];
        Object.assign(el.style, {
            position: "absolute",
            bottom: "-20px",
            left: `${left}%`,
            fontSize: `${size}px`,
            color,
            filter: `drop-shadow(0 0 ${Math.round(size * 0.3)}px ${color}66)`,
            opacity: "0",
            pointerEvents: "none",
            userSelect: "none",
            animation: `heartRise ${dur}s ${delay}s ease-in-out infinite`,
        });
        el.textContent = "♥";
        container.appendChild(el);
    });
}

/* ── 6 rose petals ── */
function seedPetals(container: HTMLElement) {
    const leftPositions = [5, 20, 38, 55, 72, 88];
    const petalGlyphs = ["✿", "❀", "🌸", "✿", "❀", "✿"];
    leftPositions.forEach((left, i) => {
        const el = document.createElement("span");
        const size = 11 + Math.random() * 9;
        const dur = 16 + Math.random() * 12; // 16–28s very slow
        const delay = i * 3.5 + Math.random() * 5;
        const pinkShades = ["#f4839d", "#f9c0c8", "#e8b4a0", "#e8507a"];
        const color = pinkShades[i % pinkShades.length];
        Object.assign(el.style, {
            position: "absolute",
            top: "-20px",
            left: `${left}%`,
            fontSize: `${size}px`,
            color,
            opacity: "0",
            pointerEvents: "none",
            userSelect: "none",
            animation: `petalDrift ${dur}s ${delay}s ease-in-out infinite`,
        });
        el.textContent = petalGlyphs[i];
        container.appendChild(el);
    });
}

/* ── 40 twinkling stars ── */
function seedStars(container: HTMLElement) {
    for (let i = 0; i < 40; i++) {
        const el = document.createElement("div");
        const size = 1 + Math.random() * 2.5;  // 1–3.5px
        const top = Math.random() * 55;         // top 55% of viewport
        const left = Math.random() * 100;
        const dur = 2 + Math.random() * 4;
        const delay = Math.random() * 6;
        const color = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
        // Only draw round dots (no emojis) for subtlety
        Object.assign(el.style, {
            position: "absolute",
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${size * 2}px ${color}88`,
            pointerEvents: "none",
            animation: `twinkle ${dur}s ${delay}s ease-in-out infinite`,
        });
        container.appendChild(el);
    }
}

/* ── Click: small tasteful glitter burst (12 particles) ── */
function spawnGlitter(x: number, y: number) {
    const count = 12;
    for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        const angle = (360 / count) * i;
        const dist = 25 + Math.random() * 35;
        const rad = (angle * Math.PI) / 180;
        const gx = Math.cos(rad) * dist;
        const gy = Math.sin(rad) * dist;
        const size = 2.5 + Math.random() * 3;
        const color = ROSE_PALETTE[Math.floor(Math.random() * ROSE_PALETTE.length)];
        el.style.position = "fixed";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = "50%";
        el.style.background = color;
        el.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        el.style.pointerEvents = "none";
        el.style.zIndex = "99999";
        el.style.animation = "glitterBurst 0.5s ease-out forwards";
        el.style.setProperty("--gx", `${gx}px`);
        el.style.setProperty("--gy", `${gy}px`);
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 600);
    }

    // Single small heart pop
    if (Math.random() > 0.4) {
        const heart = document.createElement("span");
        heart.textContent = "♥";
        const color = ROSE_PALETTE[Math.floor(Math.random() * ROSE_PALETTE.length)];
        Object.assign(heart.style, {
            position: "fixed",
            left: `${x - 8}px`,
            top: `${y - 8}px`,
            fontSize: "14px",
            color,
            filter: `drop-shadow(0 0 4px ${color})`,
            pointerEvents: "none",
            zIndex: "99999",
            userSelect: "none",
            animation: "heartRise 0.9s ease-out forwards",
        });
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
}

/* ── Single ripple ring ── */
function spawnRipple(x: number, y: number) {
    const el = document.createElement("div");
    Object.assign(el.style, {
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        width: "40px",
        height: "40px",
        marginLeft: "-20px",
        marginTop: "-20px",
        borderRadius: "50%",
        border: "1.5px solid rgba(196,30,58,0.7)",
        pointerEvents: "none",
        zIndex: "99998",
        animation: "loveRipple 0.7s ease-out forwards",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

/* ── Shooting star ── */
function spawnShootingStar(container: HTMLElement) {
    const el = document.createElement("div");
    const colors = ["#f7e7ce", "#e8b4a0", "#f4839d"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const top = Math.random() * 40;
    const dur = 2 + Math.random() * 1.5;
    Object.assign(el.style, {
        position: "absolute",
        top: `${top}%`,
        left: "-120px",
        width: `${70 + Math.random() * 80}px`,
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${color}, rgba(255,255,255,0.8), transparent)`,
        borderRadius: "50%",
        pointerEvents: "none",
        animation: `shootingStar ${dur}s linear forwards`,
    });
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 0.5) * 1000);
}

/* ── Heart confetti (only on result, one time) ── */
function spawnHeartConfetti() {
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
        position: "fixed",
        inset: "0",
        pointerEvents: "none",
        zIndex: "9999",
        overflow: "hidden",
    });
    document.body.appendChild(wrapper);

    for (let i = 0; i < 40; i++) {
        const el = document.createElement("span");
        const color = ROSE_PALETTE[Math.floor(Math.random() * ROSE_PALETTE.length)];
        const dur = 2.5 + Math.random() * 2;
        const delay = Math.random() * 1.5;
        const rot = -360 + Math.random() * 720;
        el.textContent = ["♥", "♡", "✿", "★"][Math.floor(Math.random() * 4)];
        el.style.position = "absolute";
        el.style.top = "-20px";
        el.style.left = `${Math.random() * 100}vw`;
        el.style.fontSize = `${10 + Math.random() * 14}px`;
        el.style.color = color;
        el.style.opacity = "0.85";
        el.style.pointerEvents = "none";
        el.style.animation = `confettiHeartFall ${dur}s ${delay}s ease-in forwards`;
        el.style.setProperty("--rot", `${rot}`);
        wrapper.appendChild(el);
    }
    setTimeout(() => wrapper.remove(), 6000);
}

/* ═══════════ MAIN COMPONENT ═══════════════════════════════════ */
export default function AnimationOverlay() {
    const shootRef = useRef<HTMLDivElement>(null);
    const confettiDone = useRef(false);

    useEffect(() => {
        /* ── Vignette ── */
        const vignette = document.createElement("div");
        Object.assign(vignette.style, {
            position: "fixed",
            inset: "0",
            pointerEvents: "none",
            zIndex: "1",
            background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(6,1,2,0.55) 100%)",
        });
        document.body.prepend(vignette);

        /* ── Rose petals ── */
        const petalCont = document.createElement("div");
        Object.assign(petalCont.style, {
            position: "fixed", inset: "0", pointerEvents: "none", zIndex: "2", overflow: "hidden",
        });
        document.body.prepend(petalCont);
        seedPetals(petalCont);

        /* ── Floating hearts ── */
        const heartCont = document.createElement("div");
        Object.assign(heartCont.style, {
            position: "fixed", inset: "0", pointerEvents: "none", zIndex: "2", overflow: "hidden",
        });
        document.body.prepend(heartCont);
        seedHearts(heartCont);

        /* ── Stars ── */
        const starCont = document.createElement("div");
        Object.assign(starCont.style, {
            position: "fixed", inset: "0", pointerEvents: "none", zIndex: "1", overflow: "hidden",
        });
        document.body.prepend(starCont);
        seedStars(starCont);

        /* ── Click: glitter + ripple ── */
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
            spawnGlitter(e.clientX, e.clientY);
            spawnRipple(e.clientX, e.clientY);
        };
        document.addEventListener("click", handleClick);

        /* ── Shooting stars ~every 8s ── */
        let shootInt: ReturnType<typeof setInterval>;
        if (shootRef.current) {
            const sc = shootRef.current;
            setTimeout(() => spawnShootingStar(sc), 3000);
            shootInt = setInterval(() => spawnShootingStar(sc), 8000 + Math.random() * 4000);
        }

        /* ── Watch for result → one confetti burst ── */
        const resultObs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !confettiDone.current) {
                confettiDone.current = true;
                spawnHeartConfetti();
                resultObs.disconnect();
            }
        }, { threshold: 0.1 });

        const domObs = new MutationObserver(() => {
            const re = document.getElementById("result-section") || document.querySelector(".rc-root");
            if (re) resultObs.observe(re);
        });
        domObs.observe(document.body, { childList: true, subtree: true });

        const existing = document.getElementById("result-section") || document.querySelector(".rc-root");
        if (existing) resultObs.observe(existing);

        return () => {
            document.removeEventListener("click", handleClick);
            clearInterval(shootInt);
            resultObs.disconnect();
            domObs.disconnect();
            vignette.remove();
            petalCont.remove();
            heartCont.remove();
            starCont.remove();
        };
    }, []);

    return (
        /* Shooting stars layer */
        <div
            ref={shootRef}
            style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2, overflow: "hidden" }}
            aria-hidden="true"
        />
    );
}
