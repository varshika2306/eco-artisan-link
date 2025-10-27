import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clustersData from "@/data/clusters_mapping.json";

const ClusterSelection = () => {
  const navigate = useNavigate();
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in first");
        navigate("/signin");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      } else {
        toast.error("User role not found");
        navigate("/role-selection");
      }
    };

    fetchUserRole();
  }, [navigate]);

  const clusters = userRole === "artisan" 
    ? clustersData.artisanClusters 
    : clustersData.supplierTypes;

  const toggleCluster = (clusterId: string) => {
    setSelectedClusters(prev =>
      prev.includes(clusterId)
        ? prev.filter(id => id !== clusterId)
        : [...prev, clusterId]
    );
  };

  const handleContinue = async () => {
    if (selectedClusters.length === 0) {
      toast.error("Please select at least one cluster");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      await updateDoc(doc(db, "users", user.uid), {
        clusters: selectedClusters
      });

      toast.success("Profile setup complete!");
      
      // Navigate to appropriate dashboard
      if (userRole === "artisan") {
        navigate("/portfolio");
      } else {
        navigate("/supplier");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save clusters");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5" />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, hsl(var(--accent) / 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto py-8">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-4"
          >
            <Sparkles className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <h1 className="font-heading text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Select Your {userRole === "artisan" ? "Craft Clusters" : "Supply Categories"}
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose one or more areas that match your expertise
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {selectedClusters.length} selected
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
        >
          <AnimatePresence>
            {clusters.map((cluster, index) => {
              const isSelected = selectedClusters.includes(cluster.id);
              return (
                <motion.div
                  key={cluster.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCluster(cluster.id)}
                  className="cursor-pointer"
                >
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className={`
                      w-full h-full p-6 flex flex-col items-center justify-center gap-3 text-center
                      transition-all duration-300 hover-lift
                      ${isSelected 
                        ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg border-2 border-primary' 
                        : 'bg-background/50 backdrop-blur-sm hover:bg-accent/10 border-2 border-primary/20'
                      }
                    `}
                  >
                    <motion.div
                      animate={isSelected ? { 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ 
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                      className="text-4xl"
                    >
                      {cluster.icon}
                    </motion.div>
                    
                    <span className="text-sm font-medium leading-tight">
                      {cluster.name}
                    </span>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute top-2 right-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Badge>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={loading || selectedClusters.length === 0}
            className="gradient-hero hover-lift shadow-2xl px-12 py-6 text-lg group"
          >
            {loading ? "Saving..." : "Continue to Dashboard"}
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ClusterSelection;
