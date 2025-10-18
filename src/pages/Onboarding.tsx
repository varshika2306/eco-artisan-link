import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, User, MapPin, Briefcase } from "lucide-react";

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "artisan";
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    specialty: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.specialty) {
      toast.error("Please fill in all fields");
      return;
    }

    // Store user data in localStorage (in production, this would be in a database)
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", formData.name);
    localStorage.setItem("userLocation", formData.location);
    localStorage.setItem("userSpecialty", formData.specialty);

    toast.success(`Welcome to MingleMakers, ${formData.name}!`);
    
    // Navigate to appropriate portal
    if (role === "artisan") {
      navigate("/portfolio");
    } else {
      navigate("/supplier");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Card className="w-full max-w-md p-8 card-glow animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">
            Welcome, {role === "artisan" ? "Artisan" : "Supplier"}!
          </h1>
          <p className="text-muted-foreground">
            Let's set up your profile to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              {role === "artisan" ? "Craft Specialty" : "Materials Supplied"}
            </Label>
            <Input
              id="specialty"
              placeholder={role === "artisan" ? "e.g., Pottery, Textiles" : "e.g., Organic Cotton, Clay"}
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="border-primary/20"
            />
          </div>

          <Button type="submit" size="lg" className="w-full gradient-hero hover-lift">
            Complete Setup
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <div className="mt-6 text-center">
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
