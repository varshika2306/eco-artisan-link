import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Award,
  Calendar,
  Plus,
  Search,
  TrendingUp,
  Trash
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  cluster: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

const CommunityHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  // parse current user from localStorage
  const stored = localStorage.getItem("currentUser");
  const currentUser = stored ? JSON.parse(stored) : null;
  
  const [commentBoxes, setCommentBoxes] = useState<{ [key: string]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});

  // Load posts from localStorage
  useEffect(() => {
    const storedPosts = localStorage.getItem("community_posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      // Initialize with sample posts
      const samplePosts: Post[] = [
        {
          id: "1",
          author: "Priya Sharma",
          authorId: "sample1",
          avatar: "PS",
          content: "Just finished my new handloom collection! Can't wait to share it with everyone. 🎨",
          cluster: "Textiles",
          likes: 12,
          comments: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          author: "Rajesh Kumar",
          authorId: "sample2",
          avatar: "RK",
          content: "Looking for collaboration on eco-friendly packaging solutions. Any suppliers interested?",
          cluster: "Pottery",
          likes: 8,
          comments: [],
          createdAt: new Date().toISOString(),
        },
      ];
      setPosts(samplePosts);
      localStorage.setItem("community_posts", JSON.stringify(samplePosts));
    }

    // Load user likes
    if (currentUser?.uid) {
      const storedLikes = localStorage.getItem(`likes_${currentUser.uid}`);
      if (storedLikes) {
        setUserLikes(JSON.parse(storedLikes));
      }
    }
  }, [currentUser?.uid]);

  // Save posts to localStorage whenever they change
  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("community_posts", JSON.stringify(updatedPosts));
  };

  const formatTime = (createdAt: string) => {
    if (!createdAt) return "";
    try {
      return new Date(createdAt).toLocaleString();
    } catch {
      return "";
    }
  };

  const toggleComments = (postId: string) => {
    setCommentBoxes((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter((c) => c.id !== commentId),
        };
      }
      return post;
    });
    savePosts(updatedPosts);
    toast.success("Comment deleted!");
  };

  const handleAddComment = (postId: string) => {
    const comment = newComments[postId]?.trim();
    if (!comment) return toast.error("Comment cannot be empty!");

    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser?.name || "Anonymous",
      text: comment,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });

    savePosts(updatedPosts);
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Comment added!");
  };

  const handleLike = (postId: string) => {
    if (!currentUser) {
      toast.error("Please login to like posts.");
      return;
    }

    const alreadyLiked = userLikes[postId];
    const updatedLikes = { ...userLikes, [postId]: !alreadyLiked };
    setUserLikes(updatedLikes);
    localStorage.setItem(`likes_${currentUser.uid}`, JSON.stringify(updatedLikes));

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const handleDelete = (postId: string) => {
    const updatedPosts = posts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    toast.success("Post deleted!");
  };

  const joinCluster = (clusterName: string) => {
    toast.success(`Joined ${clusterName}! Welcome to the community.`);
  };

  const createPost = () => {
    if (!newPost.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }
    setLoading(true);

    const avatar = currentUser?.name
      ? currentUser.name
          .split(" ")
          .map((n: string) => n[0].toUpperCase())
          .slice(0, 2)
          .join("")
      : "AA";

    const newPostData: Post = {
      id: Date.now().toString(),
      author: currentUser?.name || "Anonymous",
      authorId: currentUser?.uid || "",
      avatar,
      content: newPost.trim(),
      cluster: currentUser?.cluster || "General",
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    savePosts([newPostData, ...posts]);
    toast.success("Post added successfully!");
    setNewPost("");
    setLoading(false);
  };

  // sample static sidebar data
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl font-bold mb-2">Community Hub</h1>
            <p className="text-muted-foreground">Connect, collaborate, and grow with fellow artisans</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search posts, artisans, or clusters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-4 card-glow">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full gradient-hero hover-lift">
                        <Plus className="mr-2 h-4 w-4" /> Share Your Story
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea placeholder="What's on your mind?" rows={5} value={newPost} onChange={(e) => setNewPost(e.target.value)} />
                        <Button className="w-full" onClick={createPost} disabled={loading}>
                          {loading ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </Card>
              </motion.div>

              {/* Posts Feed */}
              <AnimatePresence>
                {posts
                  .filter((p) => {
                    if (!searchTerm.trim()) return true;
                    const s = searchTerm.toLowerCase();
                    return (
                      (p.content || "").toLowerCase().includes(s) ||
                      (p.author || "").toLowerCase().includes(s) ||
                      (p.cluster || "").toLowerCase().includes(s)
                    );
                  })
                  .map((post, index) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                      <Card className="p-6 card-glow hover-lift">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">{post.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold">{post.author}</h3>
                              <span className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</span>
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
                            className="flex items-center gap-2"
                          >
                            {userLikes[post.id] ? (
                              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                            ) : (
                              <Heart className="h-5 w-5 text-gray-400" />
                            )}
                            <span>{post.likes || 0}</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(post.id)}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {post.comments?.length || 0}
                          </Button>

                          <Button variant="ghost" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>

                          {currentUser?.uid === post.authorId && (
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-red-500">
                              Delete
                            </Button>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {commentBoxes[post.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 space-y-3"
                            >
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Write a comment..."
                                  value={newComments[post.id] || ""}
                                  onChange={(e) =>
                                    setNewComments((prev) => ({ ...prev, [post.id]: e.target.value }))
                                  }
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddComment(post.id)}
                                >
                                  Send
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {post.comments?.length > 0 && (
                          <div className="mt-2 space-y-2 border-t pt-2">
                            {post.comments.map((comment) => {
                              const isAuthor = comment.author === currentUser?.name;

                              return (
                                <div
                                  key={comment.id}
                                  className="flex justify-between items-center bg-muted p-2 px-6 rounded-lg"
                                >
                                  <div>
                                    <p className="text-sm font-semibold">{comment.author}</p>
                                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                                  </div>

                                  {isAuthor && (
                                    <button
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                      className="text-red-500 text-xs hover:underline"
                                    >
                                      <Trash className="inline-block mr-1 h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mentorship Section */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 card-glow">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-lg font-semibold">Top Mentors</h2>
                  </div>
                  <div className="space-y-4">
                    {mentors.map((mentor, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <Avatar>
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            {mentor.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{mentor.name}</p>
                          <p className="text-xs text-muted-foreground">{mentor.specialty}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ⭐ {mentor.rating}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Workshops Section */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6 card-glow">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-lg font-semibold">Upcoming Workshops</h2>
                  </div>
                  <div className="space-y-4">
                    {workshops.map((workshop, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <h3 className="font-medium text-sm mb-1">{workshop.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {workshop.date} • {workshop.time}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">by {workshop.instructor}</span>
                          <Badge variant="outline" className="text-xs">{workshop.spots} spots</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Clusters Section */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card className="p-6 card-glow">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-lg font-semibold">Active Clusters</h2>
                  </div>
                  <div className="space-y-3">
                    {clusters.map((cluster, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium text-sm">{cluster.name}</p>
                          <p className="text-xs text-muted-foreground">{cluster.members} members</p>
                        </div>
                        <Button
                          size="sm"
                          variant={cluster.active ? "default" : "outline"}
                          onClick={() => joinCluster(cluster.name)}
                        >
                          {cluster.active ? "Joined" : "Join"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Trending Topics */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card className="p-6 card-glow">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-lg font-semibold">Trending</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["#EcoFriendly", "#Handmade", "#TraditionalCrafts", "#SustainableFashion", "#ArtisanMade", "#LocalCrafts"].map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CommunityHub;
