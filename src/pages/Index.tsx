import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Package, Network } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Collaboration Platform</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MingleMakers
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Connecting Artisans and Suppliers across India through sustainable collaboration, 
              AI storytelling, and community-driven innovation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register?role=artisan">
                <Button size="lg" className="gradient-hero text-lg px-8 py-6 hover-lift">
                  <Users className="mr-2 h-5 w-5" />
                  I'm an Artisan
                </Button>
              </Link>
              
              <Link to="/register?role=supplier">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover-lift border-2">
                  <Package className="mr-2 h-5 w-5" />
                  I'm a Supplier
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated Network Connections */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full animate-pulse-glow" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-secondary rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">Why MingleMakers?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering sustainable sourcing through collaboration
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-glow p-8 rounded-2xl bg-card group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-4">AI Storytelling</h3>
              <p className="text-muted-foreground">
                Transform your craft journey into compelling stories with AI-powered narrative generation
              </p>
            </div>
            
            <div className="card-glow p-8 rounded-2xl bg-card group">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Network className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-4">Smart Matching</h3>
              <p className="text-muted-foreground">
                Connect with the right suppliers and artisans through intelligent recommendations
              </p>
            </div>
            
            <div className="card-glow p-8 rounded-2xl bg-card group">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-4">Sustainable Sourcing</h3>
              <p className="text-muted-foreground">
                Track eco-impact, reduce waste, and build a greener supply chain together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-medium">
            Every Artisan Has a Story — MingleMakers Brings It to Life.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
