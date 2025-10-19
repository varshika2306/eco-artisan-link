import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Recycle, ArrowLeftRight, Sparkles, Trophy, Leaf, Search } from "lucide-react";

const SwapBarter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [points, setPoints] = useState(850);
  const [ecoLevel, setEcoLevel] = useState("Gold");
  
  const [offerings, setOfferings] = useState([
    { id: 1, name: "Clay - 5kg", eco: 95, owner: "You" },
    { id: 2, name: "Natural Dye - 2L", eco: 92, owner: "You" },
  ]);
  
  const [requests, setRequests] = useState([
    { id: 1, name: "Organic Cotton - 3kg", eco: 98, requester: "Priya K." },
    { id: 2, name: "Bamboo Fiber - 4kg", eco: 96, requester: "Raj M." },
    { id: 3, name: "Terracotta Clay - 10kg", eco: 93, requester: "Anjali S." },
  ]);

  const handleMatch = (item: any) => {
    toast.success(`Match found! Connecting you with ${item.requester}...`);
    const newPoints = points + 50;
    setPoints(newPoints);
    
    setTimeout(() => {
      toast.success(`+50 Eco Points! New total: ${newPoints}`);
    }, 1000);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-heading text-3xl font-bold">Swap & Barter Zone</h1>
              <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">
                <Trophy className="mr-2 h-5 w-5" />
                {points} Points
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Exchange leftover materials sustainably within your cluster
            </p>
          </motion.div>

          {/* Eco Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-6 bg-gradient-to-r from-accent/10 to-secondary/10 card-glow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Eco Level: {ecoLevel}</h3>
                  <p className="text-sm text-muted-foreground">Keep swapping to reach Platinum!</p>
                </div>
                <div className="flex gap-2">
                  {['Bronze', 'Silver', 'Gold', 'Platinum'].map((level, i) => (
                    <div
                      key={level}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        i <= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <Leaf className="h-6 w-6" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1 }}
                />
              </div>
            </Card>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* My Offerings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 card-glow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-semibold">My Offerings</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gradient-hero">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Add Offering
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Offering</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Material Name</Label>
                          <Input placeholder="e.g., Cotton Fabric - 5kg" />
                        </div>
                        <div>
                          <Label>Eco Score (%)</Label>
                          <Input type="number" placeholder="95" />
                        </div>
                        <div>
                          <Label>Quantity Available</Label>
                          <Input placeholder="5kg" />
                        </div>
                        <Button className="w-full">Add to Offerings</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {offerings.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-4 hover-lift cursor-move border-2 border-dashed border-primary/30 hover:border-primary/60">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  <Leaf className="mr-1 h-3 w-3" />
                                  {item.eco}% Eco
                                </Badge>
                              </div>
                            </div>
                            <Recycle className="h-6 w-6 text-primary" />
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>

            {/* Available Requests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 card-glow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-semibold">Available Requests</h2>
                  <Badge variant="outline">{requests.length} Active</Badge>
                </div>

                <div className="space-y-3">
                  {requests.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="p-4 hover-lift border-2 border-accent/30 hover:border-accent">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Requested by {item.requester}
                              </p>
                            </div>
                            <Badge className="bg-accent/10 text-accent">
                              <Leaf className="mr-1 h-3 w-3" />
                              {item.eco}%
                            </Badge>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="w-full gradient-hero"
                            onClick={() => handleMatch(item)}
                          >
                            <ArrowLeftRight className="mr-2 h-4 w-4" />
                            Propose Swap
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Swaps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 card-glow">
              <h2 className="font-heading text-xl font-semibold mb-4">Recent Swaps</h2>
              
              <div className="space-y-3">
                {[
                  { from: "Clay 5kg", to: "Cotton 3kg", with: "Priya K.", points: 50, date: "2 days ago" },
                  { from: "Natural Dye 2L", to: "Bamboo 4kg", with: "Raj M.", points: 75, date: "5 days ago" },
                ].map((swap, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowLeftRight className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {swap.from} ↔ {swap.to}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              with {swap.with} • {swap.date}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-accent/10 text-accent">
                          +{swap.points} pts
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center py-8 border-t border-border"
          >
            <p className="text-muted-foreground italic">
              "Sustainable Exchange, Stronger Community — MingleMakers Swap Zone"
            </p>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SwapBarter;