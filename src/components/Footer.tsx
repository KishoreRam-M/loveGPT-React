import { Heart, Github, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="py-12 px-4 border-t border-border/30">
    <div className="max-w-3xl mx-auto text-center space-y-4">
      <p className="text-muted-foreground flex items-center justify-center gap-2">
        Created with <Heart className="h-4 w-4 text-primary fill-primary" /> by{" "}
        <span className="text-foreground font-semibold">Kishore Ram M</span>
      </p>
      <div className="flex justify-center gap-6">
        <a
          href="https://github.com/KishoreRam-M"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/kishoreramm/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        LoveGPT Tamil — AI-Powered Love Advisor
      </p>
    </div>
  </footer>
);

export default Footer;
