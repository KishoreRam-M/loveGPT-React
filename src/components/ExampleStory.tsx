import { BookHeart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ExampleStory = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4">
      <div
        ref={ref}
        className={`max-w-2xl mx-auto glass-card glow-border p-8 transition-all duration-700 ${
          visible ? "animate-fade-in-up opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <BookHeart className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">
            Example Love Story
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed italic text-lg">
          "Arjun never believed in love until he met Meera in the college
          library. Their conversations began with books but slowly turned into
          shared dreams. One rainy evening under a silent bus stop, Arjun
          finally gathered courage to speak his heart."
        </p>
      </div>
    </section>
  );
};

export default ExampleStory;
