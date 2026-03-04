import { useState } from "react";
import { KeyRound, Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateLovePlan } from "@/services/api";

interface StoryInputProps {
  onResult: (plan: string) => void;
}

const StoryInput = ({ onResult }: StoryInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!story.trim()) {
      toast({
        title: "Story Required",
        description: "Please write your love story before generating a plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const plan = await generateLovePlan(story);
      onResult(plan);
      document
        .getElementById("result-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch {
      toast({
        title: "Error",
        description:
          "Failed to generate love plan. Make sure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="story-input" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
          Tell Your <span className="text-primary">Love Story</span>
        </h2>

        <div className="glass-card p-8 space-y-6">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              <KeyRound className="inline h-4 w-4 mr-1" /> Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key here"
              className="w-full bg-background/50 border border-border/60 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Your Love Story
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={5}
              placeholder="I secretly love a girl in my college but I don't know how to approach her..."
              className="w-full bg-background/50 border border-border/60 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="glow-button w-full text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" /> Generate Love Plan
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoryInput;
