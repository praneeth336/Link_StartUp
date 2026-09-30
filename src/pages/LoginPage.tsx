import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Login feature coming soon!", description: "Backend integration required." });
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md px-4">
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <LogIn className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="font-display font-bold text-2xl">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your LINKSTART account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" required className="pl-9 bg-accent/50 border-border/50" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" required className="pl-9 pr-9 bg-accent/50 border-border/50" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 font-semibold" size="lg">Sign In</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
