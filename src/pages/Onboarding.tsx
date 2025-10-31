import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  MapPin,
  Briefcase,
  Package,
  Lightbulb,
  LogIn,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import clustersData from "@/data/clusters_mapping.json";

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "artisan";

  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    location: "",
    specialty: "",
    cluster: "",
    subCategory: "",
    supplierType: "",
    materialsNeeded: "",
    digitalLiteracy: "medium",
  });

  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [recommendedMaterials, setRecommendedMaterials] = useState<string[]>([]);

  // Load existing users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("mingleUsers") || "[]");
    setExistingUsers(storedUsers);
  }, []);

  // Auto-fill data if email matches during login
  useEffect(() => {
    if (isLogin && formData.email) {
      const found = existingUsers.find((u) => u.email === formData.email);
      if (found) {
        toast.info("Account found! Enter password to login.");
      }
    }
  }, [isLogin, formData.email, existingUsers]);

  // Handle sub-categories + recommended materials
  useEffect(() => {
    if (role === "artisan" && formData.cluster) {
      const cluster = clustersData.artisanClusters.find(
        (c) => c.id === formData.cluster
      );
      if (cluster) {
        setSubCategories(cluster.subCategories);
        setRecommendedMaterials(cluster.typicalMaterials);
      }
    }
  }, [formData.cluster, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    let users = [...existingUsers];

    if (isLogin) {
      const found = users.find((u) => u.email === formData.email);
      if (!found) {
        toast.error("No account found. Please register first.");
        return;
      }

      if (found.password !== btoa(formData.password)) {
        toast.error("Incorrect password");
        return;
      }

      toast.success(`Welcome back, ${found.name}!`);
      localStorage.setItem("userEmail", found.email);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", found.name);
      navigate(role === "artisan" ? "/portfolio" : "/supplier");
      return;
    }

    // Registration validation
    const requiredFields =
      role === "artisan"
        ? [formData.name, formData.location, formData.cluster]
        : [formData.name, formData.location, formData.supplierType];

    if (requiredFields.some((field) => !field)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (users.some((u) => u.email === formData.email)) {
      toast.error("Email already registered. Try logging in.");
      return;
    }

    const newUser = {
      ...formData,
      password: btoa(formData.password), // encode for demo (not secure)
      role,
    };

    users.push(newUser);
    localStorage.setItem("mingleUsers", JSON.stringify(users));

    toast.success(`Welcome to MingleMakers, ${formData.name}!`);
    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", formData.name);
    navigate(role === "artisan" ? "/portfolio" : "/supplier");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Card className="w-full max-w-md p-8 card-glow animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">
            {isLogin ? "Login to" : "Welcome to"} MingleMakers
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Access your profile and continue your journey"
              : "Let's set up your profile to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border-primary/20"
            />
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Password *
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="border-primary/20 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {!isLogin && (
            <>
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border-primary/20"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="border-primary/20"
                />
              </div>

              {/* Role-specific fields */}
              {role === "artisan" ? (
                <>
                  {/* Cluster */}
                  <div className="space-y-2">
                    <Label htmlFor="cluster" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Craft Cluster *
                    </Label>
                    <Select
                      value={formData.cluster}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          cluster: value,
                          subCategory: "",
                        })
                      }
                    >
                      <SelectTrigger className="border-primary/20">
                        <SelectValue placeholder="Select your craft cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        {clustersData.artisanClusters.map((cluster) => (
                          <SelectItem key={cluster.id} value={cluster.id}>
                            <span className="flex items-center gap-2">
                              <span>{cluster.icon}</span>
                              <span>{cluster.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub-category */}
                  {formData.cluster && subCategories.length > 0 && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="subCategory"
                        className="flex items-center gap-2"
                      >
                        <Package className="h-4 w-4 text-primary" />
                        Sub-Category (Optional)
                      </Label>
                      <Select
                        value={formData.subCategory}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subCategory: value })
                        }
                      >
                        <SelectTrigger className="border-primary/20">
                          <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Materials */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="materialsNeeded"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4 text-primary" />
                      Materials Needed (Optional)
                    </Label>
                    <Input
                      id="materialsNeeded"
                      placeholder="e.g., Cotton yarn, Natural dyes"
                      value={formData.materialsNeeded}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          materialsNeeded: e.target.value,
                        })
                      }
                      className="border-primary/20"
                    />
                    {recommendedMaterials.length > 0 && (
                      <div className="text-xs text-muted-foreground flex items-start gap-1">
                        <Lightbulb className="h-3 w-3 mt-0.5 text-accent" />
                        <span>
                          Typical materials: {recommendedMaterials.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Digital literacy */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="digitalLiteracy"
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4 text-primary" />
                      Digital Comfort Level
                    </Label>
                    <Select
                      value={formData.digitalLiteracy}
                      onValueChange={(value) =>
                        setFormData({ ...formData, digitalLiteracy: value })
                      }
                    >
                      <SelectTrigger className="border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          Beginner - Need help with basics
                        </SelectItem>
                        <SelectItem value="medium">
                          Comfortable - Can use apps
                        </SelectItem>
                        <SelectItem value="high">
                          Advanced - Tech savvy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  {/* Supplier Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="supplierType"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4 text-primary" />
                      Supplier Type *
                    </Label>
                    <Select
                      value={formData.supplierType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, supplierType: value })
                      }
                    >
                      <SelectTrigger className="border-primary/20">
                        <SelectValue placeholder="Select supplier type" />
                      </SelectTrigger>
                      <SelectContent>
                        {clustersData.supplierTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <span className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specialty */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="specialty"
                      className="flex items-center gap-2"
                    >
                      <Briefcase className="h-4 w-4 text-primary" />
                      Main Materials Supplied
                    </Label>
                    <Input
                      id="specialty"
                      placeholder="e.g., Organic Cotton, Natural Dyes, Bamboo"
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({ ...formData, specialty: e.target.value })
                      }
                      className="border-primary/20"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <Button type="submit" size="lg" className="w-full gradient-hero hover-lift">
            {isLogin ? (
              <>
                <LogIn className="mr-2 h-5 w-5" /> Login
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" /> Register & Continue
              </>
            )}
          </Button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isLogin
              ? "New user? Register here"
              : "Already have an account? Login"}
          </Button>
        </div>

        <div className="text-center mt-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
