import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Heart, Sparkles, FolderGit2, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import UserProfileModal from "@/components/UserProfileModal";
import PrivacyBadge from "@/components/PrivacyBadge";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types";

export default function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ideas, users, currentUser, connections, sendConnectionRequest, likeIdea } = useApp();
  const { toast } = useToast();

  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [directMsgText, setDirectMsgText] = useState("");

  const idea = ideas.find((i) => i.id === id);
  const creator = idea ? users.find((u) => u.id === idea.creatorId || u.name === idea.creatorName) : null;

  const existingConn = creator
    ? connections.find(
        (c) => (c.senderId === currentUser.id && c.receiverId === creator.id) ||
               (c.senderId === creator.id && c.receiverId === currentUser.id)
      )
    : null;
  const isConnected = existingConn?.status === "accepted";

  if (!idea) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center glass p-8 rounded-xl">
          <h1 className="font-display text-2xl font-bold mb-2">Idea not found</h1>
          <Link to="/explore" className="text-primary hover:underline text-sm">← Back to Explore</Link>
        </div>
      </div>
    );
  }

  const skillsList = idea.skillsNeeded || idea.skills || [];
  const fundingText = idea.fundingNeeded || idea.funding;
  const creatorName = idea.creatorName || idea.creator || "Idea Creator";

  const handleSendMessageToCreator = () => {
    if (!creator) return;

    if (isConnected && existingConn) {
      navigate(`/workspace?connId=${existingConn.id}`);
      return;
    }

    // Send connection + initial message
    sendConnectionRequest(
      creator.id,
      idea.id,
      directMsgText.trim() || `Hi ${creatorName}, I saw your venture concept "${idea.title}" and would love to discuss collaborating!`
    );

    toast({
      title: "Message & Connection Request Sent!",
      description: `Your message has been delivered to ${creatorName}.`,
    });

    setIsMsgModalOpen(false);
    setDirectMsgText("");
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/explore" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Explore
            </Link>
            <PrivacyBadge compact />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Main content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass rounded-xl p-8 border border-border/40">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                    {idea.domain}
                  </Badge>
                  {fundingText && (
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {fundingText}
                    </span>
                  )}
                </div>

                <h1 className="font-display font-bold text-3xl mb-4">{idea.title}</h1>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">{idea.description}</p>

                <h3 className="font-display font-semibold text-sm mb-3">Required Co-Founder Skills</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {skillsList.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg text-xs bg-primary/10 text-primary font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                {idea.lookingFor && (
                  <div className="mb-8">
                    <h3 className="font-display font-semibold text-sm mb-3">Target Roles Needed</h3>
                    <div className="flex flex-wrap gap-2">
                      {idea.lookingFor.map((role) => (
                        <Badge key={role} variant="outline" className="bg-accent text-foreground text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="font-display font-semibold text-sm mb-3">Execution & Privacy Standard</h3>
                <div className="text-xs text-muted-foreground space-y-2 p-4 rounded-xl bg-accent/30 border border-border/40">
                  <p>• This startup idea is registered on LINKSTART for team formation and investor matching.</p>
                  <p>• Contact details and email addresses remain guarded until a mutual double opt-in connection is accepted.</p>
                  <p>• Accepting connection unlocks a private workspace with direct chat, pitch room document sharing, and trial sprint milestone tracking.</p>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
              {/* Creator info */}
              <div className="glass rounded-xl p-6 border border-border/40">
                <h3 className="font-display font-semibold text-sm mb-4">Project Creator</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={idea.creatorAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
                    alt={creatorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <div className="font-semibold text-sm">{creatorName}</div>
                    <div className="text-xs text-muted-foreground">Idea Creator</div>
                  </div>
                </div>

                {creator && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProfile(creator)}
                    className="w-full gap-2 border-border/50 text-xs mb-2"
                  >
                    <User className="h-3.5 w-3.5" /> View Creator Profile
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
                {/* DIRECT MESSAGE OPTION */}
                <Button
                  onClick={() => {
                    if (isConnected && existingConn) {
                      navigate(`/workspace?connId=${existingConn.id}`);
                    } else {
                      setIsMsgModalOpen(true);
                    }
                  }}
                  className="w-full gradient-primary border-0 font-semibold gap-2 text-xs shadow-md"
                >
                  <MessageSquare className="h-4 w-4" /> Message Creator
                </Button>

                {!isConnected && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (creator) setSelectedProfile(creator);
                      else toast({ title: "Connecting with Creator..." });
                    }}
                    className="w-full gap-2 border-border/50 text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Request Connection
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    likeIdea(idea.id);
                    toast({ title: "Liked!", description: "You expressed interest in this venture." });
                  }}
                  className="w-full gap-2 border-border/50 text-xs"
                >
                  <Heart className="h-3.5 w-3.5 text-rose-500" /> Like Concept ({idea.likesCount || 0})
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Message Modal for Idea Creator */}
      <Dialog open={isMsgModalOpen} onOpenChange={setIsMsgModalOpen}>
        <DialogContent className="max-w-md glass border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Send Message to {creatorName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Send a direct introductory message regarding <strong className="text-foreground">{idea.title}</strong>. This initiates a double opt-in connection request and opens your conversation thread.
            </p>
            <div>
              <label className="text-xs font-semibold mb-1 block">Your Message</label>
              <textarea
                value={directMsgText}
                onChange={(e) => setDirectMsgText(e.target.value)}
                placeholder={`Hi ${creatorName}, I saw your venture concept "${idea.title}" and would love to connect about collaborating!`}
                className="w-full text-xs p-3 rounded-xl bg-accent/40 border border-border min-h-[100px] focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button onClick={handleSendMessageToCreator} className="w-full gradient-primary border-0 text-xs font-semibold gap-2">
              <Send className="h-3.5 w-3.5" /> Send Message & Connect
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UserProfileModal
        user={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        ideaId={idea.id}
      />
    </div>
  );
}
