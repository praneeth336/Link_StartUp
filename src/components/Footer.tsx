import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="gradient-text">LINKSTART</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering your startup journey. Connect, build, and scale your ideas.
            </p>
          </div>
          {[
            { title: "Platform", links: [{ label: "Explore Ideas", to: "/explore" }, { label: "Submit Idea", to: "/submit-idea" }, { label: "Statistics", to: "/statistics" }] },
            { title: "Resources", links: [{ label: "About", to: "/about" }, { label: "Steps to Success", to: "/steps" }, { label: "Success Stories", to: "/success-stories" }] },
            { title: "Account", links: [{ label: "Sign In", to: "/login" }, { label: "Register", to: "/register" }] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LINKSTART. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
