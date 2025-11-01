import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Filter, MapPin, Leaf, TrendingUp, ShoppingCart, 
  Star, MessageCircle, Package, Clock, Sparkles, Users, Award,
  X, Plus, Minus, ChevronDown, Target, Zap, Bookmark, BookmarkCheck,
  AlertCircle, ThumbsUp, Lightbulb, PieChart, Calendar, Heart, Copy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import materialsCollection from "@/assets/materials-collection.jpg";
import { toast } from "sonner";
import clustersData from "@/data/clusters_mapping.json";
import reviewsData from "@/data/material_reviews.json";

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
  const [userCluster, setUserCluster] = useState<string>("");
  const [matchedSuppliers, setMatchedSuppliers] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [bookmarkedSuppliers, setBookmarkedSuppliers] = useState<string[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");

  useEffect(() => {
    // Get artisan's cluster from localStorage
    const cluster = localStorage.getItem("userCluster") || "";
    setUserCluster(cluster);

    // Load bookmarks and inventory
    const savedBookmarks = localStorage.getItem("bookmarkedSuppliers");
    if (savedBookmarks) setBookmarkedSuppliers(JSON.parse(savedBookmarks));

    const savedInventory = localStorage.getItem("materialInventory");
    if (savedInventory) setInventory(JSON.parse(savedInventory));

    if (cluster) {
      // Find matching rule
      const rule = clustersData.aiMatchingRules[cluster as keyof typeof clustersData.aiMatchingRules];
      if (rule) {
        setMatchedSuppliers(rule.priority);
        setAiSuggestion(rule.suggestion);
      }
    }
  }, []);

  const toggleBookmark = (supplierId: string) => {
    const updated = bookmarkedSuppliers.includes(supplierId)
      ? bookmarkedSuppliers.filter(id => id !== supplierId)
      : [...bookmarkedSuppliers, supplierId];
    setBookmarkedSuppliers(updated);
    localStorage.setItem("bookmarkedSuppliers", JSON.stringify(updated));
    toast.success(bookmarkedSuppliers.includes(supplierId) ? "Supplier removed from bookmarks" : "Supplier bookmarked!");
  };

  const updateInventory = (materialId: string, quantity: number) => {
    const updated = { ...inventory, [materialId]: quantity };
    setInventory(updated);
    localStorage.setItem("materialInventory", JSON.stringify(updated));
    toast.success("Inventory updated");
  };

  const generateMaterialStory = (material: Material) => {
    setShowStoryModal(true);
    setTimeout(() => {
      const stories = [
        `Discover the beauty of ${material.name}, sourced sustainably from ${material.location}. This premium material from ${material.supplier} embodies our commitment to eco-friendly craftsmanship. With a ${material.ecoRating}% sustainability score, it's perfect for creating authentic, earth-conscious pieces that tell a story.`,
        `${material.name} from ${material.supplier} represents the finest in sustainable sourcing. Each batch is carefully selected to meet our rigorous quality standards. Perfect for artisans who value both tradition and environmental responsibility.`,
        `Transform your craft with ${material.name}. This ${material.tags.join(", ")} material brings together quality, sustainability, and artisan values. Trusted by ${material.location} craftspeople for generations.`
      ];
      setGeneratedStory(stories[Math.floor(Math.random() * stories.length)]);
    }, 1500);
  };

  const clusterInsights = userCluster ? reviewsData.clusterInsights[userCluster as keyof typeof reviewsData.clusterInsights] : null;

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

  const aiRecommendations = aiSuggestion 
    ? [
        aiSuggestion,
        "Based on your craft cluster, these suppliers are verified and eco-certified.",
        "Consider joining a cluster order to save up to 25% on bulk purchases."
      ]
    : [
        "Complete your profile to get personalized supplier recommendations!",
        "Join a craft cluster to unlock exclusive material discounts.",
        "Explore eco-certified suppliers for better sustainability scores."
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

          {/* Cluster Insights & Inventory Panel */}
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">
                <PieChart className="mr-2 h-4 w-4" />
                Cluster Insights
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Package className="mr-2 h-4 w-4" />
                My Inventory
              </TabsTrigger>
              <TabsTrigger value="bookmarks">
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Suppliers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4 mt-4">
              {clusterInsights ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-6 card-glow">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-lg font-semibold">Top Materials</h3>
                    </div>
                    <div className="space-y-2">
                      {clusterInsights.topMaterials.map((material, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                          <span className="font-medium">{material}</span>
                          <Badge variant="secondary">Popular</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 card-glow">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-accent" />
                      <h3 className="font-heading text-lg font-semibold">Seasonal Trends</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">{clusterInsights.seasonalTrends}</p>
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
                        <p className="text-sm font-medium">{clusterInsights.costSavingTip}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 card-glow md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-lg font-semibold">Average Monthly Spend</h3>
                    </div>
                    <p className="text-3xl font-bold text-primary">₹{clusterInsights.avgMonthlySpend.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Based on your cluster average</p>
                  </Card>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Complete your profile to see cluster insights</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold">Track Your Materials</h3>
                  <Badge variant="secondary">{Object.keys(inventory).length} items tracked</Badge>
                </div>
                {Object.keys(inventory).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(inventory).map(([materialId, quantity]) => {
                      const material = materials.find(m => m.id === materialId);
                      if (!material) return null;
                      const stockLevel = (quantity / 100) * 100;
                      return (
                        <div key={materialId} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{material.image}</span>
                              <div>
                                <p className="font-medium">{material.name}</p>
                                <p className="text-sm text-muted-foreground">{quantity} {material.unit}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newQty = prompt(`Update quantity for ${material.name}:`, quantity.toString());
                                if (newQty) updateInventory(materialId, parseInt(newQty));
                              }}
                            >
                              Update
                            </Button>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Stock Level</span>
                              <span className={stockLevel < 30 ? "text-destructive" : "text-accent"}>{stockLevel}%</span>
                            </div>
                            <Progress value={stockLevel} className="h-2" />
                            {stockLevel < 30 && (
                              <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Running low - consider reordering
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-3">No materials tracked yet</p>
                    <p className="text-sm text-muted-foreground">Add materials from cart to track inventory</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold">Saved Suppliers</h3>
                  <Badge variant="secondary">{bookmarkedSuppliers.length} saved</Badge>
                </div>
                {bookmarkedSuppliers.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {bookmarkedSuppliers.map((supplierId) => {
                      const material = materials.find(m => m.supplier.toLowerCase().replace(/\s+/g, "-") === supplierId);
                      return material ? (
                        <Card key={supplierId} className="p-4 hover-lift">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{material.supplier}</p>
                              <p className="text-xs text-muted-foreground">{material.location}</p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleBookmark(supplierId)}
                            >
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-sm">{material.supplierRating}</span>
                            <Badge className="bg-accent/10 text-accent ml-auto text-xs">
                              {material.ecoRating}% Eco
                            </Badge>
                          </div>
                        </Card>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No saved suppliers yet</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* AI Matchmaking Banner */}
          {userCluster && matchedSuppliers.length > 0 && (
            <Card className="p-6 card-glow overflow-hidden relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <Badge className="bg-primary text-primary-foreground mb-2">
                    <Zap className="mr-1 h-3 w-3" />
                    AI Smart Match Active
                  </Badge>
                  <h3 className="font-heading text-lg font-bold mb-1">
                    Suppliers Matched to Your Cluster
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {clustersData.artisanClusters.find(c => c.id === userCluster)?.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {matchedSuppliers.map((supplierId) => {
                      const supplier = clustersData.supplierTypes.find(s => s.id === supplierId);
                      return supplier ? (
                        <Badge key={supplierId} variant="secondary" className="text-sm">
                          <span className="mr-1">{supplier.icon}</span>
                          {supplier.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </Card>
          )}

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

                  {/* Community Reviews Section */}
                  <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold">Community Reviews</h4>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {reviewsData.reviews
                        .filter(r => r.materialId === selectedMaterial.id)
                        .map((review, idx) => (
                          <div key={idx} className="p-3 bg-card rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{review.artisanName}</span>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                            <Button size="sm" variant="ghost" className="h-auto p-1">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span className="text-xs">Helpful ({review.helpful})</span>
                            </Button>
                          </div>
                        ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowReviewModal(true)}
                      className="w-full mt-3"
                    >
                      Write a Review
                    </Button>
                  </Card>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const supplierId = selectedMaterial.supplier.toLowerCase().replace(/\s+/g, "-");
                        toggleBookmark(supplierId);
                      }}
                    >
                      {bookmarkedSuppliers.includes(selectedMaterial.supplier.toLowerCase().replace(/\s+/g, "-")) ? (
                        <BookmarkCheck className="mr-2 h-4 w-4" />
                      ) : (
                        <Bookmark className="mr-2 h-4 w-4" />
                      )}
                      {bookmarkedSuppliers.includes(selectedMaterial.supplier.toLowerCase().replace(/\s+/g, "-")) ? "Saved" : "Save Supplier"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        generateMaterialStory(selectedMaterial);
                        setSelectedMaterial(null);
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Story
                    </Button>
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
                          updateInventory(selectedMaterial.id, selectedMaterial.minOrder);
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

        {/* AI Story Generation Modal */}
        <Dialog open={showStoryModal} onOpenChange={setShowStoryModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Material Story
              </DialogTitle>
              <DialogDescription>
                Generate compelling narratives about your materials for marketing
              </DialogDescription>
            </DialogHeader>

            {!generatedStory ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground mt-4">Crafting your story...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                  <p className="text-sm leading-relaxed">{generatedStory}</p>
                </Card>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedStory);
                      toast.success("Story copied to clipboard!");
                    }}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newStory = generatedStory;
                      setReviewText(newStory);
                      toast.info("Use this in your product listings!");
                    }}
                    className="flex-1"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Use in Listing
                  </Button>
                  <Button
                    onClick={() => {
                      setGeneratedStory("");
                      setShowStoryModal(false);
                    }}
                    className="flex-1 gradient-hero"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Modal */}
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience to help other artisans
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="sm"
                      onClick={() => setReviewRating(rating)}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          rating <= reviewRating ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review">Your Review</Label>
                <Textarea
                  id="review"
                  placeholder="Share your experience with this material..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => {
                  toast.success("Thank you for your review!");
                  setShowReviewModal(false);
                  setReviewText("");
                  setReviewRating(5);
                }}
                className="w-full gradient-hero"
              >
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default MaterialHub;
