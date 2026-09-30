import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, DollarSign, Users, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const yearlyData = [
  { year: "2020", ideas: 1200, startups: 80 },
  { year: "2021", ideas: 2800, startups: 180 },
  { year: "2022", ideas: 4500, startups: 320 },
  { year: "2023", ideas: 7200, startups: 520 },
  { year: "2024", ideas: 10400, startups: 720 },
  { year: "2025", ideas: 12400, startups: 850 },
];

const fundingData = [
  { year: "2020", amount: 12 },
  { year: "2021", amount: 45 },
  { year: "2022", amount: 120 },
  { year: "2023", amount: 280 },
  { year: "2024", amount: 450 },
  { year: "2025", amount: 680 },
];

const domainData = [
  { name: "AI/ML", value: 32 },
  { name: "FinTech", value: 22 },
  { name: "HealthTech", value: 18 },
  { name: "EdTech", value: 12 },
  { name: "CleanTech", value: 10 },
  { name: "Other", value: 6 },
];

const COLORS = ["hsl(217,91%,60%)", "hsl(160,84%,39%)", "hsl(280,70%,60%)", "hsl(40,90%,55%)", "hsl(340,75%,55%)", "hsl(215,25%,50%)"];

const summaryStats = [
  { icon: Lightbulb, label: "Ideas Submitted", value: "12,400+" },
  { icon: TrendingUp, label: "Startups Launched", value: "850+" },
  { icon: DollarSign, label: "Funding Raised", value: "$680M+" },
  { icon: Users, label: "Active Users", value: "45,000+" },
];

export default function StatisticsPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              <BarChart3 className="inline h-10 w-10 text-primary mr-3" />
              Platform Statistics
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Real-time data on the LINKSTART ecosystem growth.</p>
          </motion.div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {summaryStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 text-center card-lift"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-display font-bold text-2xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ideas & Startups */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold mb-6">Ideas Submitted & Startups Launched</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,24%)" />
                  <XAxis dataKey="year" stroke="hsl(215,25%,63%)" fontSize={12} />
                  <YAxis stroke="hsl(215,25%,63%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(217,33%,17%)", border: "1px solid hsl(217,33%,24%)", borderRadius: "8px", color: "hsl(210,40%,98%)" }} />
                  <Bar dataKey="ideas" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} name="Ideas" />
                  <Bar dataKey="startups" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} name="Startups" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Funding */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold mb-6">Total Funding Raised ($M)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fundingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,24%)" />
                  <XAxis dataKey="year" stroke="hsl(215,25%,63%)" fontSize={12} />
                  <YAxis stroke="hsl(215,25%,63%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(217,33%,17%)", border: "1px solid hsl(217,33%,24%)", borderRadius: "8px", color: "hsl(210,40%,98%)" }} />
                  <Line type="monotone" dataKey="amount" stroke="hsl(160,84%,39%)" strokeWidth={3} dot={{ fill: "hsl(160,84%,39%)", r: 5 }} name="Funding ($M)" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Domain Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl p-6 lg:col-span-2">
              <h3 className="font-display font-semibold mb-6">Ideas by Domain</h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={domainData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={4} dataKey="value">
                      {domainData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(217,33%,17%)", border: "1px solid hsl(217,33%,24%)", borderRadius: "8px", color: "hsl(210,40%,98%)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center">
                  {domainData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-sm text-muted-foreground">{d.name} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
