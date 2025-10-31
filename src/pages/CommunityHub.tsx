// src/pages/CommunityHub.tsx
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

import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  getDoc,
  increment,
} from "firebase/firestore";

const CommunityHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // parse current user from localStorage
  const stored = localStorage.getItem("currentUser");
  const currentUser = stored ? JSON.parse(stored) : null;
const [commentBoxes, setCommentBoxes] = useState<{ [key: string]: boolean }>({});
const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
const [comments, setComments] = useState<{ [key: string]: any[] }>({});
useEffect(() => {
  const unsubscribes: (() => void)[] = [];

  posts.forEach((post) => {
    const commentsRef = collection(db, "posts", post.id, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments((prev) => ({
        ...prev,
        [post.id]: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      }));
    });

    unsubscribes.push(unsubscribe);
  });

  return () => unsubscribes.forEach((unsub) => unsub());
}, [posts]);


// Toggle comment box visibility
const toggleComments = (postId: string) => {
  setCommentBoxes((prev) => ({
    ...prev,
    [postId]: !prev[postId],
  }));
};
const handleDeleteComment = async (postId: string, commentId: string) => {
  try {
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    toast.success("Comment deleted!");
  } catch (err) {
    console.error("Error deleting comment:", err);
    toast.error("Failed to delete comment.");
  }
};

// Handle adding a comment
const handleAddComment = async (postId: string) => {
  const comment = newComments[postId]?.trim();
  if (!comment) return toast.error("Comment cannot be empty!");

  try {
    const storedUser = localStorage.getItem("currentUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const postRef = doc(db, "posts", postId);
    const commentData = {
      author: user?.name || "Anonymous",
      text: comment,
      createdAt: serverTimestamp(),
    };

    // Add to a subcollection for comments
    await addDoc(collection(postRef, "comments"), commentData);

    toast.success("Comment added!");

    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  } catch (err) {
    console.error("Error adding comment:", err);
    toast.error("Failed to add comment.");
  }
};

  // helper to format Firestore timestamp or fallback
  const formatTime = (createdAt: any) => {
    if (!createdAt) return "";
    // Firestore Timestamp has toDate method
    try {
      if (createdAt.toDate) {
        return createdAt.toDate().toLocaleString();
      }
      // if a plain ISO string
      if (typeof createdAt === "string") {
        return new Date(createdAt).toLocaleString();
      }
      return String(createdAt);
    } catch {
      return "";
    }
  };
const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch posts ordered by createdAt desc
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const postList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPosts(postList);

        // fetch users
        const usersRef = collection(db, "users");
        const userSnap = await getDocs(usersRef);
        const userList = userSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(userList);

      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load community data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  const fetchUserLikes = async () => {
    if (!currentUser) return;

    const likesMap: { [key: string]: boolean } = {};

    for (const post of posts) {
      const likeDocRef = doc(db, "posts", post.id, "likes", currentUser.uid);
      const likeDocSnap = await getDoc(likeDocRef);
      if (likeDocSnap.exists()) likesMap[post.id] = true;
    }

    setUserLikes(likesMap);
  };

  if (posts.length > 0) {
    fetchUserLikes();
  }
}, [posts, currentUser]);


  const handleLike = async (postId: string) => {
  try {
    if (!currentUser) {
      toast.error("Please login to like posts.");
      return;
    }

    const postRef = doc(db, "posts", postId);
    const likeRef = doc(collection(postRef, "likes"), currentUser.uid);

    const userLiked = userLikes[postId];

    if (userLiked) {
      // Unlike
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likes: increment(-1) });
      setUserLikes((prev) => ({ ...prev, [postId]: false }));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: (p.likes || 1) - 1 } : p
        )
      );
    } else {
      // Like
      await setDoc(likeRef, {
        userId: currentUser.uid,
        userName: currentUser.name,
        createdAt: serverTimestamp(),
      });
      await updateDoc(postRef, { likes: increment(1) });
      setUserLikes((prev) => ({ ...prev, [postId]: true }));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
        )
      );
    }
  } catch (err) {
    console.error("Error toggling like:", err);
    toast.error("Failed to process like.");
  }
};



  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted!");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post.");
    }
  };

  const joinCluster = (clusterName: string) => {
    toast.success(`Joined ${clusterName}! Welcome to the community.`);
  };

  const createPost = async () => {
    if (!newPost.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const avatar = currentUser?.name
        ? currentUser.name
            .split(" ")
            .map((n: string) => n[0].toUpperCase())
            .slice(0, 2)
            .join("")
        : "AA";

      const docRef = await addDoc(collection(db, "posts"), {
        author: currentUser?.name || "Anonymous",
        authorId: currentUser?.uid || "",
        avatar,
        content: newPost.trim(),
        cluster: currentUser?.cluster || "General",
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
      });

      // fetch the created document (to get server timestamp)
      const snapshot = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
      setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));

      toast.success("Post added successfully!");
      setNewPost("");
    } catch (err) {
      console.error("Error adding post:", err);
      toast.error("Error creating post.");
    } finally {
      setLoading(false);
    }
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
                        <Button className="w-full" onClick={createPost}>
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
  {comments[post.id]?.length || 0}
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

{comments[post.id]?.length > 0 && (
  <div className="mt-2 space-y-2 border-t pt-2">
    {comments[post.id].map((comment) => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const isAuthor = comment.author === currentUser.name;

      return (
        <div
          key={comment.id}
          className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 px-6 rounded-lg"
        >
          <div>
            <p className="text-sm font-semibold">{comment.author}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
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
              {/* Active Clusters */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 card-glow">
                  <h2 className="font-heading text-lg font-semibold mb-4">Active Clusters</h2>
                  <div className="space-y-3">
                    {clusters.map((cluster, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">{cluster.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {cluster.members} members
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{cluster.category}</p>
                        <Button size="sm" variant={cluster.active ? "outline" : "default"} className="w-full" onClick={() => !cluster.active && joinCluster(cluster.name)}>
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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6 card-glow">
                  <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" /> Featured Mentors
                  </h2>
                  <div className="space-y-3">
                    {mentors.map((mentor, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-sm">{mentor.name}</h3>
                            <p className="text-xs text-muted-foreground">{mentor.specialty}</p>
                          </div>
                          <Badge className="bg-accent/10 text-accent text-xs">⭐ {mentor.rating}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{mentor.students} students</p>
                        <Button size="sm" variant="outline" className="w-full">
                          Connect
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Upcoming Workshops */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card className="p-6 card-glow">
                  <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> Upcoming Workshops
                  </h2>
                  <div className="space-y-3">
                    {workshops.map((workshop, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} className="p-3 bg-muted rounded-lg">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center py-8 border-t border-border">
            <p className="text-muted-foreground italic">"Together We Craft, Together We Thrive — MingleMakers Community"</p>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CommunityHub;
