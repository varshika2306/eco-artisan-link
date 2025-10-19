import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Search, Filter, MapPin, Leaf, TrendingUp, ShoppingCart, 
  Star, MessageCircle, Package, Clock, Sparkles, Users, Award,
  X, Plus, Minus, ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import materialsCollection from "@/assets/materials-collection.jpg";
import { toast } from "sonner";

interface Material {
  id: string;
  name: string;
  supplier: string;
  supplierRating: number;
  location: string;
  distance: string;
  price: number;
  unit: string;
  ecoRating: number;
  tags: string[];
  image: string;
  description: string;
  quantity: number;
  deliveryTime: string;
  minOrder: number;
  category: string;
}

interface CartItem extends Material {
  cartQuantity: number;
}

const MaterialHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [filterBy, setFilterBy] = useState("All Materials");

  const materials: Material[] = [
    {
      id: "1",
      name: "Natural Clay",
      supplier: "Organic Clay Co.",
      supplierRating: 4.8,
      location: "Rajasthan",
      distance: "45 km",
      price: 850,
      unit: "kg",
      ecoRating: 95,
      tags: ["Organic", "Local", "Eco-Certified"],
      image: "🏺",
      description: "Premium quality natural clay sourced from sustainable mines. Perfect for pottery and ceramic work.",
      quantity: 500,
      deliveryTime: "2-3 days",
      minOrder: 5,
      category: "Clay"
    },
    {
      id: "2",
      name: "Bamboo Fiber",
      supplier: "Green Fiber Ltd.",
      supplierRating: 4.9,
      location: "Kerala",
      distance: "120 km",
      price: 1200,
      unit: "kg",
      ecoRating: 98,
      tags: ["Sustainable", "Premium", "Locally Sourced"],
      image: "🎋",
      description: "High-quality bamboo fiber ideal for weaving and textile crafts. Eco-friendly and durable.",
      quantity: 300,
      deliveryTime: "3-4 days",
      minOrder: 10,
      category: "Fiber"
    },
    {
      id: "3",
      name: "Recycled Fabric",
      supplier: "EcoTextiles",
      supplierRating: 4.7,
      location: "Maharashtra",
      distance: "60 km",
      price: 650,
      unit: "kg",
      ecoRating: 92,
      tags: ["Recycled", "Budget-Friendly", "Eco-Certified"],
      image: "🧵",
      description: "Upcycled fabric scraps perfect for textile art and patchwork. Supports circular economy.",
      quantity: 450,
      deliveryTime: "1-2 days",
      minOrder: 3,
      category: "Textile"
    },
    {
      id: "4",
      name: "Metal Scrap",
      supplier: "Heritage Metals",
      supplierRating: 4.6,
      location: "Gujarat",
      distance: "85 km",
      price: 450,
      unit: "kg",
      ecoRating: 88,
      tags: ["Recycled", "Bulk", "Industrial"],
      image: "⚙️",
      description: "Clean metal scraps suitable for jewelry and metal craft work. Various alloys available.",
      quantity: 800,
      deliveryTime: "2-3 days",
      minOrder: 15,
      category: "Metal"
    },
    {
      id: "5",
      name: "Coconut Fiber",
      supplier: "Coastal Crafts",
      supplierRating: 4.8,
      location: "Tamil Nadu",
      distance: "200 km",
      price: 380,
      unit: "kg",
      ecoRating: 94,
      tags: ["Organic", "Traditional", "Locally Sourced"],
      image: "🥥",
      description: "Natural coconut coir fiber for rope making and traditional crafts. Strong and sustainable.",
      quantity: 600,
      deliveryTime: "4-5 days",
      minOrder: 20,
      category: "Fiber"
    },
    {
      id: "6",
      name: "Organic Dyes",
      supplier: "Nature Colors",
      supplierRating: 4.9,
      location: "Karnataka",
      distance: "150 km",
      price: 2500,
      unit: "kg",
      ecoRating: 97,
      tags: ["Organic", "Premium", "Eco-Certified"],
      image: "🎨",
      description: "Plant-based natural dyes with vibrant colors. Safe for skin contact and eco-friendly.",
      quantity: 150,
      deliveryTime: "3-4 days",
      minOrder: 2,
      category: "Dye"
    },
  ];

  const aiRecommendations = [
    "Based on your pottery work, Natural Clay and Organic Dyes are trending in your region this month.",
    "Bamboo Fiber is 15% cheaper this week due to harvest season - perfect for your weaving projects!",
    "Consider joining a cluster order for Metal Scrap to save up to 25% on bulk purchases."
  ];

  const [currentAITip, setCurrentAITip] = useState(0);

  const topRatedMaterials = materials
    .sort((a, b) => b.supplierRating - a.supplierRating)
    .slice(0, 3);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "All Materials" || material.category === filterBy;
    return matchesSearch && matchesFilter;
  });

  const addToCart = (material: Material, quantity: number) => {
    const existingItem = cart.find(item => item.id === material.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === material.id 
          ? { ...item, cartQuantity: item.cartQuantity + quantity }
          : item
      ));
      toast.success(`Updated ${material.name} quantity in cart`);
    } else {
      setCart([...cart, { ...material, cartQuantity: quantity }]);
      toast.success(`Added ${material.name} to cart`);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => 
      item.id === id ? { ...item, cartQuantity: quantity } : item
    ));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8 pb-24">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hover-lift">
                  <Filter className="mr-2 h-4 w-4" />
                  {filterBy}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card">
                <DropdownMenuItem onClick={() => setFilterBy("All Materials")}>
                  All Materials
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Clay")}>
                  Clay
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Fiber")}>
                  Fiber
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Textile")}>
                  Textile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Metal")}>
                  Metal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Dye")}>
                  Dye
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* AI Recommendation Banner */}
          <Card className="p-6 card-glow overflow-hidden relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <Badge className="bg-accent/20 text-accent mb-2">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  AI Insight by Mingle AI
                </Badge>
                <p className="text-foreground font-medium mb-2">
                  {aiRecommendations[currentAITip]}
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentAITip((currentAITip + 1) % aiRecommendations.length)}
                  className="hover-lift"
                >
                  Next Insight
                </Button>
              </div>
            </div>
          </Card>

          {/* Material Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Available Materials</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredMaterials.map((material, index) => (
                <Card 
                  key={material.id}
                  className="p-6 card-glow hover-lift cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {material.image}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-heading text-lg font-semibold mb-1">
                          {material.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{material.supplier}</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            {material.supplierRating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {material.location} ({material.distance})
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {material.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="space-y-1">
                          <div className="text-xl font-bold text-primary">
                            ₹{material.price}/{material.unit}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Leaf className="h-3 w-3 text-accent" />
                            <span className="text-accent font-medium">
                              {material.ecoRating}% Eco
                            </span>
                          </div>
                        </div>

                        <Button 
                          size="sm"
                          onClick={() => setSelectedMaterial(material)}
                          className="gradient-hero hover-lift"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Insights Section */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-xl font-semibold">Community Insights</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {topRatedMaterials.map((material) => (
                <Card key={material.id} className="p-4 hover-lift cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{material.image}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{material.name}</p>
                      <p className="text-xs text-muted-foreground">{material.supplier}</p>
                    </div>
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {material.supplierRating}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4 p-4 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span>Most ordered by artisans this month: Natural Clay (+45%), Bamboo Fiber (+32%)</span>
              </p>
            </div>
          </Card>

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

        {/* Floating Cart Button */}
        {totalItems > 0 && (
          <Button
            onClick={() => setShowCart(true)}
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg gradient-hero hover-lift z-50"
            size="icon"
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent">
              {totalItems}
            </Badge>
          </Button>
        )}

        {/* Material Detail Dialog */}
        <Dialog open={selectedMaterial !== null} onOpenChange={() => setSelectedMaterial(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedMaterial && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <span className="text-4xl">{selectedMaterial.image}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedMaterial.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedMaterial.supplier}</p>
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedMaterial.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Available Quantity</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedMaterial.quantity} {selectedMaterial.unit}</p>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Delivery Time</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedMaterial.deliveryTime}</p>
                    </Card>
                  </div>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Location</span>
                      </div>
                      <span className="text-sm">{selectedMaterial.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Supplier Rating</span>
                      </div>
                      <span className="text-sm font-bold">{selectedMaterial.supplierRating}/5.0</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">Eco Score</span>
                      </div>
                      <span className="text-sm font-bold text-accent">{selectedMaterial.ecoRating}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Minimum Order</span>
                      <span className="text-sm">{selectedMaterial.minOrder} {selectedMaterial.unit}</span>
                    </div>
                  </Card>

                  <div className="flex flex-wrap gap-2">
                    {selectedMaterial.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-3xl font-bold text-primary">
                        ₹{selectedMaterial.price}/{selectedMaterial.unit}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="gradient-hero"
                        onClick={() => {
                          addToCart(selectedMaterial, selectedMaterial.minOrder);
                          setSelectedMaterial(null);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Cart Dialog */}
        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                My Cart ({totalItems} items)
              </DialogTitle>
            </DialogHeader>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.supplier}</p>
                        <p className="text-lg font-bold text-primary mt-2">
                          ₹{item.price * item.cartQuantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.cartQuantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Estimated Delivery</span>
                      <span>2-5 days</span>
                    </div>
                    <div className="flex justify-between text-accent font-medium">
                      <span>🌿 Cluster Savings (15%)</span>
                      <span>-₹{Math.round(totalPrice * 0.15)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{Math.round(totalPrice * 0.85)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full gradient-hero"
                    onClick={() => {
                      toast.success("Order confirmed! Check your orders page for tracking.");
                      setCart([]);
                      setShowCart(false);
                    }}
                  >
                    Confirm Order
                  </Button>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default MaterialHub;
