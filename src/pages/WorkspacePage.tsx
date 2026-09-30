import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PrivacyBadge from "@/components/PrivacyBadge";
import {
  MessageSquare,
  FileText,
  CheckSquare,
  Scale,
  Send,
  Upload,
  Plus,
  FileCode,
  PieChart,
  ExternalLink,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function WorkspacePage() {
  const [searchParams] = useSearchParams();
  const connIdParam = searchParams.get("connId");

  const { currentUser, connections, users, ideas, messages, sendMessage, documents, addDocument, milestones, addMilestone, updateMilestoneStatus } = useApp();

  // Active matches for currentUser
  const activeConns = connections.filter(
    (c) => (c.senderId === currentUser.id || c.receiverId === currentUser.id) && c.status === "accepted"
  );

  const [selectedConnId, setSelectedConnId] = useState<string>(
    connIdParam || activeConns[0]?.id || ""
  );

  const [activeTab, setActiveTab] = useState<"chat" | "docs" | "sprints" | "equity">("chat");

  // Chat input
  const [chatText, setChatText] = useState("");

  // Document upload modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<any>("Pitch Deck");
  const [docUrl, setDocUrl] = useState("");

  // Milestone modal state
  const [isMsModalOpen, setIsMsModalOpen] = useState(false);
  const [msTitle, setMsTitle] = useState("");
  const [msDesc, setMsDesc] = useState("");
  const [msDueDate, setMsDueDate] = useState("2026-10-30");

  // Interactive Equity Calculator State
  const [ideaHourVal, setIdeaHourVal] = useState(100);
  const [founderHours, setFounderHours] = useState(120);
  const [cofounderHours, setCofounderHours] = useState(150);

  const activeConnection = activeConns.find((c) => c.id === selectedConnId);
  const partnerId = activeConnection
    ? activeConnection.senderId === currentUser.id
      ? activeConnection.receiverId
      : activeConnection.senderId
    : "";
  const partner = users.find((u) => u.id === partnerId);
  const activeIdea = ideas.find((i) => i.id === activeConnection?.ideaId);

  // Filter tab data
  const activeMessages = messages.filter((m) => m.connectionId === selectedConnId);
  const activeDocs = documents.filter((d) => d.connectionId === selectedConnId);
  const activeMilestones = milestones.filter((m) => m.connectionId === selectedConnId);

  const handleSendMessage = () => {
    if (!chatText.trim() || !selectedConnId || !partnerId) return;
    sendMessage(selectedConnId, partnerId, chatText.trim());
    setChatText("");
  };

  const handleAddDocument = () => {
    if (!docTitle.trim() || !selectedConnId) return;
    addDocument({
      connectionId: selectedConnId,
      title: docTitle.trim(),
      type: docType,
      url: docUrl.trim() || "https://example.com/demo_doc.pdf",
      fileSize: "1.8 MB",
    });
    setDocTitle("");
    setDocUrl("");
    setIsDocModalOpen(false);
  };

  const handleAddMilestone = () => {
    if (!msTitle.trim() || !selectedConnId) return;
    addMilestone({
      connectionId: selectedConnId,
      title: msTitle.trim(),
      description: msDesc.trim(),
      assignedTo: partnerId || currentUser.id,
      assignedToName: partner?.name || currentUser.name,
      dueDate: msDueDate,
    });
    setMsTitle("");
    setMsDesc("");
    setIsMsModalOpen(false);
  };

  // Equity calculations
  const totalPoints = founderHours * ideaHourVal + cofounderHours * ideaHourVal;
  const founderShare = totalPoints > 0 ? Math.round(((founderHours * ideaHourVal) / totalPoints) * 100) : 50;
  const cofounderShare = 100 - founderShare;

  if (activeConns.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg text-center glass rounded-2xl p-10 space-y-4">
          <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
          <h2 className="font-display font-bold text-2xl">No Active Workspace</h2>
          <p className="text-muted-foreground text-sm">
            Workspace collaboration unlocks once you connect with an Idea Creator, Skilled Co-Founder, or Investor.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/explore">
              <Button className="gradient-primary border-0 font-semibold text-xs">Explore Ideas</Button>
            </Link>
            <Link to="/cofounders">
              <Button variant="outline" className="text-xs">Find Co-Founders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Workspace Top Bar */}
        <div className="glass rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-primary-foreground">
              WS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg">
                  Workspace: {partner ? partner.name : "Venture Collaboration"}
                </h1>
                <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
                  Verified Team Room
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {activeIdea ? `Project: ${activeIdea.title}` : "Private Sandbox & Trial Sprint Space"}
              </p>
            </div>
          </div>

          {/* Connection Selector if multiple */}
          <div className="flex items-center gap-3">
            {activeConns.length > 1 && (
              <select
                value={selectedConnId}
                onChange={(e) => setSelectedConnId(e.target.value)}
                className="bg-accent/50 text-foreground text-xs p-2 rounded-lg border border-border/40 focus:outline-none"
              >
                {activeConns.map((c) => {
                  const pId = c.senderId === currentUser.id ? c.receiverId : c.senderId;
                  const p = users.find((u) => u.id === pId);
                  return <option key={c.id} value={c.id}>Room with {p?.name}</option>;
                })}
              </select>
            )}
            <PrivacyBadge compact />
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "chat" ? "bg-primary text-primary-foreground" : "bg-accent/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Direct Messaging
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "docs" ? "bg-primary text-primary-foreground" : "bg-accent/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" /> Pitch Room & Docs ({activeDocs.length})
          </button>
          <button
            onClick={() => setActiveTab("sprints")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "sprints" ? "bg-primary text-primary-foreground" : "bg-accent/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckSquare className="h-4 w-4" /> Trial Sprint Milestones ({activeMilestones.length})
          </button>
          <button
            onClick={() => setActiveTab("equity")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "equity" ? "bg-primary text-primary-foreground" : "bg-accent/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scale className="h-4 w-4" /> Equity & Term Templates
          </button>
        </div>

        {/* TAB 1: Direct Messaging */}
        {activeTab === "chat" && (
          <div className="glass rounded-xl border border-border/40 flex flex-col h-[580px]">
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {activeMessages.length > 0 ? (
                activeMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  const sender = users.find((u) => u.id === msg.senderId);

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      <img
                        src={sender?.avatar || currentUser.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-accent text-foreground rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className={`text-[10px] text-muted-foreground mt-1 ${isMe ? "text-right" : ""}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-muted-foreground text-xs">
                  This is the start of your secure collaboration chat with {partner?.name}.
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border/30 flex items-center gap-2">
              <input
                type="text"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Message ${partner?.name || "partner"}...`}
                className="flex-1 text-xs p-3 rounded-xl bg-accent/40 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button onClick={handleSendMessage} size="sm" className="gradient-primary border-0 font-semibold gap-1 text-xs">
                <Send className="h-3.5 w-3.5" /> Send
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: Pitch Room & Shared Documents */}
        {activeTab === "docs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl">Pitch Deck & Workspace Documents</h2>
                <p className="text-xs text-muted-foreground">Share architecture specs, financial projections, and pitch decks safely.</p>
              </div>

              <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0 text-xs font-semibold gap-1">
                    <Upload className="h-3.5 w-3.5" /> Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md glass border-border/40">
                  <DialogHeader>
                    <DialogTitle>Upload Document to Workspace</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Document Title</label>
                      <Input
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        placeholder="e.g. AgriTech Architecture Spec v1"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Category</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="w-full text-xs p-2 rounded-md bg-card border border-border"
                      >
                        <option value="Pitch Deck">Pitch Deck</option>
                        <option value="Architecture Spec">Architecture Spec</option>
                        <option value="Financial Model">Financial Model</option>
                        <option value="Term Sheet Template">Term Sheet Template</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">File Link / URL</label>
                      <Input
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="text-xs"
                      />
                    </div>
                    <Button onClick={handleAddDocument} className="w-full gradient-primary border-0 text-xs font-semibold">
                      Save Document
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDocs.map((doc) => (
                <div key={doc.id} className="glass rounded-xl p-5 border border-border/40 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    {doc.type === "Pitch Deck" ? <PieChart className="h-5 w-5" /> : <FileCode className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-[10px]">{doc.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">{doc.fileSize}</span>
                    </div>
                    <h3 className="font-semibold text-sm truncate">{doc.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1">Uploaded by {doc.uploadedByName} on {doc.uploadedAt}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold mt-3"
                    >
                      Open Document <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Trial Sprint & Milestones */}
        {activeTab === "sprints" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl">Trial Sprint & Milestone Board</h2>
                <p className="text-xs text-muted-foreground">Track 14 to 30-day proof-of-work tasks before formal equity commitments.</p>
              </div>

              <Dialog open={isMsModalOpen} onOpenChange={setIsMsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0 text-xs font-semibold gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md glass border-border/40">
                  <DialogHeader>
                    <DialogTitle>Add Trial Sprint Milestone</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Milestone Title</label>
                      <Input
                        value={msTitle}
                        onChange={(e) => setMsTitle(e.target.value)}
                        placeholder="e.g. Build computer vision MVP demo"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Task Description</label>
                      <textarea
                        value={msDesc}
                        onChange={(e) => setMsDesc(e.target.value)}
                        placeholder="Details of what needs to be delivered..."
                        className="w-full text-xs p-2.5 rounded-md bg-accent/30 border border-border min-h-[70px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Target Due Date</label>
                      <Input
                        type="date"
                        value={msDueDate}
                        onChange={(e) => setMsDueDate(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <Button onClick={handleAddMilestone} className="w-full gradient-primary border-0 text-xs font-semibold">
                      Create Milestone
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["todo", "in_progress", "completed"] as const).map((colStatus) => {
                const colItems = activeMilestones.filter((m) => m.status === colStatus);
                const colTitle = colStatus === "todo" ? "To Do" : colStatus === "in_progress" ? "In Progress" : "Completed";

                return (
                  <div key={colStatus} className="glass rounded-xl p-4 border border-border/40 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border/30">
                      <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        {colStatus === "completed" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                        {colTitle}
                      </h3>
                      <Badge variant="outline" className="text-[10px]">{colItems.length}</Badge>
                    </div>

                    <div className="space-y-3 min-h-[200px]">
                      {colItems.map((ms) => (
                        <div key={ms.id} className="p-3.5 rounded-lg bg-card border border-border/40 space-y-2">
                          <h4 className="font-semibold text-xs">{ms.title}</h4>
                          <p className="text-[11px] text-muted-foreground">{ms.description}</p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                            <span>Assigned to: {ms.assignedToName}</span>
                            <span>Due: {ms.dueDate}</span>
                          </div>

                          {/* Quick status change buttons */}
                          <div className="flex gap-1 pt-1">
                            {colStatus !== "todo" && (
                              <button
                                onClick={() => updateMilestoneStatus(ms.id, "todo")}
                                className="text-[9px] bg-accent px-1.5 py-0.5 rounded text-muted-foreground hover:text-foreground"
                              >
                                Move To Do
                              </button>
                            )}
                            {colStatus !== "in_progress" && (
                              <button
                                onClick={() => updateMilestoneStatus(ms.id, "in_progress")}
                                className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded hover:bg-amber-500/20"
                              >
                                Move In Progress
                              </button>
                            )}
                            {colStatus !== "completed" && (
                              <button
                                onClick={() => updateMilestoneStatus(ms.id, "completed")}
                                className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded hover:bg-emerald-500/20"
                              >
                                Mark Done
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Equity & Term Templates */}
        {activeTab === "equity" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl mb-1">Co-Founder Equity & Term Sheet Frameworks</h2>
              <p className="text-xs text-muted-foreground">Standardized guides and calculators for early founder alignment before legal incorporation.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interactive Slicing Pie Calculator */}
              <div className="glass rounded-xl p-6 border border-border/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-bold text-base">Dynamic Equity Calculator (Slicing Pie Model)</h3>
                </div>

                <p className="text-xs text-muted-foreground">
                  Calculate fair equity splits based on risk-adjusted time contributions during the initial build phase.
                </p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold flex justify-between">
                      <span>Idea Creator Hours Contributed:</span>
                      <span className="text-primary font-bold">{founderHours} hrs</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      value={founderHours}
                      onChange={(e) => setFounderHours(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold flex justify-between">
                      <span>Technical Co-Founder Hours Contributed:</span>
                      <span className="text-primary font-bold">{cofounderHours} hrs</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      value={cofounderHours}
                      onChange={(e) => setCofounderHours(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>

                  {/* Calculated Result */}
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                    <div className="text-xs font-semibold text-primary">Fair Estimated Equity Split</div>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Founder: {founderShare}%</span>
                      <span>Co-Founder: {cofounderShare}%</span>
                    </div>
                    <div className="w-full bg-accent h-3 rounded-full overflow-hidden flex">
                      <div className="bg-primary h-full" style={{ width: `${founderShare}%` }} />
                      <div className="bg-indigo-500 h-full" style={{ width: `${cofounderShare}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Templates Guide */}
              <div className="glass rounded-xl p-6 border border-border/40 space-y-4">
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" /> Co-Founder Best Practices
                </h3>

                <ul className="text-xs text-muted-foreground space-y-3">
                  <li className="p-3 rounded-lg bg-accent/40 border border-border/40">
                    <strong className="text-foreground block mb-1">1. Run a 30-Day Trial Sprint First</strong>
                    Collaborate on 2–3 milestones in this LinkStart Workspace before signing legal documents or incorporating.
                  </li>
                  <li className="p-3 rounded-lg bg-accent/40 border border-border/40">
                    <strong className="text-foreground block mb-1">2. Use 4-Year Vesting with a 1-Year Cliff</strong>
                    Standard Silicon Valley term sheets protect both parties by requiring 12 months of continuous commitment before equity vests.
                  </li>
                  <li className="p-3 rounded-lg bg-accent/40 border border-border/40">
                    <strong className="text-foreground block mb-1">3. Clear Intellectual Property (IP) Transfer</strong>
                    Ensure code and designs generated during the trial sprint belong to the venture entity upon incorporation.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
