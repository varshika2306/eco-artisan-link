import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Play, Sparkles, Award, Leaf, Users } from "lucide-react";
import artisanProfile from "@/assets/artisan-profile.jpg";

const ArtisanPortfolio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const userName = localStorage.getItem("userName") || "Artisan";
  const userLocation = localStorage.getItem("userLocation") || "India";
  const userSpecialty = localStorage.getItem("userSpecialty") || "Traditional Crafts";

  const crafts = [
    { name: "Terracotta Pottery", tag: "Handmade", eco: "95%" },
    { name: "Clay Vessels", tag: "Traditional", eco: "98%" },
    { name: "Decorative Items", tag: "Contemporary", eco: "92%" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Profile Header */}
          <div className="card-glow p-6 md:p-8 rounded-2xl bg-card animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary/20">
                <img 
                  src={artisanProfile} 
                  alt="Artisan profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="font-heading text-3xl font-bold mb-2">{userName}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <span>{userLocation}</span>
                    <span className="text-primary">•</span>
                    <span>{userSpecialty}</span>
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    <Award className="mr-1 h-3 w-3" />
                    Master Artisan
                  </Badge>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                    <Leaf className="mr-1 h-3 w-3" />
                    Eco-Certified
                  </Badge>
                  <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                    <Users className="mr-1 h-3 w-3" />
                    324 Followers
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Story Player */}
          <Card className="p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold">My Craft Story</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover-lift"
              >
                <Play className={`h-4 w-4 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying ? "Pause Story" : "Play Story"}
              </Button>
            </div>
            
            <div className="h-20 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg flex items-center px-4">
              <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-primary transition-all duration-300 ${isPlaying ? 'w-3/4' : 'w-0'}`}
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              "From the clay of my village to the hands of collectors worldwide, 
              my journey as a potter spans three generations of tradition..."
            </p>
          </Card>

          {/* Craft Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">My Crafts</h2>
              <Button className="gradient-hero hover-lift">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Story
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {crafts.map((craft, index) => (
                <Card 
                  key={index} 
                  className="p-4 card-glow hover-lift cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl mb-4 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold mb-2">{craft.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="secondary">{craft.tag}</Badge>
                    <span className="text-accent font-medium flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      {craft.eco}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-6 text-center card-glow">
              <div className="text-3xl font-bold text-primary mb-1">127</div>
              <div className="text-sm text-muted-foreground">Crafts Created</div>
            </Card>
            <Card className="p-6 text-center card-glow">
              <div className="text-3xl font-bold text-secondary mb-1">89%</div>
              <div className="text-sm text-muted-foreground">Sustainability Score</div>
            </Card>
            <Card className="p-6 text-center card-glow">
              <div className="text-3xl font-bold text-accent mb-1">12</div>
              <div className="text-sm text-muted-foreground">Active Collaborations</div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ArtisanPortfolio;
