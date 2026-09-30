import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, Users, Briefcase, DollarSign, FolderGit2, MessagesSquare, Sparkles, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";

const navLinks = [
  { label: "Ideas", to: "/explore" },
  { label: "Co-Founders", to: "/cofounders", icon: Users },
  { label: "Investors", to: "/investors", icon: DollarSign },
  { label: "Matches", to: "/connections", icon: MessagesSquare },
  { label: "Workspace", to: "/workspace", icon: FolderGit2 },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { currentUser, switchRoleMode, users, connections } = useApp();

  const pendingCount = connections.filter(c => c.receiverId === currentUser.id && c.status === 'pending').length;

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'creator': return 'Idea Creator';
      case 'cofounder': return 'Co-Founder';
      case 'investor': return 'Investor';
      default: return role;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="gradient-text">LINKSTART</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {link.label}
              {link.to === "/connections" && pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Role Switcher & User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/50 border border-border/40 text-xs hover:bg-accent transition-colors"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover" />
              <div className="text-left">
                <div className="font-semibold text-foreground leading-none">{currentUser.name}</div>
                <div className="text-[10px] text-muted-foreground">{getRoleLabel(currentUser.role)}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-64 glass rounded-xl border border-border/50 p-2 shadow-xl z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
                    Switch Test Profile / Role
                  </div>
                  {users.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchRoleMode(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors ${
                        currentUser.id === u.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent"
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{u.name}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{u.role} ({u.title})</div>
                      </div>
                    </button>
                  ))}
                  <div className="pt-2 border-t border-border/30">
                    <Link
                      to="/register"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <User className="h-3.5 w-3.5" /> Register New Account
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/submit-idea">
            <Button size="sm" className="gradient-primary border-0 font-semibold">
              Submit Idea
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass border-t border-border/30"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border/30 space-y-2">
                <Link to="/submit-idea" className="block" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full gradient-primary border-0">Submit Idea</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
