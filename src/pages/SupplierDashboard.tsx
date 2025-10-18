import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Package, TrendingUp, Users, Leaf, Plus, BarChart3 } from "lucide-react";

const SupplierDashboard = () => {
  const userName = localStorage.getItem("userName") || "Supplier";
  const userSpecialty = localStorage.getItem("userSpecialty") || "Raw Materials";

  const listings = [
    { name: "Organic Clay", stock: "2.5 tons", orders: 24, eco: 95 },
    { name: "Natural Dyes", stock: "450 kg", orders: 18, eco: 92 },
    { name: "Bamboo Fiber", stock: "1.2 tons", orders: 31, eco: 98 },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="font-heading text-4xl font-bold mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Manage your listings and track performance
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <Package className="h-8 w-8 text-primary" />
                <Badge className="bg-primary/10 text-primary">+12%</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">45</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </Card>

            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-secondary" />
                <Badge className="bg-secondary/10 text-secondary">+8%</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">₹2.4L</div>
              <div className="text-sm text-muted-foreground">Monthly Sales</div>
            </Card>

            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-accent" />
                <Badge className="bg-accent/10 text-accent">+5</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">128</div>
              <div className="text-sm text-muted-foreground">Connected Artisans</div>
            </Card>

            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <Leaf className="h-8 w-8 text-primary" />
                <Badge className="bg-primary/10 text-primary">Excellent</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">94%</div>
              <div className="text-sm text-muted-foreground">Eco Score</div>
            </Card>
          </div>

          {/* Active Listings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Your Listings</h2>
              <Button className="gradient-hero hover-lift">
                <Plus className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </div>

            <div className="grid gap-4">
              {listings.map((listing, index) => (
                <Card 
                  key={index}
                  className="p-6 card-glow hover-lift cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold mb-2">
                        {listing.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          Stock: {listing.stock}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {listing.orders} orders
                        </span>
                        <span className="flex items-center gap-1 text-accent font-medium">
                          <Leaf className="h-4 w-4" />
                          Eco: {listing.eco}%
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm" className="gradient-hero">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold mb-2">
                  AI Market Insights
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Demand for organic clay is expected to increase by 18% next quarter. 
                  Consider increasing stock levels to meet anticipated orders.
                </p>
                <Button variant="outline" size="sm" className="hover-lift border-primary">
                  View Full Analysis
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SupplierDashboard;
