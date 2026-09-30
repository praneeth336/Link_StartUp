import { useState } from "react";
import { motion } from "framer-motion";
import { Search, DollarSign, MapPin, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import UserProfileModal from "@/components/UserProfileModal";
import PrivacyBadge from "@/components/PrivacyBadge";
import { UserProfile } from "@/types";

export default function InvestorsPage() {
  const { users } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const investors = users.filter((u) => u.role === "investor");

  const filtered = investors.filter((u) => {
    return (
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.domains.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Capital Providers & Angels</Badge>
                <PrivacyBadge compact />
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl">Explore Investors</h1>
              <p className="text-muted-foreground text-sm max-w-2xl mt-1">
                Discover active angel investors and early micro-VCs searching for pre-vetted execution teams.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="glass rounded-xl flex items-center px-4 gap-2 mb-8 max-w-xl">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search investors by name, firm, or sector..."
            className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Investor Cards */}
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
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/30 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-display font-semibold text-base truncate">{user.name}</h3>
                      {user.verified && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">{user.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {user.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{user.bio}</p>

                <div className="space-y-2 mb-4 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Typical Check Size:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{user.fundingCapacity || "$25k - $100k"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Target Stage:</span>
                    <span className="font-medium text-foreground">{user.investmentStage || "Pre-seed / Seed"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">Investment Thesis Focus</div>
                  <div className="flex flex-wrap gap-1">
                    {user.domains.map((dom) => (
                      <span key={dom} className="px-2 py-0.5 rounded text-[11px] bg-accent text-foreground font-medium">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30 flex items-center justify-between mt-4">
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Micro VC / Angel
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedProfile(user)}
                  className="text-xs border-emerald-500/30 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400"
                >
                  View Profile & Connect
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 glass rounded-xl">
            <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-1">No Investors Found</h3>
            <p className="text-muted-foreground text-sm">Adjust your search parameters.</p>
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
