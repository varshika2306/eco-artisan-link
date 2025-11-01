import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Package, TrendingUp, Users, Leaf, Plus, BarChart3, ArrowUp, ArrowDown, Briefcase } from "lucide-react";
import { AddListingModal } from "@/components/supplier/AddListingModal";
import { toast } from "sonner";
import supplierData from "@/data/supplier_data.json";
import clustersData from "@/data/clusters_mapping.json";

type Listing = {
  id: string;
  name: string;
  stock: string;
  unit: string;
  pricePerKg: number;
  orders: number;
  ecoScore: number;
  status: string;
  moq: number;
  image: string;
  description: string;
};

const SupplierDashboard = () => {
  const userName = localStorage.getItem("userName") || "Supplier";
  const userSupplierType = localStorage.getItem("userSupplierType") || "";
  const [metrics, setMetrics] = useState(supplierData.metrics);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState(0);
  
  const supplierTypeInfo = clustersData.supplierTypes.find(s => s.id === userSupplierType);

  const aiInsights = [
    "Demand for organic clay is expected to increase by 18% next quarter. Consider increasing stock levels to meet anticipated orders.",
    "Your eco score of 94% puts you in the top 5% of suppliers. Highlight this in your listings for better visibility.",
    "Hemp fabric orders have grown 25% month-over-month. Consider expanding this product line."
  ];

  useEffect(() => {
    const stored = localStorage.getItem("supplierListings");
    if (stored) {
      setListings(JSON.parse(stored).slice(0, 3));
    } else {
      setListings(supplierData.listings.slice(0, 3));
    }

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeListings: prev.activeListings + Math.floor(Math.random() * 3 - 1),
        connectedArtisans: prev.connectedArtisans + Math.floor(Math.random() * 5 - 2)
      }));
    }, 10000);

    const insightInterval = setInterval(() => {
      setAiInsight(prev => (prev + 1) % aiInsights.length);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearInterval(insightInterval);
    };
  }, []);

  const handleAddListing = (listing: Listing) => {
    const newListing = { ...listing, id: Date.now().toString() };
    const allListings = [...(JSON.parse(localStorage.getItem("supplierListings") || "[]")), newListing];
    localStorage.setItem("supplierListings", JSON.stringify(allListings));
    setListings(allListings.slice(0, 3));
    setIsModalOpen(false);
    toast.success("🎉 New listing added!");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-heading text-4xl font-bold">
                Welcome back, {userName}!
              </h1>
              {supplierTypeInfo && (
                <Badge className="bg-gradient-to-r from-primary to-accent text-white text-lg px-4 py-1">
                  <span className="mr-2">{supplierTypeInfo.icon}</span>
                  {supplierTypeInfo.name}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Manage your listings and track performance
            </p>
            {supplierTypeInfo && supplierTypeInfo.certifications && (
              <div className="flex flex-wrap gap-2 mt-3">
                {supplierTypeInfo.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="secondary">
                    <Briefcase className="mr-1 h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <Package className="h-8 w-8 text-primary" />
                <Badge className={`${metrics.changes.activeListings > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {metrics.changes.activeListings > 0 ? <ArrowUp className="h-3 w-3 inline mr-1" /> : <ArrowDown className="h-3 w-3 inline mr-1" />}
                  {Math.abs(metrics.changes.activeListings)}%
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{metrics.activeListings}</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </Card>

            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-secondary" />
                <Badge className="bg-green-100 text-green-600">
                  <ArrowUp className="h-3 w-3 inline mr-1" />
                  {metrics.changes.monthlySales}%
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">₹{(metrics.monthlySales / 1000).toFixed(1)}L</div>
              <div className="text-sm text-muted-foreground">Monthly Sales</div>
            </Card>

            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-accent" />
                <Badge className="bg-green-100 text-green-600">
                  <ArrowUp className="h-3 w-3 inline mr-1" />
                  {metrics.changes.connectedArtisans}
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{metrics.connectedArtisans}</div>
              <div className="text-sm text-muted-foreground">Connected Artisans</div>
            </Card>

            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-2">
                <Leaf className="h-8 w-8 text-primary" />
                <Badge className="bg-primary/10 text-primary">Excellent</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{metrics.ecoScore}%</div>
              <div className="text-sm text-muted-foreground">Eco Score</div>
            </Card>
          </div>

          {/* Active Listings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Your Listings</h2>
              <Button className="gradient-hero hover-lift" onClick={() => setIsModalOpen(true)}>
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
                          Eco: {listing.ecoScore}%
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
                <p className="text-sm text-muted-foreground mb-4 animate-fade-in" key={aiInsight}>
                  {aiInsights[aiInsight]}
                </p>
                <Button variant="outline" size="sm" className="hover-lift border-primary">
                  View Full Analysis
                </Button>
              </div>
            </div>
          </Card>
        </main>

        <AddListingModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          listing={null}
          onSave={handleAddListing}
        />
      </div>
    </SidebarProvider>
  );
};

export default SupplierDashboard;
