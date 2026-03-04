import { useState } from "react";
import Hero from "@/components/Hero";
import StoryInput from "@/components/StoryInput";
import ExampleStory from "@/components/ExampleStory";
import UserGuide from "@/components/UserGuide";
import ResultCard from "@/components/ResultCard";
import Footer from "@/components/Footer";

const Index = () => {
  const [plan, setPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <StoryInput onResult={setPlan} />
      <ExampleStory />
      <UserGuide />
      {plan && (
        <ResultCard plan={plan} onReset={() => setPlan(null)} />
      )}
      <Footer />
    </div>
  );
};

export default Index;
