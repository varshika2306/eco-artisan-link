import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { 
  Play, Pause, Sparkles, Award, Leaf, Users, Plus, 
  Clock, Trophy, Target, Copy, Download, Share2, 
  Edit, Trash2, TrendingUp, Heart, Camera, Mic, Briefcase
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import artisanProfile from "@/assets/artisan-profile.jpg";
import clustersData from "@/data/clusters_mapping.json";

const ArtisanPortfolio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedStory, setGeneratedStory] = useState("");
  const [storyInput, setStoryInput] = useState("");
  const [language, setLanguage] = useState("english");
  const [isGenerating, setIsGenerating] = useState(false);
  const [milestones, setMilestones] = useState([
    { year: "2018", title: "Started Pottery", icon: "🏺", description: "Learned traditional techniques" },
    { year: "2020", title: "First Exhibition", icon: "🎨", description: "Showcased 50+ pieces" },
    { year: "2022", title: "Eco Certified", icon: "🌿", description: "100% sustainable practices" },
    { year: "2024", title: "Community Leader", icon: "👥", description: "Mentoring 12 artisans" },
  ]);
  const [crafts, setCrafts] = useState([
    { id: 1, name: "Terracotta Pottery", tags: ["Handmade", "Eco-friendly", "Traditional"], image: null },
    { id: 2, name: "Clay Vessels", tags: ["Sustainable", "Artisan", "Heritage"], image: null },
    { id: 3, name: "Decorative Items", tags: ["Contemporary", "Organic", "Handcrafted"], image: null },
  ]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  
  const userName = localStorage.getItem("userName") || "Artisan";
  const userLocation = localStorage.getItem("userLocation") || "India";
  const userSpecialty = localStorage.getItem("userSpecialty") || "Traditional Crafts";
  const userCluster = localStorage.getItem("userCluster") || "";
  const userSubCategory = localStorage.getItem("userSubCategory") || "";
  
  const clusterInfo = clustersData.artisanClusters.find(c => c.id === userCluster);

  const badges = [
    { name: "Eco Warrior", icon: "🌿", progress: 100, unlocked: true },
    { name: "Master Craftsman", icon: "🏆", progress: 100, unlocked: true },
    { name: "Community Mentor", icon: "👥", progress: 85, unlocked: false },
    { name: "Innovation Leader", icon: "💡", progress: 60, unlocked: false },
  ];

  const followersData = [
    { month: "Jan", followers: 120 },
    { month: "Feb", followers: 180 },
    { month: "Mar", followers: 250 },
    { month: "Apr", followers: 324 },
  ];

  const craftPopularity = [
    { craft: "Pottery", sales: 45 },
    { craft: "Vessels", sales: 38 },
    { craft: "Decor", sales: 52 },
  ];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const interval = setInterval(() => {
        if (audioRef.current) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const generateStory = async () => {
    setIsGenerating(true);
    
    // Mock Gemini API call
    setTimeout(() => {
      const stories = [
        `From the heart of ${userLocation}, ${userName} crafts timeless pottery that tells stories of generations. Each piece is lovingly shaped by hands that have mastered the ancient art of ${userSpecialty}, blending tradition with contemporary design. Their work embodies sustainability, using 100% natural materials sourced from local cooperatives.`,
        `Meet ${userName}, a visionary artisan transforming ${userSpecialty} into modern art. Based in ${userLocation}, their journey spans over a decade of dedication to preserving cultural heritage while innovating with eco-friendly techniques. Every creation reflects a deep connection to the earth and community.`,
        `${userName}'s story is one of passion and perseverance. Working with ${userSpecialty} in ${userLocation}, they have built a reputation for exceptional craftsmanship. Their studio has become a hub for sustainable practices, mentoring new artisans and fostering a cooperative spirit that strengthens the entire community.`
      ];
      
      const randomStory = stories[Math.floor(Math.random() * stories.length)];
      setGeneratedStory(randomStory);
      setIsGenerating(false);
      
      toast.success("Story generated successfully!");
    }, 2000);
  };

  const copyStory = () => {
    navigator.clipboard.writeText(generatedStory);
    toast.success("Story copied to clipboard!");
  };

  const handleBadgeClick = (badge: any) => {
    if (badge.progress === 100 && !badge.unlocked) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success(`Badge unlocked: ${badge.name}!`);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8 bg-background">
          {/* Sticky Top Bar */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4 rounded-lg flex items-center justify-between"
          >
            <h1 className="font-heading text-2xl font-bold">My Portfolio</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit Profile</Button>
              <Button variant="outline" size="sm">Dark Mode</Button>
            </div>
          </motion.div>

          {/* Hero Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 p-8 card-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-pulse-glow" />
            
            <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-primary/30 animate-pulse-glow">
                  <img 
                    src={artisanProfile} 
                    alt="Artisan profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isPlaying && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl"
                  />
                )}
              </motion.div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="font-heading text-4xl font-bold mb-2">{userName}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 text-lg">
                    <span>{userLocation}</span>
                    <span className="text-primary">•</span>
                    <span>{userSpecialty}</span>
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {clusterInfo && (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {clusterInfo.icon} {clusterInfo.name}
                      </Badge>
                    </motion.div>
                  )}
                  {userSubCategory && (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge variant="secondary">
                        {userSubCategory}
                      </Badge>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Award className="mr-1 h-3 w-3" />
                      Master Artisan
                    </Badge>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                      <Leaf className="mr-1 h-3 w-3" />
                      Eco-Certified
                    </Badge>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                      <Users className="mr-1 h-3 w-3" />
                      324 Followers
                    </Badge>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Heart className="mr-1 h-3 w-3" />
                      4 Active Clusters
                    </Badge>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Voice Storytelling Player */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading text-xl font-semibold">My Craft Story</h2>
                  <p className="text-sm text-muted-foreground">The journey of tradition and innovation</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlay}
                  className="hover-lift"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
              </div>
              
              <div className="relative h-24 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg flex items-center px-4 overflow-hidden">
                {isPlaying && (
                  <motion.div
                    animate={{ x: [-1000, 1000] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  />
                )}
                <div className="flex-1 h-2 bg-primary/20 rounded-full overflow-hidden relative z-10">
                  <motion.div 
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed italic">
                "From the clay of my village to the hands of collectors worldwide, 
                my journey as a potter spans three generations of tradition..."
              </p>
              
              <audio ref={audioRef} src="/audio/sample_story.mp3" />
            </Card>
          </motion.div>

          {/* Smart Craft Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">My Crafts</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gradient-hero hover-lift">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Craft
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Craft</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Craft Name</Label>
                      <Input placeholder="Enter craft name" />
                    </div>
                    <div>
                      <Label>Upload Image</Label>
                      <Input type="file" accept="image/*" />
                    </div>
                    <Button className="w-full">Add Craft</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {crafts.map((craft, index) => (
                <motion.div
                  key={craft.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="p-4 card-glow hover-lift cursor-pointer group overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                      <Sparkles className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                      <motion.div
                        whileHover={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4"
                      >
                        <p className="text-white text-sm font-medium">View Details</p>
                      </motion.div>
                    </div>
                    <h3 className="font-semibold mb-2">{craft.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {craft.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">My Journey</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Milestone</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Year</Label>
                      <Input type="number" placeholder="2024" />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input placeholder="Achievement title" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Describe your achievement" />
                    </div>
                    <Button className="w-full">Add Milestone</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative space-y-6 pl-8 border-l-2 border-primary/30">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-11 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-lg shadow-lg">
                    {milestone.icon}
                  </div>
                  <Card className="p-4 card-glow hover-lift">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{milestone.year}</Badge>
                          <h3 className="font-semibold">{milestone.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Generate My Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 card-glow">
              <h2 className="font-heading text-xl font-semibold mb-4">Generate My Story with AI</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Add Context (Optional)</Label>
                  <Textarea
                    placeholder="Share recent updates, achievements, or what makes your work unique..."
                    value={storyInput}
                    onChange={(e) => setStoryInput(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="gradient-hero hover-lift mt-6"
                    onClick={generateStory}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Story
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {generatedStory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <Card className="p-4 bg-primary/5 border-primary/20">
                        <p className="text-sm leading-relaxed">{generatedStory}</p>
                      </Card>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyStory}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Recognition & Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="font-heading text-2xl font-bold">Recognition & Badges</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleBadgeClick(badge)}
                  className="cursor-pointer"
                >
                  <Card className="p-6 text-center card-glow hover-lift">
                    <div className={`text-5xl mb-3 ${badge.unlocked ? 'animate-pulse-glow' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{badge.name}</h3>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${badge.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{badge.progress}% Complete</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Insights Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Quick Insights</h2>
              <Button variant="outline" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 card-glow">
                <h3 className="font-semibold mb-4">Followers Growth</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={followersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="followers" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 card-glow">
                <h3 className="font-semibold mb-4">Craft Popularity</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={craftPopularity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="craft" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </motion.div>

          {/* Floating Action Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full w-16 h-16 shadow-2xl gradient-hero hover-lift">
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quick Actions</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="mr-2 h-4 w-4" />
                    Add Craft
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mic className="mr-2 h-4 w-4" />
                    Record Voice Story
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Story
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Footer Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center py-8 border-t border-border"
          >
            <p className="text-muted-foreground italic">
              "Every Artisan Has a Story — MingleMakers Brings It to Life."
            </p>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ArtisanPortfolio;