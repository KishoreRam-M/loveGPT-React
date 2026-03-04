import { useState } from "react";
import Hero from "@/components/Hero";
import StoryInput from "@/components/StoryInput";
import ExampleStory from "@/components/ExampleStory";
import UserGuide from "@/components/UserGuide";
import ResultCard from "@/components/ResultCard";
import Footer from "@/components/Footer";

/* Section divider — a tasteful horizontal rule with heart glyph */
const SectionDivider = () => (
  <div
    style={{
      position: "relative",
      height: 1,
      margin: "0 40px",
      background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.18), rgba(212,168,83,0.12), transparent)",
      overflow: "visible",
    }}
  >
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "#0a0308",
        padding: "0 16px",
        color: "rgba(196,30,58,0.35)",
        fontSize: 11,
        lineHeight: 1,
        letterSpacing: 2,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      ♥
    </span>
  </div>
);

const Index = () => {
  const [plan, setPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#0a0308" }}>
      <Hero />
      <SectionDivider />
      <StoryInput onResult={setPlan} />
      <SectionDivider />
      <ExampleStory />
      <SectionDivider />
      <UserGuide />
      {plan && (
        <>
          <SectionDivider />
          <ResultCard plan={plan} onReset={() => setPlan(null)} />
        </>
      )}
      <SectionDivider />
      <Footer />
    </div>
  );
};

export default Index;
