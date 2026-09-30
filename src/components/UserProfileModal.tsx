import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PrivacyBadge from './PrivacyBadge';
import { Mail, MapPin, CheckCircle2, Lock, Send, Github, Linkedin, Globe, Sparkles } from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  ideaId?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, isOpen, onClose, ideaId }) => {
  const { currentUser, connections, sendConnectionRequest } = useApp();
  const [requestMsg, setRequestMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!user) return null;

  const isSelf = currentUser.id === user.id;
  const existingConn = connections.find(
    c => (c.senderId === currentUser.id && c.receiverId === user.id) ||
         (c.senderId === user.id && c.receiverId === currentUser.id)
  );
  const isConnected = existingConn?.status === 'accepted';
  const isPending = existingConn?.status === 'pending';

  const handleSendConnect = () => {
    setIsSending(true);
    sendConnectionRequest(user.id, ideaId, requestMsg);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
    }, 400);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'creator':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Idea Creator</Badge>;
      case 'cofounder':
        return <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">Skilled Co-Founder</Badge>;
      case 'investor':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Investor / VC</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl glass border-border/40 p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display font-bold text-2xl flex items-center gap-2">
              User Profile
            </DialogTitle>
            <PrivacyBadge compact />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex items-start gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-display font-bold text-xl">{user.name}</h2>
                {user.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                {getRoleBadge(user.role)}
              </div>
              <p className="text-sm font-medium text-foreground/80 mb-2">{user.title}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {user.location}</span>
                {user.availability && <span className="bg-accent px-2 py-0.5 rounded-full">{user.availability}</span>}
                {user.fundingCapacity && <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-semibold">{user.fundingCapacity}</span>}
              </div>
            </div>
          </div>

          {/* Privacy & Email Section */}
          <div className="p-4 rounded-xl bg-card border border-border/40">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center justify-between">
              <span>Contact & Email</span>
              <span className="text-[10px] text-emerald-500">Privacy Standard Compliant</span>
            </div>
            {isSelf || isConnected ? (
              <div className="flex items-center gap-2 text-sm text-foreground bg-primary/5 p-2.5 rounded-lg border border-primary/10">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-mono font-medium">{user.email}</span>
                <Badge variant="outline" className="ml-auto text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20">Connected</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/40 p-2.5 rounded-lg border border-border/40">
                <Lock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span>Email address concealed until double opt-in connection is accepted.</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg text-xs bg-primary/10 text-primary font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Domains */}
          {user.domains && user.domains.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Sectors & Domains</h3>
              <div className="flex flex-wrap gap-1.5">
                {user.domains.map((dom) => (
                  <span key={dom} className="px-2.5 py-1 rounded-lg text-xs bg-accent text-foreground font-medium">
                    {dom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-3 pt-2">
            {user.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
            )}
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {user.websiteUrl && (
              <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* Action / Connection controls */}
          {!isSelf && (
            <div className="pt-4 border-t border-border/40">
              {isConnected ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" /> You are connected! Access shared workspace & chat.
                </div>
              ) : isPending || sentSuccess ? (
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold text-center">
                  Connection Request Pending (Awaiting double opt-in)
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={requestMsg}
                    onChange={(e) => setRequestMsg(e.target.value)}
                    placeholder={`Write a brief introductory note to ${user.name}...`}
                    className="w-full text-sm p-3 rounded-xl bg-accent/30 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                  />
                  <Button
                    onClick={handleSendConnect}
                    disabled={isSending}
                    className="w-full gradient-primary border-0 font-semibold gap-2"
                  >
                    <Send className="h-4 w-4" /> Request Mutual Connection
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
