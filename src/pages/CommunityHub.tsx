import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, Heart, MessageCircle, Share2, Award, Calendar, Video, Plus, Search, TrendingUp } from "lucide-react";

const CommunityHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const posts = [
    {
      id: 1,
      author: "Priya Sharma",
      avatar: "PS",
      time: "2 hours ago",
      content: "Just completed my first sustainable pottery collection! 🏺 Using 100% natural clay and eco-friendly glazes. So grateful for the mentorship from @RajMaster!",
      image: null,
      likes: 45,
      comments: 12,
      cluster: "Pottery Masters"
    },
    {
      id: 2,
      author: "Raj Kumar",
      avatar: "RK",
      time: "5 hours ago",
      content: "Excited to announce our new cooperative cluster for organic textile artisans! We're sourcing materials together and reducing costs by 30%. DM to join! 🌿",
      image: null,
      likes: 78,
      comments: 23,
      cluster: "Textile Co-op"
    },
    {
      id: 3,
      author: "Anjali Patel",
      avatar: "AP",
      time: "1 day ago",
      content: "Today's workshop on natural dyeing techniques was amazing! Thanks to all who attended. Next session: Block printing basics 🎨",
      image: null,
      likes: 92,
      comments: 34,
      cluster: "Dye Masters"
    },
  ];

  const mentors = [
    { name: "Rajesh Master", specialty: "Traditional Pottery", students: 24, rating: 4.9 },
    { name: "Lakshmi Devi", specialty: "Textile Weaving", students: 31, rating: 5.0 },
    { name: "Vikram Singh", specialty: "Wood Carving", students: 18, rating: 4.8 },
  ];

  const workshops = [
    { title: "Sustainable Dyeing Techniques", date: "May 15, 2024", time: "10:00 AM", instructor: "Anjali P.", spots: 8 },
    { title: "Advanced Pottery Glazing", date: "May 20, 2024", time: "2:00 PM", instructor: "Raj K.", spots: 5 },
    { title: "Digital Marketing for Artisans", date: "May 25, 2024", time: "4:00 PM", instructor: "Priya S.", spots: 12 },
  ];

  const clusters = [
    { name: "Eco Crafters", members: 45, category: "Mixed Arts", active: true },
    { name: "Heritage Weavers", members: 32, category: "Textiles", active: true },
    { name: "Clay Collective", members: 28, category: "Pottery", active: false },
  ];

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
      toast.success("Post liked!");
    }
  };

  const joinCluster = (clusterName: string) => {
    toast.success(`Joined ${clusterName}! Welcome to the community.`);
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
            <h1 className="font-heading text-3xl font-bold mb-2">Community Hub</h1>
            <p className="text-muted-foreground">
              Connect, collaborate, and grow with fellow artisans
            </p>
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
                placeholder="Search posts, artisans, or clusters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4 card-glow">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full gradient-hero hover-lift">
                        <Plus className="mr-2 h-4 w-4" />
                        Share Your Story
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea placeholder="What's on your mind?" rows={5} />
                        <Button className="w-full">Post</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </Card>
              </motion.div>

              {/* Posts Feed */}
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 card-glow hover-lift">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {post.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold">{post.author}</h3>
                            <span className="text-xs text-muted-foreground">{post.time}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {post.cluster}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                      <div className="flex items-center gap-4 pt-4 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={likedPosts.includes(post.id) ? "text-primary" : ""}
                        >
                          <Heart className={`mr-2 h-4 w-4 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                          {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Clusters */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 card-glow">
                  <h2 className="font-heading text-lg font-semibold mb-4">Active Clusters</h2>
                  <div className="space-y-3">
                    {clusters.map((cluster, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">{cluster.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {cluster.members} members
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{cluster.category}</p>
                        <Button
                          size="sm"
                          variant={cluster.active ? "outline" : "default"}
                          className="w-full"
                          onClick={() => !cluster.active && joinCluster(cluster.name)}
                        >
                          {cluster.active ? (
                            <>
                              <Users className="mr-2 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            "Join Cluster"
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Mentor Connect */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 card-glow">
                  <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Featured Mentors
                  </h2>
                  <div className="space-y-3">
                    {mentors.map((mentor, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-sm">{mentor.name}</h3>
                            <p className="text-xs text-muted-foreground">{mentor.specialty}</p>
                          </div>
                          <Badge className="bg-accent/10 text-accent text-xs">
                            ⭐ {mentor.rating}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {mentor.students} students
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Connect
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Upcoming Workshops */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6 card-glow">
                  <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Workshops
                  </h2>
                  <div className="space-y-3">
                    {workshops.map((workshop, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-muted rounded-lg"
                      >
                        <h3 className="font-medium text-sm mb-2">{workshop.title}</h3>
                        <div className="text-xs text-muted-foreground space-y-1 mb-2">
                          <p>📅 {workshop.date}</p>
                          <p>⏰ {workshop.time}</p>
                          <p>👨‍🏫 {workshop.instructor}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {workshop.spots} spots left
                          </Badge>
                          <Button size="sm" variant="default" className="text-xs">
                            Register
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center py-8 border-t border-border"
          >
            <p className="text-muted-foreground italic">
              "Together We Craft, Together We Thrive — MingleMakers Community"
            </p>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CommunityHub;