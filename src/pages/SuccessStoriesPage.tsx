import { motion } from "framer-motion";
import { Sparkles, Trophy, Users, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stories = [
  {
    title: "AgriSense AI: From Concept to $1.2M Seed Round",
    domain: "AgriTech",
    creator: "Priya Sharma (Creator) + Alex Rivera (CTO)",
    description: "Matched on LinkStart within 10 days. Built a computer vision crop analysis prototype during a 30-day trial sprint, securing seed capital from Vance Ventures.",
    metric: "$1.2M Seed Capital",
    icon: Zap,
  },
  {
    title: "PayFlow Emerging Markets: 50k+ Active Merchants",
    domain: "FinTech",
    creator: "James Chen (Founder) + Sophia Martinez (Design Lead)",
    description: "Formed an execution team using LinkStart's dynamic equity calculator and trial sprint board. Raised $500k pre-seed from angel investors.",
    metric: "50,000+ Active Users",
    icon: TrendingUp,
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Trophy className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Venture Success Stories</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            See how idea creators, skilled co-founders, and investors matched on LinkStart to launch high-velocity startups.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 border border-border/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                  {story.domain}
                </Badge>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {story.metric}
                </span>
              </div>
              <h2 className="font-display font-bold text-xl">{story.title}</h2>
              <p className="text-xs text-primary font-semibold">Matched Team: {story.creator}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{story.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
