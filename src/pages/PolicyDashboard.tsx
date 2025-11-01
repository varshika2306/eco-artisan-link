import { useState } from "react";
import { ArrowLeft, MapPin, Users, Palette, Flag, Globe, TrendingUp, Leaf, DollarSign, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import policyData from "@/data/policy_schemes.json";

const iconMap = {
  MapPin,
  Users,
  Palette,
  Flag,
  Globe,
};

const colorMap = {
  saffron: "bg-orange-50 border-orange-200 hover:border-orange-300",
  green: "bg-emerald-50 border-emerald-200 hover:border-emerald-300",
  blue: "bg-blue-50 border-blue-200 hover:border-blue-300",
};

const badgeColorMap = {
  saffron: "bg-orange-100 text-orange-700 border-orange-300",
  green: "bg-emerald-100 text-emerald-700 border-emerald-300",
  blue: "bg-blue-100 text-blue-700 border-blue-300",
};

export default function PolicyDashboard() {
  const navigate = useNavigate();
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [showHindi, setShowHindi] = useState(false);

  const handleBackToDashboard = () => {
    const userRole = localStorage.getItem("userRole") || "artisan";
    if (userRole === "supplier") {
      navigate("/supplier");
    } else {
      navigate("/portfolio");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-4xl font-bold text-foreground">
                Policy Alignment Dashboard
              </h1>
              <p className="text-muted-foreground max-w-3xl">
                Connecting Indian government schemes with artisan and supplier activities on MingleMakers — 
                supporting ODOP, SFURTI, AHVY, Make in India, and Digital India missions.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHindi(!showHindi)}
            >
              {showHindi ? "English" : "हिंदी"}
            </Button>
          </div>

          {/* Government Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policyData.schemes.map((scheme) => {
              const Icon = iconMap[scheme.icon as keyof typeof iconMap];
              const isSelected = selectedScheme === scheme.id;
              
              return (
                <Card
                  key={scheme.id}
                  className={`transition-all duration-300 cursor-pointer border-2 ${
                    colorMap[scheme.color as keyof typeof colorMap]
                  } ${isSelected ? "ring-2 ring-primary scale-105" : ""}`}
                  onClick={() => setSelectedScheme(isSelected ? null : scheme.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-3 rounded-lg ${
                        scheme.color === 'saffron' ? 'bg-orange-100' :
                        scheme.color === 'green' ? 'bg-emerald-100' :
                        'bg-blue-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          scheme.color === 'saffron' ? 'text-orange-600' :
                          scheme.color === 'green' ? 'text-emerald-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <Badge
                        variant="outline"
                        className={badgeColorMap[scheme.color as keyof typeof badgeColorMap]}
                      >
                        {scheme.metricsValue}+ {scheme.metricsLabel}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {showHindi ? scheme.nameHindi : scheme.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {scheme.objective}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        MingleMakers Alignment:
                      </h4>
                      <p className="text-sm">{scheme.minglemakersAlignment}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Artisans</p>
                        <p className="text-lg font-bold">{scheme.artisanCount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Suppliers</p>
                        <p className="text-lg font-bold">{scheme.supplierCount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="w-full justify-center">
                      {scheme.impactIndicator}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Impact Analytics Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Impact Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline" className="text-xs">
                      {policyData.impactMetrics.digitalInclusion.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {policyData.impactMetrics.digitalInclusion.label}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {policyData.impactMetrics.digitalInclusion.value}%
                    </p>
                  </div>
                  <Progress value={policyData.impactMetrics.digitalInclusion.value} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {policyData.impactMetrics.digitalInclusion.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    <Badge variant="outline" className="text-xs">
                      {policyData.impactMetrics.circularEconomy.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {policyData.impactMetrics.circularEconomy.label}
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {policyData.impactMetrics.circularEconomy.value}%
                    </p>
                  </div>
                  <Progress value={policyData.impactMetrics.circularEconomy.value} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {policyData.impactMetrics.circularEconomy.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                    <Badge variant="outline" className="text-xs">
                      {policyData.impactMetrics.economicImpact.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {policyData.impactMetrics.economicImpact.label}
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {policyData.impactMetrics.economicImpact.value}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {policyData.impactMetrics.economicImpact.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Heart className="h-5 w-5 text-rose-600" />
                    <Badge variant="outline" className="text-xs">
                      {policyData.impactMetrics.socialImpact.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {policyData.impactMetrics.socialImpact.label}
                    </p>
                    <p className="text-3xl font-bold text-rose-600">
                      {policyData.impactMetrics.socialImpact.value}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {policyData.impactMetrics.socialImpact.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* District Mapping Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Cluster Integration & District Mapping</h2>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Active Districts (ODOP Mapping)</CardTitle>
                <CardDescription>
                  District-wise craft clusters mapped to government schemes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policyData.districtMapping.map((district, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{district.district}, {district.state}</p>
                          <p className="text-sm text-muted-foreground">{district.craftType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Artisans</p>
                          <p className="font-bold">{district.artisanCount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Suppliers</p>
                          <p className="font-bold">{district.supplierCount}</p>
                        </div>
                        <Badge variant="outline">{district.scheme}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Government Partnership Mode Info */}
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Government Partnership Mode
              </CardTitle>
              <CardDescription>
                MingleMakers is designed to integrate seamlessly with state and central government portals 
                for policy alignment, data sharing, and impact tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background">
                  <h4 className="font-semibold mb-2">Data Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time cluster data, artisan metrics, and economic impact reports
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <h4 className="font-semibold mb-2">Policy Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    Automated tagging and verification for scheme eligibility
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <h4 className="font-semibold mb-2">Impact Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Quarterly reports on digital inclusion, sustainability, and livelihood creation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    </SidebarProvider>
  );
}
