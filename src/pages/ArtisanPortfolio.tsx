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
import { supabase } from "@/integrations/supabase/client";
import { 
  Play, Pause, Sparkles, Award, Leaf, Users, Plus, 
  Clock, Trophy, Target, Copy, Download, Share2, 
  Edit, Trash2, TrendingUp, Heart, Camera, Mic, Briefcase
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import artisanProfile from "@/assets/artisan-profile.jpg";
import clustersData from "@/data/clusters_mapping.json";
import { useNavigate } from "react-router-dom";

interface Craft {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
}

const ArtisanPortfolio = () => {
  const [crafts, setCrafts] = useState<Craft[]>([]);
  const [newCraftName, setNewCraftName] = useState("");
  const [newCraftImage, setNewCraftImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  // Get user from localStorage or Supabase session
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const storedUser = localStorage.getItem("currentUser");
        const userData = storedUser ? JSON.parse(storedUser) : { uid: user.id, email: user.email };
        setCurrentUser(userData);
      }
    };
    checkAuth();
  }, []);

  // Load crafts from localStorage
  useEffect(() => {
    if (!currentUser?.email) return;
    const storedCrafts = localStorage.getItem(`crafts_${currentUser.email}`);
    if (storedCrafts) {
      setCrafts(JSON.parse(storedCrafts));
    }
  }, [currentUser]);

  // Handle Add Craft (localStorage version)
  const handleAddCraft = async () => {
    if (!newCraftName || !newCraftImage) {
      toast.error("Please provide both name and image!");
      return;
    }

    try {
      setUploading(true);

      // Convert image to base64 for localStorage storage
      const reader = new FileReader();
      reader.onload = () => {
        const newCraft: Craft = {
          id: Date.now().toString(),
          name: newCraftName,
          imageUrl: reader.result as string,
          tags: tags.length > 0 ? tags : ["Handmade"],
        };

        const updatedCrafts = [...crafts, newCraft];
        setCrafts(updatedCrafts);
        
        if (currentUser?.email) {
          localStorage.setItem(`crafts_${currentUser.email}`, JSON.stringify(updatedCrafts));
        }
        
        toast.success("Craft added successfully!");
        setNewCraftName("");
        setNewCraftImage(null);
        setTags([]);
        setUploading(false);
      };
      reader.readAsDataURL(newCraftImage);
    } catch (err) {
      console.error("Error adding craft:", err);
      toast.error("Failed to add craft!");
      setUploading(false);
    }
  };

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
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName = user?.name || "Artisan";
  const userLocation = user?.location || "India";
  const userSpecialty = user?.specialty || "Traditional Crafts";
  const userCluster = user?.cluster || "";
  const userSubCategory = user?.subCategory || "";
  const userImage = user?.profilePic || artisanProfile;
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

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
              <Button variant="outline" size="sm" onClick={() => navigate("/editprofile")}>Edit Profile</Button>
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
                    src={userImage} 
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

            <Card className="p-6 card-glow ">
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


            <Card className="p-6 card-glow ">
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
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

              {/* Waveform Visualization */}
              <div 
                ref={waveformRef}
                className="h-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden relative"
              >
                <div className="flex items-center gap-1 h-full px-4">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary/60 rounded-full"
                      animate={{
                        height: isPlaying ? [20, Math.random() * 60 + 20, 20] : 20,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: isPlaying ? Infinity : 0,
                        delay: i * 0.02,
                      }}
                    />
                  ))}
                </div>
                
                {/* Progress Overlay */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-primary/20"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{Math.floor(progress / 100 * 180)}s</span>
                <span>3:00</span>
              </div>
            </Card>
          </motion.div>

          {/* Craft Gallery with Add Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 card-glow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-semibold">My Crafts</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gradient-hero hover-lift">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Craft
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Craft</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Craft Name</Label>
                        <Input 
                          placeholder="e.g., Handwoven Basket"
                          value={newCraftName}
                          onChange={(e) => setNewCraftName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Upload Image</Label>
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setNewCraftImage(e.target.files?.[0] || null)}
                        />
                      </div>
                      <div>
                        <Label>Tags</Label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Add tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          />
                          <Button type="button" variant="outline" onClick={handleAddTag}>Add</Button>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleAddCraft}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Save Craft"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crafts.map((craft, index) => (
                  <motion.div
                    key={craft.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="aspect-square">
                      {craft.imageUrl ? (
                        <img 
                          src={craft.imageUrl} 
                          alt={craft.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Camera className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-semibold text-lg mb-2">{craft.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {craft.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {crafts.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No crafts added yet. Click "Add Craft" to get started!</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Milestones Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 card-glow">
              <h2 className="font-heading text-xl font-semibold mb-6">My Journey</h2>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary" />
                
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="relative pl-16"
                    >
                      <div className="absolute left-3 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm">
                        {milestone.icon}
                      </div>
                      
                      <Card className="p-4 hover-lift">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <Badge variant="outline">{milestone.year}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Analytics Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 card-glow">
                <h2 className="font-heading text-xl font-semibold mb-4">Followers Growth</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={followersData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="followers" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 card-glow">
                <h2 className="font-heading text-xl font-semibold mb-4">Craft Popularity</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={craftPopularity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="craft" className="text-xs" />
                    <YAxis className="text-xs" />
                    <RechartsTooltip />
                    <Bar 
                      dataKey="sales" 
                      fill="hsl(var(--accent))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Gamification Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 card-glow">
              <h2 className="font-heading text-xl font-semibold mb-6">Achievements</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBadgeClick(badge)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      badge.unlocked 
                        ? "border-primary bg-primary/5" 
                        : "border-muted bg-muted/20"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className={`font-semibold text-sm ${!badge.unlocked && "text-muted-foreground"}`}>
                        {badge.name}
                      </h3>
                      
                      {!badge.unlocked && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${badge.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{badge.progress}%</span>
                        </div>
                      )}
                      
                      {badge.unlocked && (
                        <Badge className="mt-2 bg-primary/20 text-primary">
                          <Trophy className="mr-1 h-3 w-3" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ArtisanPortfolio;
