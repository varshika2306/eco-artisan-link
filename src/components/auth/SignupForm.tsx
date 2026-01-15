import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import clustersData from "@/data/clusters_mapping.json";
import { supabase } from "@/integrations/supabase/client";

const SignupForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "artisan";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    if (value.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&limit=5`
      );
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const locationName = data.display_name || "Unknown Location";

          setFormData({ ...formData, location: locationName });
          toast.success("Location detected!");
        } catch (error) {
          console.error("Error detecting location:", error);
          toast.error("Failed to fetch location details.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to detect location.");
        setLoadingLocation(false);
      }
    );
  };

  const handleSelectSuggestion = (loc: any) => {
    setFormData({ ...formData, location: loc.display_name });
    setLocationSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign up with Lovable Cloud Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: formData.name,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert user role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: role as "artisan" | "supplier",
        });

        if (roleError) {
          console.error("Error inserting role:", roleError);
        }

        // Update profile with additional data
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.name,
          })
          .eq("id", authData.user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }

        // Store additional user data in localStorage for now
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            uid: authData.user.id,
            email: formData.email,
            name: formData.name,
            location: formData.location,
            cluster: formData.cluster || null,
            subCategory: formData.subCategory || null,
            supplierType: formData.supplierType || null,
            specialty: formData.specialty || "",
            materialsNeeded: formData.materialsNeeded || "",
            digitalLiteracy: formData.digitalLiteracy,
            role,
          })
        );

        // Insert cluster selection if artisan
        if (role === "artisan" && formData.cluster) {
          const { error: clusterError } = await supabase
            .from("cluster_selections")
            .insert({
              user_id: authData.user.id,
              cluster_name: formData.cluster,
            });

          if (clusterError) {
            console.error("Error inserting cluster:", clusterError);
          }
        }

        toast.success("Account created successfully!");
        navigate(role === "artisan" ? "/portfolio" : "/supplier");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5 p-6">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Join as a {role === "artisan" ? "Craft Artisan" : "Supplier"}
        </h2>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Create your account and start your journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address *</Label>
            <Input
              type="email"
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <Label>Password *</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create your password (min 6 characters)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-primary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div className="relative">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Input
                name="location"
                value={formData.location}
                onChange={handleLocationChange}
                placeholder="Enter your city"
                autoComplete="off"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={detectUserLocation}
                className="shrink-0"
                disabled={isLoading || loadingLocation}
              >
                {loadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : "Use My Location"}
              </Button>
            </div>

            {locationSuggestions.length > 0 && (
              <div className="absolute bg-background border border-border rounded-lg shadow-md mt-1 max-h-48 overflow-y-auto w-full z-50">
                {locationSuggestions.map((loc) => (
                  <div
                    key={loc.place_id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => handleSelectSuggestion(loc)}
                  >
                    {loc.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role-specific fields */}
          {role === "artisan" ? (
            <>
              {/* Cluster */}
              <div className="space-y-2">
                <Label>Craft Cluster *</Label>
                <Select
                  value={formData.cluster}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cluster: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your cluster" />
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

              {/* Sub-Category */}
              {formData.cluster && subCategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Sub-Category</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subCategory: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
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

              {/* Materials Needed */}
              <div className="space-y-2">
                <Label>Materials Needed (optional)</Label>
                <Input
                  placeholder="e.g., Cotton, Dyes, Bamboo"
                  value={formData.materialsNeeded}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      materialsNeeded: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
                {recommendedMaterials.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Typical materials: {recommendedMaterials.join(", ")}
                  </p>
                )}
              </div>

              {/* Digital Literacy */}
              <div className="space-y-2">
                <Label>Digital Comfort Level</Label>
                <Select
                  value={formData.digitalLiteracy}
                  onValueChange={(value) =>
                    setFormData({ ...formData, digitalLiteracy: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      Beginner - Need help with basics
                    </SelectItem>
                    <SelectItem value="medium">
                      Comfortable - Can use apps
                    </SelectItem>
                    <SelectItem value="high">Advanced - Tech savvy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* Supplier Type */}
              <div className="space-y-2">
                <Label>Supplier Type *</Label>
                <Select
                  value={formData.supplierType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, supplierType: value })
                  }
                  disabled={isLoading}
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

              {/* Materials Supplied */}
              <div className="space-y-2">
                <Label>Main Materials Supplied</Label>
                <Input
                  placeholder="e.g., Organic Cotton, Natural Dyes"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm mt-4 text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={`/login?role=${role}`}
            className="text-primary font-medium hover:underline"
          >
            Login here
          </Link>
        </p>

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="w-full mt-4 text-muted-foreground hover:text-foreground"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Button>
      </Card>
    </div>
  );
};

export default SignupForm;
