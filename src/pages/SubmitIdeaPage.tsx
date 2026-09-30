import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { domains } from "@/data/ideas";
import { useApp } from "@/context/AppContext";

export default function SubmitIdeaPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addIdea } = useApp();

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("AgriTech");
  const [description, setDescription] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [funding, setFunding] = useState("$100K needed");
  const [pitchDeckUrl, setPitchDeckUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({ title: "Please fill out required fields." });
      return;
    }

    const skillsNeeded = skillsStr
      ? skillsStr.split(",").map((s) => s.trim())
      : ["Full-Stack", "Machine Learning", "Marketing"];

    const created = addIdea({
      title: title.trim(),
      domain,
      description: description.trim(),
      skillsNeeded,
      fundingNeeded: funding.trim(),
      stage: "Concept",
      pitchDeckUrl: pitchDeckUrl.trim() || undefined,
      lookingFor: ["Technical Co-Founder", "Angel Investor"],
    });

    toast({
      title: "Idea Published Successfully!",
      description: `"${created.title}" is now visible to co-founders and investors.`,
    });

    navigate(`/idea/${created.id}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Publish Venture Concept</h1>
          <p className="text-muted-foreground text-sm">
            Share your startup vision to match with skilled co-founders and early-stage capital providers.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass rounded-xl p-8 space-y-5 border border-border/40"
        >
          <div>
            <label className="text-xs font-semibold mb-1 block">Idea / Startup Name</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI-Powered Crop Disease Detection"
              required
              className="bg-accent/40 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Industry Sector</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-md bg-card border border-border"
            >
              {domains.filter((d) => d !== "All").map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Problem & Vision Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem, market opportunity, and proposed solution..."
              rows={4}
              required
              className="bg-accent/40 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Co-Founder Skills Required (Comma-separated)</label>
            <Input
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. Python, React Native, Computer Vision, Sales"
              className="bg-accent/40 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Target Funding Needed</label>
            <Input
              value={funding}
              onChange={(e) => setFunding(e.target.value)}
              placeholder="e.g. $75K needed / Bootstrapped"
              className="bg-accent/40 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Pitch Deck / Doc Link (Optional)</label>
            <Input
              value={pitchDeckUrl}
              onChange={(e) => setPitchDeckUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="bg-accent/40 text-xs"
            />
          </div>

          <Button type="submit" className="w-full gradient-primary border-0 font-semibold gap-2 text-xs" size="lg">
            <Send className="h-4 w-4" /> Publish Concept & Start Matching
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
