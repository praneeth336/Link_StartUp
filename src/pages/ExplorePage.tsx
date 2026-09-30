import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import IdeaCard from "@/components/IdeaCard";
import { domains } from "@/data/ideas";
import { useApp } from "@/context/AppContext";

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialDomain = searchParams.get("domain") || "All";
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [searchQuery, setSearchQuery] = useState("");
  const { ideas } = useApp();

  const filtered = ideas.filter((idea) => {
    const matchesDomain = selectedDomain === "All" || idea.domain === selectedDomain;
    const skillsList = idea.skillsNeeded || idea.skills || [];
    const matchesSearch =
      !searchQuery ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skillsList.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Explore Venture Concepts</h1>
            <p className="text-muted-foreground text-sm mb-8">Discover innovative early-stage startup ideas seeking technical co-founders and capital providers.</p>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 glass rounded-xl flex items-center px-4 gap-2 border border-border/40">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ideas, skills, domains..."
                className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedDomain === domain
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((idea, i) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <IdeaCard idea={idea} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground glass rounded-xl">
              <p className="text-lg mb-2">No ideas found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or domain filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
