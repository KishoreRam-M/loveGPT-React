import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  /** When true, renders the full styled nav pill variant (for use in navbars) */
  styled?: boolean;
}

/**
 * NavLink — router-aware anchor with optional design-system styling.
 *
 * Plain mode (default): pure logic wrapper, passes className + active/pending
 * classes exactly as before.
 *
 * Styled mode (styled={true}): renders as a sci-fi pill nav item that matches
 * the LoveGPT Tamil design system — inactive state is ghost/muted, active
 * state lights up with Sky Blue glow + borderFlow top edge + dotPulse indicator.
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      styled = false,
      children,
      ...props
    },
    ref,
  ) => {
    if (!styled) {
      // ── Original behaviour — zero visual change ──────────────────────────
      return (
        <RouterNavLink
          ref={ref}
          to={to}
          className={({ isActive, isPending }) =>
            cn(
              className,
              isActive && activeClassName,
              isPending && pendingClassName,
            )
          }
          {...props}
        >
          {children}
        </RouterNavLink>
      );
    }

    // ── Styled nav-pill variant ───────────────────────────────────────────
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

          @keyframes nlBorderFlow {
            0%   { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          @keyframes nlDotPulse {
            0%,100% { box-shadow: 0 0 4px #38bdf8; transform: scale(1); }
            50%      { box-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf855; transform: scale(1.35); }
          }
          @keyframes nlShine {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .nl-pill {
            font-family: 'DM Sans', system-ui, sans-serif;
            position:        relative;
            display:         inline-flex;
            align-items:     center;
            gap:             7px;
            padding:         6px 16px;
            border-radius:   100px;
            border:          1px solid rgba(255,255,255,0.06);
            background:      rgba(255,255,255,0.025);
            color:           #64748b;
            font-size:       13px;
            font-weight:     400;
            letter-spacing:  0.2px;
            text-decoration: none;
            overflow:        hidden;
            transition:
              border-color 0.25s ease,
              color        0.25s ease,
              background   0.25s ease,
              box-shadow   0.25s ease;
          }

          /* Shine sweep on hover */
          .nl-pill::after {
            content:    '';
            position:   absolute;
            inset:      0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(56,189,248,0.1),
              transparent
            );
            transform:  translateX(-100%);
            transition: transform 0.45s ease;
          }
          .nl-pill:hover::after  { transform: translateX(100%); }

          /* Hover — ghost brightened */
          .nl-pill:hover {
            border-color: rgba(56,189,248,0.22);
            color:        #94a3b8;
            background:   rgba(56,189,248,0.05);
          }

          /* Pending — amber tint */
          .nl-pill--pending {
            border-color: rgba(251,191,36,0.2);
            color:        #fbbf24;
            background:   rgba(251,191,36,0.06);
          }

          /* Active — sky blue lit up */
          .nl-pill--active {
            border-color: rgba(56,189,248,0.32);
            color:        #67e8f9;
            background:   rgba(14,165,233,0.1);
            box-shadow:   0 0 16px rgba(56,189,248,0.12),
                          inset 0 0 12px rgba(14,165,233,0.06);
          }

          /* Flowing top-border on active */
          .nl-pill--active .nl-border {
            display:             block;
            background:          linear-gradient(
              90deg,
              transparent 0%,
              #38bdf8     20%,
              #06b6d4     50%,
              #6366f1     80%,
              transparent 100%
            );
            background-size:     200% 100%;
            animation:           nlBorderFlow 3s linear infinite;
          }

          .nl-border {
            display:       none;
            position:      absolute;
            top:  0; left: 0; right: 0;
            height:        1px;
          }

          /* Active dot indicator */
          .nl-dot {
            display:       none;
            width:         5px;
            height:        5px;
            border-radius: 50%;
            background:    #38bdf8;
            flex-shrink:   0;
          }
          .nl-pill--active .nl-dot {
            display:   block;
            animation: nlDotPulse 2s ease-in-out infinite;
          }
        `}</style>

        <RouterNavLink
          ref={ref}
          to={to}
          className={({ isActive, isPending }) =>
            cn(
              "nl-pill",
              isActive && "nl-pill--active",
              isPending && "nl-pill--pending",
              className,
              isActive && activeClassName,
              isPending && pendingClassName,
            )
          }
          {...props}
        >
          {/* Animated top border (visible only when active) */}
          <span className="nl-border" aria-hidden="true" />

          {/* Active indicator dot */}
          <span className="nl-dot" aria-hidden="true" />

          {children}
        </RouterNavLink>
      </>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
export type { NavLinkCompatProps };