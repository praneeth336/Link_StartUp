import { motion } from "framer-motion";
import { Lightbulb, Brain, Wrench, Users, Handshake, Rocket, CheckCircle } from "lucide-react";

const steps = [
  { icon: Lightbulb, title: "Submit Your Idea", description: "Share your startup idea on LINKSTART with details about domain, skills needed, and team requirements.", color: "from-blue-500 to-blue-600" },
  { icon: Brain, title: "AI & Expert Validation", description: "Your idea gets analyzed by our AI system and reviewed by industry experts for viability and market potential.", color: "from-purple-500 to-purple-600" },
  { icon: Wrench, title: "Build Prototype", description: "Use our resources and connections to build an MVP. Get feedback from early adopters and iterate quickly.", color: "from-cyan-500 to-cyan-600" },
  { icon: Users, title: "Find Co-Founders", description: "Browse our talent marketplace to find skilled co-founders who complement your strengths and share your vision.", color: "from-emerald-500 to-emerald-600" },
  { icon: Handshake, title: "Connect with Investors", description: "Get matched with investors interested in your domain. Present your validated idea with expert endorsements.", color: "from-amber-500 to-amber-600" },
  { icon: Rocket, title: "Launch Startup", description: "With a validated idea, strong team, and funding — launch your startup and scale with continued platform support.", color: "from-rose-500 to-rose-600" },
];

export default function StepsPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Steps to <span className="gradient-text">Startup Success</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Your roadmap from idea to launch in six clear steps.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-6 pb-12 last:pb-0"
              >
                {/* Timeline line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-[calc(100%-3.5rem)] bg-border/50" />
                )}
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 relative z-10`}>
                  <step.icon className="h-6 w-6 text-foreground" />
                </div>
                {/* Content */}
                <div className="glass rounded-xl p-6 flex-1 card-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary">Step {i + 1}</span>
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
