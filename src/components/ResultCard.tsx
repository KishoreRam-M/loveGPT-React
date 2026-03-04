import { useEffect, useState } from "react";
import { ClipboardCopy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResultCardProps {
  plan: string;
  onReset: () => void;
}

const ResultCard = ({ plan, onReset }: ResultCardProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setDoneTyping(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(plan.slice(0, i));
      if (i >= plan.length) {
        clearInterval(interval);
        setDoneTyping(true);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [plan]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plan);
    toast({ title: "Copied!", description: "Love plan copied to clipboard." });
  };

  return (
    <section id="result-section" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
          <Sparkles className="inline h-7 w-7 text-primary mr-2" />
          Your <span className="text-primary">Love Plan</span>
        </h2>

        <div className="glass-card glow-border animate-glow-pulse p-8">
          <p
            className={`text-foreground leading-relaxed whitespace-pre-wrap ${
              !doneTyping ? "typing-cursor" : ""
            }`}
          >
            {displayedText}
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button onClick={handleCopy} className="glow-button flex items-center gap-2">
            <ClipboardCopy className="h-4 w-4" /> Copy Result
          </button>
          <button
            onClick={onReset}
            className="px-8 py-3 rounded-xl border border-border/60 text-foreground font-semibold hover:bg-secondary/50 transition-all duration-300 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Generate Again
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResultCard;
