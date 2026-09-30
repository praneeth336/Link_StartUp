import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrivacyBadge from "@/components/PrivacyBadge";
import UserProfileModal from "@/components/UserProfileModal";
import { Check, X, MessagesSquare, ArrowRight, Clock, FolderGit2, User, Sparkles } from "lucide-react";
import { UserProfile } from "@/types";

export default function ConnectionsPage() {
  const { currentUser, connections, users, ideas, acceptConnectionRequest, declineConnectionRequest } = useApp();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  // Filter connections relevant to current logged in user
  const incoming = connections.filter((c) => c.receiverId === currentUser.id && c.status === "pending");
  const outgoing = connections.filter((c) => c.senderId === currentUser.id && c.status === "pending");
  const activeMatches = connections.filter(
    (c) => (c.senderId === currentUser.id || c.receiverId === currentUser.id) && c.status === "accepted"
  );

  const getUser = (userId: string) => users.find((u) => u.id === userId);
  const getIdea = (ideaId?: string) => ideas.find((i) => i.id === ideaId);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">Double Opt-In Connection Engine</Badge>
                <PrivacyBadge compact />
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl">Matches & Connections</h1>
              <p className="text-muted-foreground text-sm max-w-xl mt-1">
                Manage connection requests from creators, co-founders, and investors. Accepting unlocks direct messaging, pitch decks, and trial milestone workspaces.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 1: Incoming Pending Requests */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display font-semibold text-xl">Incoming Requests</h2>
            {incoming.length > 0 && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">{incoming.length} Pending</Badge>
            )}
          </div>

          {incoming.length > 0 ? (
            <div className="space-y-4">
              {incoming.map((req) => {
                const sender = getUser(req.senderId);
                const idea = getIdea(req.ideaId);
                if (!sender) return null;

                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-5 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={sender.avatar}
                        alt={sender.name}
                        className="w-12 h-12 rounded-full object-cover border border-primary/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-base">{sender.name}</h3>
                          <Badge variant="outline" className="capitalize text-[11px]">{sender.role}</Badge>
                          {idea && <span className="text-xs text-primary font-medium">Re: {idea.title}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{sender.title} • {sender.location}</p>
                        <p className="text-xs bg-accent/40 p-2.5 rounded-lg border border-border/40 text-foreground/90 italic">
                          "{req.message}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedProfile(sender)}
                        className="text-xs"
                      >
                        Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineConnectionRequest(req.id)}
                        className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <X className="h-3.5 w-3.5" /> Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => acceptConnectionRequest(req.id)}
                        className="text-xs gradient-primary border-0 font-semibold gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Accept Connection
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-xl glass text-center text-sm text-muted-foreground">
              No pending incoming requests at the moment.
            </div>
          )}
        </div>

        {/* Section 2: Active Connected Collaborations */}
        <div className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-4">Active Connected Partnerships ({activeMatches.length})</h2>

          {activeMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMatches.map((conn) => {
                const partnerId = conn.senderId === currentUser.id ? conn.receiverId : conn.senderId;
                const partner = getUser(partnerId);
                const idea = getIdea(conn.ideaId);
                if (!partner) return null;

                return (
                  <div key={conn.id} className="glass rounded-xl p-5 border border-emerald-500/30 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={partner.avatar}
                          alt={partner.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30"
                        />
                        <div>
                          <h3 className="font-semibold text-base">{partner.name}</h3>
                          <p className="text-xs text-muted-foreground">{partner.title}</p>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] mt-1">
                            Double Opt-In Verified
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedProfile(partner)}
                        className="text-xs"
                      >
                        <User className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {idea && (
                      <div className="text-xs bg-accent/40 p-2 rounded-lg">
                        <span className="text-muted-foreground">Venture Project:</span>{" "}
                        <strong className="text-foreground">{idea.title}</strong>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <span className="text-xs text-muted-foreground font-mono">{partner.email}</span>
                      <Link to={`/workspace?connId=${conn.id}`}>
                        <Button size="sm" className="gradient-primary border-0 text-xs gap-1 font-semibold">
                          <FolderGit2 className="h-3.5 w-3.5" /> Open Workspace <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-xl glass text-center space-y-3">
              <Sparkles className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold text-base">No active connections yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Browse ideas, skilled co-founders, or investors to send your first connection request and unlock a shared collaboration workspace.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Outgoing Pending Requests */}
        {outgoing.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-lg mb-3 text-muted-foreground">Outgoing Pending Requests ({outgoing.length})</h2>
            <div className="space-y-3">
              {outgoing.map((req) => {
                const receiver = getUser(req.receiverId);
                if (!receiver) return null;

                return (
                  <div key={req.id} className="p-4 rounded-xl glass border border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={receiver.avatar} alt={receiver.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold">{receiver.name}</div>
                        <div className="text-xs text-muted-foreground">{receiver.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-500 font-medium bg-amber-500/10 px-3 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" /> Awaiting Response
                    </div>
                  </div>
                );
              })}
            </div>
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
