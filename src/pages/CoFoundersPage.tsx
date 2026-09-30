import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, User, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import UserProfileModal from "@/components/UserProfileModal";
import PrivacyBadge from "@/components/PrivacyBadge";
import { UserProfile } from "@/types";

export default function CoFoundersPage() {
  const { users } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const cofounders = users.filter((u) => u.role === "cofounder");

  const filtered = cofounders.filter((u) => {
    const matchesDomain = selectedDomain === "All" || u.domains.includes(selectedDomain);
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const domains = ["All", "AgriTech", "FinTech", "HealthTech", "AI", "EdTech", "CleanTech"];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Skilled Operators & Builders</Badge>
                <PrivacyBadge compact />
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl">Find Co-Founders</h1>
              <p className="text-muted-foreground text-sm max-w-2xl mt-1">
                Connect with vetted engineers, designers, and business operators ready to join early-stage venture teams.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 glass rounded-xl flex items-center px-4 gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill (e.g. React Native, PyTorch, UX)..."
              className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDomain === dom
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6 flex flex-col justify-between card-lift border border-border/40"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-display font-semibold text-base truncate">{user.name}</h3>
                      {user.verified && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-primary font-medium truncate">{user.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {user.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{user.bio}</p>

                <div className="mb-4">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">Top Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                <span className="text-[11px] bg-accent px-2 py-0.5 rounded text-muted-foreground">
                  {user.availability || "Full-time"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedProfile(user)}
                  className="text-xs border-border/50 hover:border-primary"
                >
                  View Profile & Connect
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 glass rounded-xl">
            <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-1">No Co-Founders Found</h3>
            <p className="text-muted-foreground text-sm">Try broadening your search query or domain filter.</p>
          </div>
        )}
      </div>

      <UserProfileModal
        user={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
}
