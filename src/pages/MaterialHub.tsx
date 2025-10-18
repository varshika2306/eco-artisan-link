import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Search, Filter, MapPin, Leaf, TrendingUp, ShoppingCart } from "lucide-react";
import materialsCollection from "@/assets/materials-collection.jpg";

const MaterialHub = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const suppliers = [
    {
      name: "Organic Clay Co.",
      material: "Natural Clay",
      location: "Rajasthan",
      distance: "45 km",
      price: "₹850/kg",
      ecoRating: 95,
      tags: ["Organic", "Local"],
    },
    {
      name: "Green Fiber Ltd.",
      material: "Bamboo Fiber",
      location: "Kerala",
      distance: "120 km",
      price: "₹1200/kg",
      ecoRating: 98,
      tags: ["Sustainable", "Premium"],
    },
    {
      name: "Heritage Textiles",
      material: "Cotton Thread",
      location: "Gujarat",
      distance: "85 km",
      price: "₹450/kg",
      ecoRating: 88,
      tags: ["Traditional", "Bulk"],
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="font-heading text-4xl font-bold mb-2">Raw Material Hub</h1>
            <p className="text-muted-foreground">
              Discover sustainable materials from verified suppliers near you
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-primary/20"
              />
            </div>
            <Button variant="outline" className="hover-lift">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Featured Banner */}
          <Card className="p-6 card-glow overflow-hidden relative">
            <div 
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url(${materialsCollection})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="relative z-10">
              <Badge className="bg-accent/20 text-accent mb-3">
                <TrendingUp className="mr-1 h-3 w-3" />
                AI Recommendation
              </Badge>
              <h3 className="font-heading text-xl font-semibold mb-2">
                Top Materials for Your Craft
              </h3>
              <p className="text-muted-foreground text-sm">
                Based on your pottery specialty, we recommend natural clay and organic glazes
              </p>
            </div>
          </Card>

          {/* Supplier Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Available Suppliers</h2>
              <Button size="sm" className="gradient-hero hover-lift">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Cart (0)
              </Button>
            </div>

            <div className="grid gap-4">
              {suppliers.map((supplier, index) => (
                <Card 
                  key={index}
                  className="p-6 card-glow hover-lift cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <Leaf className="h-12 w-12 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-medium">{supplier.material}</p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-heading text-xl font-semibold mb-2">
                          {supplier.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {supplier.location} ({supplier.distance})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {supplier.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-primary">
                            {supplier.price}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Leaf className="h-4 w-4 text-accent" />
                            <span className="text-accent font-medium">
                              Eco Score: {supplier.ecoRating}%
                            </span>
                          </div>
                        </div>

                        <Button className="gradient-hero hover-lift">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Cooperative Cluster Banner */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-primary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1">
                  Join a Cooperative Cluster
                </h3>
                <p className="text-sm text-muted-foreground">
                  Save up to 25% by pooling orders with other artisans
                </p>
              </div>
              <Button variant="outline" className="hover-lift border-primary">
                Learn More
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MaterialHub;
