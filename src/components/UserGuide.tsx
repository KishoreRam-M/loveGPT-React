import {
  FolderPlus,
  Sparkles,
  Import,
  KeyRound,
  Copy,
  ClipboardPaste,
  PenLine,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  { icon: FolderPlus, title: "Create a Google Cloud Project" },
  { icon: Sparkles, title: "Open Google AI Studio" },
  { icon: Import, title: "Import your Google Cloud Project" },
  { icon: KeyRound, title: "Generate a Gemini API Key" },
  { icon: Copy, title: "Copy the API Key" },
  { icon: ClipboardPaste, title: "Paste it inside this application" },
  { icon: PenLine, title: "Write your love story and generate your AI love plan" },
];

const UserGuide = () => {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = steps.map((_, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }
        },
        { threshold: 0.3 }
      );
      if (refs.current[i]) observer.observe(refs.current[i]!);
      return observer;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section id="user-guide" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          How to Use <span className="text-primary">LoveGPT</span>
        </h2>

        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`glass-card p-5 flex items-center gap-4 transition-all duration-500 ${
                  visibleSteps[i]
                    ? "animate-fade-in-up opacity-100"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary">
                    STEP {i + 1}
                  </span>
                  <p className="text-foreground font-medium">{step.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserGuide;
