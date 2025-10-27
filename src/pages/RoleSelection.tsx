import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Palette, Package } from "lucide-react";
import { motion } from "framer-motion";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = async (role: "artisan" | "supplier") => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in first");
        navigate("/signin");
        return;
      }

      await setDoc(doc(db, "users", user.uid), { role }, { merge: true });
      toast.success(`Welcome, ${role}!`);
      navigate("/cluster-selection");
    } catch (error: any) {
      toast.error(error.message || "Failed to save role");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--primary))/0.1] to-[hsl(var(--accent))/0.1]" />
      
      <div className="relative z-10 w-full max-w-6xl">
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
            Choose Your Path
          </h1>
          <p className="text-lg text-muted-foreground">
            Join our community as an artisan or supplier
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Artisan Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -8 }}
            onClick={() => handleRoleSelect("artisan")}
            className="cursor-pointer"
          >
            <Card className="p-8 h-full card-glow hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-[hsl(var(--accent))/0.1] border-2 border-transparent hover:border-accent group">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Palette className="h-12 w-12 text-accent" />
                </div>
              </motion.div>

              <h2 className="font-heading text-3xl font-bold text-center mb-4 group-hover:text-accent transition-colors">
                🧵 Artisan
              </h2>
              
              <p className="text-center text-lg mb-6 text-muted-foreground italic">
                "Artisans craft the story."
              </p>

              <ul className="space-y-3 text-sm">
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-accent mt-1">✓</span>
                  <span>Showcase your handcrafted creations</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-accent mt-1">✓</span>
                  <span>Connect with sustainable suppliers</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-accent mt-1">✓</span>
                  <span>AI-powered storytelling for your craft</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-accent mt-1">✓</span>
                  <span>Join craft clusters and communities</span>
                </motion.li>
              </ul>

              <motion.div
                className="mt-6 text-center text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
              >
                Click to continue as Artisan →
              </motion.div>
            </Card>
          </motion.div>

          {/* Supplier Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -8 }}
            onClick={() => handleRoleSelect("supplier")}
            className="cursor-pointer"
          >
            <Card className="p-8 h-full card-glow hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-[hsl(var(--primary))/0.1] border-2 border-transparent hover:border-primary group">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Package className="h-12 w-12 text-primary" />
                </div>
              </motion.div>

              <h2 className="font-heading text-3xl font-bold text-center mb-4 group-hover:text-primary transition-colors">
                📦 Supplier
              </h2>
              
              <p className="text-center text-lg mb-6 text-muted-foreground italic">
                "Suppliers bring it to the world."
              </p>

              <ul className="space-y-3 text-sm">
                <motion.li 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary mt-1">✓</span>
                  <span>List sustainable materials and products</span>
                </motion.li>
                <motion.li 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary mt-1">✓</span>
                  <span>Smart matching with artisan needs</span>
                </motion.li>
                <motion.li 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary mt-1">✓</span>
                  <span>Track orders and analytics</span>
                </motion.li>
                <motion.li 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary mt-1">✓</span>
                  <span>Make in India certification support</span>
                </motion.li>
              </ul>

              <motion.div
                className="mt-6 text-center text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
              >
                Click to continue as Supplier →
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
