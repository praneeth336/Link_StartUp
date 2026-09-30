import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Compass,
  TrendingUp,
  Users,
  Lightbulb,
  ArrowRight,
  Zap,
  ShieldCheck,
  Building2,
  Lock,
  ChevronRight,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IdeaCard from "@/components/IdeaCard";
import PrivacyBadge from "@/components/PrivacyBadge";
import { domains } from "@/data/ideas";
import { useApp } from "@/context/AppContext";

const stats = [
  { label: "High-Signal Ideas", value: "12,400+", icon: Lightbulb },
  { label: "Active Investors & VCs", value: "2,800+", icon: TrendingUp },
  { label: "Matched Teams Launched", value: "850+", icon: Zap },
  { label: "Skilled Co-Founders", value: "4,500+", icon: Users },
];

const pillars = [
  {
    role: "Idea Creators",
    title: "Domain Experts & Founders",
    description: "Publish your venture vision, attract senior technical co-founders, and track execution velocity.",
    badge: "Execution Leverage",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
    textColor: "text-amber-500",
    btnText: "Publish Concept",
    to: "/submit-idea",
  },
  {
    role: "Co-Founders",
    title: "Skilled Engineers & Operators",
    description: "Join high-potential startups as an equal co-founder. Work in private trial sprint sandboxes with equity transparency.",
    badge: "Real Equity & Impact",
    color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/30",
    textColor: "text-indigo-500",
    btnText: "Find Startup Teams",
    to: "/cofounders",
  },
  {
    role: "Investors",
    title: "Angel Capital & Micro VCs",
    description: "Skip raw unvalidated cold pitches. Access pre-vetted, co-founder aligned teams with proven milestone velocity.",
    badge: "High-Signal Deal Flow",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    textColor: "text-emerald-500",
    btnText: "Explore Portfolio Deal Flow",
    to: "/investors",
  },
];

export default function HomePage() {
  const [searchDomain, setSearchDomain] = useState("");
  const { ideas } = useApp();

  return (
    <div className="min-h-screen pt-16 bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-blue-500/10 to-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Rocket className="h-3.5 w-3.5" />
              <span>Next-Gen Venture Creation Network</span>
            </div>

            {/* BRAND TITLE - Maximum Visibility & High Contrast */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 text-foreground drop-shadow-md">
              LINK<span className="text-primary bg-gradient-to-r from-blue-400 via-primary to-emerald-400 bg-clip-text text-transparent">START</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Connecting <strong className="text-foreground font-semibold">Idea Creators</strong>, <strong className="text-foreground font-semibold">Skilled Co-Founders</strong>, and <strong className="text-foreground font-semibold">Investors</strong> to turn promising concepts into venture-backed startups.
            </p>

            {/* Privacy Guarantee Ribbon */}
            <div className="flex justify-center mb-10">
              <PrivacyBadge />
            </div>
          </motion.div>

          {/* Smart Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2 border border-border/60 shadow-2xl">
              <div className="flex-1 flex items-center gap-2 px-3 w-full">
                <Search className="h-5 w-5 text-primary flex-shrink-0" />
                <select
                  value={searchDomain}
                  onChange={(e) => setSearchDomain(e.target.value)}
                  className="w-full bg-transparent text-foreground py-3 text-sm focus:outline-none cursor-pointer font-medium"
                >
                  <option value="" className="bg-card text-foreground">All Industry Sectors (AgriTech, FinTech, AI...)</option>
                  {domains.filter((d) => d !== "All").map((d) => (
                    <option key={d} value={d} className="bg-card text-foreground">{d}</option>
                  ))}
                </select>
              </div>

              <Link to={searchDomain ? `/explore?domain=${searchDomain}` : "/explore"} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto gradient-primary border-0 rounded-xl px-7 py-6 font-semibold gap-2 shadow-lg hover:shadow-primary/25">
                  Explore Ventures <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Action Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link to="/explore">
              <Button size="lg" className="gradient-primary border-0 font-semibold gap-2 shadow-md">
                <Compass className="h-4 w-4" /> Explore Ideas
              </Button>
            </Link>
            <Link to="/cofounders">
              <Button variant="outline" size="lg" className="gap-2 border-border/60 bg-card/40 hover:bg-accent">
                <Users className="h-4 w-4 text-indigo-400" /> Find Co-Founders
              </Button>
            </Link>
            <Link to="/investors">
              <Button variant="outline" size="lg" className="gap-2 border-border/60 bg-card/40 hover:bg-accent">
                <Building2 className="h-4 w-4 text-emerald-400" /> Explore Investors
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-border/40 bg-card/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 rounded-xl glass border border-border/30"
              >
                <stat.icon className="h-7 w-7 text-primary mx-auto mb-2" />
                <div className="font-display font-extrabold text-3xl md:text-4xl text-foreground">{stat.value}</div>
                <div className="text-xs font-medium text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Pillar Marketplace Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">3-Sided Synergy</Badge>
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">Built for Every Role in the Venture Ecosystem</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              LinkStart connects the missing pieces so promising ideas get execution power and target capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-8 border bg-gradient-to-b ${pillar.color} flex flex-col justify-between card-lift`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold uppercase tracking-wider ${pillar.textColor}`}>
                      {pillar.role}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-background/50">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3 text-foreground">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">{pillar.description}</p>
                </div>

                <Link to={pillar.to}>
                  <Button variant="outline" className="w-full justify-between text-xs font-semibold border-border/50 hover:bg-accent">
                    <span>{pillar.btnText}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venture Ideas */}
      <section className="py-20 bg-card/30 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-2">High-Signal Pipeline</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl">Trending Venture Concepts</h2>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">Explore ideas actively matching with co-founders right now.</p>
            </div>
            <Link to="/explore">
              <Button variant="outline" className="gap-1 border-border/50 text-xs">
                View All Ideas <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.slice(0, 3).map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <IdeaCard idea={idea} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-16 max-w-4xl mx-auto border border-primary/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4 text-foreground">
              Ready to Turn Ideas into Ventures?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm md:text-base">
              Join founders, developers, designers, and investors building high-velocity startups with privacy protection.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/submit-idea">
                <Button size="lg" className="gradient-primary border-0 font-semibold shadow-lg px-8">
                  Publish Your Idea
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="border-border/60 px-8">
                  Join Platform
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
