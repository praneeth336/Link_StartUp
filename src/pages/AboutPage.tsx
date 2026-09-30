import { motion } from "framer-motion";
import { Lightbulb, CheckCircle, Users, TrendingUp, ArrowRight, Rocket, Target, Handshake } from "lucide-react";

const steps = [
  { icon: Lightbulb, label: "Idea Creator", description: "Submit your startup idea to the platform" },
  { icon: Target, label: "Validation", description: "AI and experts validate your concept" },
  { icon: Users, label: "Experts & Team", description: "Connect with mentors and co-founders" },
  { icon: TrendingUp, label: "Investors", description: "Pitch to interested investors" },
  { icon: Rocket, label: "Startup Growth", description: "Launch and scale your company" },
];

const roles = [
  { icon: Lightbulb, title: "Idea Creators", description: "Submit innovative startup ideas and find the right team to bring them to life. Get AI-powered validation and expert feedback." },
  { icon: TrendingUp, title: "Investors", description: "Discover vetted startup ideas with high potential. Connect directly with founders and track portfolio performance." },
  { icon: CheckCircle, title: "Expert Mentors", description: "Share your industry expertise to guide early-stage startups. Build your reputation as a thought leader." },
  { icon: Handshake, title: "Co-Founders", description: "Find promising startup ideas that match your skills. Join founding teams and build something meaningful." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              About <span className="gradient-text">LINKSTART</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              LINKSTART is a startup ecosystem platform that bridges the gap between ideas and execution. We help validate startup concepts, connect creators with investors, enable expert mentorship, and allow skilled professionals to join as co-founders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Flow Diagram */}
      <section className="py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-3xl text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4"
              >
                <div className="glass rounded-xl p-5 text-center min-w-[160px]">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                    <step.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-1">{step.label}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-primary hidden md:block flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-3xl text-center mb-12">Who Is LINKSTART For?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 card-lift"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <role.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
