import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Droplets, Recycle, Sparkles, RefreshCw, Leaf } from "lucide-react";
import { toast } from "sonner";
import analyticsData from "@/data/analytics.json";

const SupplierAnalytics = () => {
  const [data, setData] = useState(analyticsData);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newRevenue = data.revenue.map(item => ({
        ...item,
        amount: item.amount + Math.floor(Math.random() * 20000 - 10000)
      }));
      setData({ ...data, revenue: newRevenue });
      setIsRefreshing(false);
      toast.success("Data refreshed");
    }, 1000);
  };

  const cycleSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % data.aiSuggestions.length);
  };

  useEffect(() => {
    const interval = setInterval(cycleSuggestion, 10000);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    primary: "hsl(14 65% 52%)",
    secondary: "hsl(60 38% 48%)",
    accent: "hsl(142 45% 52%)"
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <h1 className="font-heading text-4xl font-bold mb-2">Performance Analytics</h1>
              <p className="text-muted-foreground">Track sales, sustainability, and growth metrics</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gradient-hero hover-lift"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 space-y-4">
              <h2 className="font-heading text-2xl font-bold">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.revenue}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={colors.primary} 
                    strokeWidth={3}
                    dot={{ fill: colors.primary, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-bold">AI Insights</h2>
              </div>
              <p className="text-sm leading-relaxed animate-fade-in" key={currentSuggestion}>
                {data.aiSuggestions[currentSuggestion]}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full hover-lift border-primary"
                onClick={cycleSuggestion}
              >
                Next Suggestion
              </Button>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="font-heading text-2xl font-bold">Top Selling Materials</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topMaterials} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="sales" radius={[0, 8, 8, 0]}>
                    {data.topMaterials.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? colors.secondary : colors.accent} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="font-heading text-2xl font-bold">Cluster Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.clusterGrowth}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="clusters" fill={colors.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="font-heading text-2xl font-bold mb-6">Eco Impact Dashboard</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 card-glow">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{data.ecoImpact.co2Saved}</div>
                <div className="text-sm text-muted-foreground">CO₂ Saved</div>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 card-glow">
                <Droplets className="h-12 w-12 text-accent mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{data.ecoImpact.waterReduced}</div>
                <div className="text-sm text-muted-foreground">Water Reduced</div>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 card-glow">
                <Recycle className="h-12 w-12 text-secondary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{data.ecoImpact.recycledPercent}%</div>
                <div className="text-sm text-muted-foreground">Recycled Materials</div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SupplierAnalytics;
