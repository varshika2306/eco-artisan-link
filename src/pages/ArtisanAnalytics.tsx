import { motion } from "framer-motion";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Leaf, RefreshCw, Download } from "lucide-react";

const ArtisanAnalytics = () => {
  const revenueData = [
    { month: "Jan", revenue: 4200, savings: 800 },
    { month: "Feb", revenue: 5100, savings: 1100 },
    { month: "Mar", revenue: 4800, savings: 950 },
    { month: "Apr", revenue: 6200, savings: 1400 },
    { month: "May", revenue: 7500, savings: 1800 },
  ];

  const craftSalesData = [
    { craft: "Pottery", sales: 145 },
    { craft: "Textiles", sales: 98 },
    { craft: "Jewelry", sales: 76 },
    { craft: "Woodwork", sales: 54 },
    { craft: "Others", sales: 43 },
  ];

  const sustainabilityData = [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 85 },
    { month: "May", score: 89 },
  ];

  const ecoImpactData = [
    { name: "CO₂ Saved", value: 450, color: "hsl(var(--primary))" },
    { name: "Water Saved", value: 320, color: "hsl(var(--accent))" },
    { name: "Waste Reduced", value: 230, color: "hsl(var(--secondary))" },
  ];

  const clusterGrowthData = [
    { quarter: "Q1", members: 12, orders: 45 },
    { quarter: "Q2", members: 18, orders: 78 },
    { quarter: "Q3", members: 24, orders: 112 },
    { quarter: "Q4", members: 32, orders: 156 },
  ];

  const kpiCards = [
    { title: "Total Revenue", value: "₹27,800", change: "+23%", trend: "up", icon: DollarSign, color: "primary" },
    { title: "Cost Savings", value: "₹6,050", change: "+34%", trend: "up", icon: TrendingUp, color: "accent" },
    { title: "Active Customers", value: "324", change: "+12%", trend: "up", icon: Users, color: "secondary" },
    { title: "Crafts Sold", value: "416", change: "+8%", trend: "up", icon: Package, color: "primary" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="font-heading text-3xl font-bold mb-2">Analytics & Impact</h1>
              <p className="text-muted-foreground">
                Track your performance and sustainability impact
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button className="gradient-hero">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 card-glow hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${kpi.color}/10 flex items-center justify-center`}>
                      <kpi.icon className={`h-6 w-6 text-${kpi.color}`} />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${kpi.trend === 'up' ? 'text-accent border-accent' : 'text-destructive border-destructive'}`}
                    >
                      {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {kpi.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{kpi.value}</h3>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Revenue & Savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 card-glow">
              <h2 className="font-heading text-xl font-semibold mb-4">Revenue & Cluster Savings</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Revenue (₹)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="hsl(var(--accent))" 
                    fillOpacity={1} 
                    fill="url(#colorSavings)" 
                    name="Savings (₹)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Craft Sales */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 card-glow">
                <h2 className="font-heading text-xl font-semibold mb-4">Top Selling Crafts</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={craftSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="craft" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Sustainability Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 card-glow">
                <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-accent" />
                  Sustainability Score
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sustainabilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      name="Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Eco Impact & Cluster Growth */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Eco Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 card-glow">
                <h2 className="font-heading text-xl font-semibold mb-4">Eco Impact Distribution</h2>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ecoImpactData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}kg`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ecoImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {ecoImpactData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.value}kg
                      </div>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Cluster Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 card-glow">
                <h2 className="font-heading text-xl font-semibold mb-4">Cluster Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clusterGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="members" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} name="Members" />
                    <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid sm:grid-cols-3 gap-4"
          >
            <Card className="p-6 text-center card-glow bg-gradient-to-br from-primary/10 to-transparent">
              <div className="text-4xl font-bold text-primary mb-2">89%</div>
              <div className="text-sm text-muted-foreground">Overall Sustainability Score</div>
            </Card>
            <Card className="p-6 text-center card-glow bg-gradient-to-br from-accent/10 to-transparent">
              <div className="text-4xl font-bold text-accent mb-2">₹1,000</div>
              <div className="text-sm text-muted-foreground">Avg. Savings per Order</div>
            </Card>
            <Card className="p-6 text-center card-glow bg-gradient-to-br from-secondary/10 to-transparent">
              <div className="text-4xl font-bold text-secondary mb-2">32</div>
              <div className="text-sm text-muted-foreground">Active Cluster Members</div>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center py-8 border-t border-border"
          >
            <p className="text-muted-foreground italic">
              "Data-Driven Decisions, Sustainable Growth — MingleMakers Analytics"
            </p>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ArtisanAnalytics;