import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowRight,
  User,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  Package,
} from "lucide-react";
import clustersData from "@/data/clusters_mapping.json";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "artisan";
  const [isLogin, setIsLogin] = useState(true);

  // Registration data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    specialty: "",
    cluster: "",
    subCategory: "",
    supplierType: "",
  });

  // Login data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [subCategories, setSubCategories] = useState<string[]>([]);

  useEffect(() => {
    if (role === "artisan" && formData.cluster) {
      const cluster = clustersData.artisanClusters.find(
        (c) => c.id === formData.cluster
      );
      if (cluster) setSubCategories(cluster.subCategories);
    }
  }, [formData.cluster, role]);

  // Registration Handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("userPassword", formData.password);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", formData.name);
    localStorage.setItem("userLocation", formData.location);
    localStorage.setItem("userCluster", formData.cluster);

    toast.success(`Welcome to MingleMakers, ${formData.name}!`);
    if (role === "artisan") navigate("/portfolio");
    else navigate("/supplier");
  };

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");
    const savedRole = localStorage.getItem("userRole");

    if (
      loginData.email === savedEmail &&
      loginData.password === savedPassword
    ) {
      toast.success("Login successful!");
      if (savedRole === "artisan") navigate("/portfolio");
      else navigate("/supplier");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Card className="w-full max-w-md p-8 card-glow animate-scale-in">
        {/* Tab Switch */}
        <div className="flex justify-around mb-8">
          <Button
            variant={isLogin ? "default" : "outline"}
            onClick={() => setIsLogin(true)}
            className={`w-1/2 rounded-r-none ${
              isLogin ? "bg-primary text-white" : "border-primary/30"
            }`}
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "default" : "outline"}
            onClick={() => setIsLogin(false)}
            className={`w-1/2 rounded-l-none ${
              !isLogin ? "bg-primary text-white" : "border-primary/30"
            }`}
          >
            Register
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Login Form */}
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Welcome Back 👋
              </h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gradient-hero">
                  Login
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Registration Form */}
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Register as {role === "artisan" ? "Artisan" : "Supplier"}
              </h2>
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                  </Label>
                  <Input
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                {/* Role specific */}
                {role === "artisan" ? (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Craft Cluster
                    </Label>
                    <Select
                      value={formData.cluster}
                      onValueChange={(v) =>
                        setFormData({ ...formData, cluster: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your craft cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        {clustersData.artisanClusters.map((cluster) => (
                          <SelectItem key={cluster.id} value={cluster.id}>
                            {cluster.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Supplier Type
                    </Label>
                    <Select
                      value={formData.supplierType}
                      onValueChange={(v) =>
                        setFormData({ ...formData, supplierType: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier type" />
                      </SelectTrigger>
                      <SelectContent>
                        {clustersData.supplierTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-hero hover-lift"
                >
                  Complete Setup
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default AuthForm;
