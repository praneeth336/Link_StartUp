import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { domains } from "@/data/ideas";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import PrivacyBadge from "@/components/PrivacyBadge";

export default function RegisterPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { registerUser } = useApp();

  const [role, setRole] = useState<UserRole>("creator");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [domain, setDomain] = useState("AI");
  const [location, setLocation] = useState("San Francisco, CA");
  const [fundingCapacity, setFundingCapacity] = useState("$25K - $100K");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: "Please fill out required fields." });
      return;
    }

    const skills = skillsStr ? skillsStr.split(",").map((s) => s.trim()) : ["Product Strategy", "Management"];

    const created = registerUser({
      name: name.trim(),
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role,
      title: title.trim() || (role === "creator" ? "Domain Founder" : role === "cofounder" ? "Full-Stack Engineer" : "Angel Investor"),
      bio: bio.trim() || "Passionate about building game-changing early stage ventures.",
      skills,
      domains: [domain],
      location,
      availability: role === "cofounder" ? "Full-time (40h/wk)" : undefined,
      fundingCapacity: role === "investor" ? fundingCapacity : undefined,
    });

    toast({
      title: "Account Created Successfully!",
      description: `Welcome to LINKSTART as ${created.name} (${role.toUpperCase()}).`,
    });

    if (role === "creator") navigate("/submit-idea");
    else if (role === "cofounder") navigate("/explore");
    else navigate("/cofounders");
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg px-4">
        <div className="glass rounded-2xl p-8 border border-border/40">
          <div className="text-center mb-6">
            <UserPlus className="h-10 w-10 text-primary mx-auto mb-2" />
            <h1 className="font-display font-bold text-2xl">Join LINKSTART</h1>
            <p className="text-xs text-muted-foreground mt-1">Connect with creators, co-founders, and investors</p>
            <div className="mt-3 flex justify-center">
              <PrivacyBadge compact />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block">I am joining as a...</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("creator")}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    role === "creator"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/40"
                      : "bg-accent/40 border-border/40 text-muted-foreground"
                  }`}
                >
                  Idea Creator
                </button>
                <button
                  type="button"
                  onClick={() => setRole("cofounder")}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    role === "cofounder"
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/40"
                      : "bg-accent/40 border-border/40 text-muted-foreground"
                  }`}
                >
                  Co-Founder
                </button>
                <button
                  type="button"
                  onClick={() => setRole("investor")}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    role === "investor"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                      : "bg-accent/40 border-border/40 text-muted-foreground"
                  }`}
                >
                  Investor
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="bg-accent/40 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Email Address (Guarded by Privacy Shield)</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                required
                className="bg-accent/40 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Professional Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer / FinTech Founder"
                className="bg-accent/40 text-xs"
              />
            </div>

            {role === "investor" && (
              <div>
                <label className="text-xs font-semibold mb-1 block">Target Check Size</label>
                <select
                  value={fundingCapacity}
                  onChange={(e) => setFundingCapacity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-md bg-card border border-border"
                >
                  <option value="$10K - $50K">$10K - $50K (Angel)</option>
                  <option value="$50K - $250K">$50K - $250K (Micro VC)</option>
                  <option value="$250K+">$250K+ (Seed Fund)</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold mb-1 block">Sector Interest</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full text-xs p-2.5 rounded-md bg-card border border-border"
              >
                {domains.filter((d) => d !== "All").map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Skills (Comma-separated)</label>
              <Input
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="e.g. React Native, Python, Market Research, Growth"
                className="bg-accent/40 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your background and what you are looking to build or support..."
                className="w-full text-xs p-2.5 rounded-md bg-accent/40 border border-border min-h-[70px]"
              />
            </div>

            <Button type="submit" className="w-full gradient-primary border-0 font-semibold text-xs" size="lg">
              Create Account & Enter Platform
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
