import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Users, Package, Sparkles } from "lucide-react";
import clustersData from "@/data/clusters_mapping.json";
import { ClusterMatchingVisual } from "@/components/navigation/ClusterMatchingVisual";

const ClusterMapping = () => {
  const userCluster = localStorage.getItem("userCluster") || "";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Network className="h-8 w-8 text-primary" />
              <h1 className="font-heading text-4xl font-bold">Cluster Mapping & Matchmaking</h1>
            </div>
            <p className="text-muted-foreground">
              Discover how artisan clusters connect with verified suppliers
            </p>
          </div>

          {/* Personal Matchmaking */}
          {userCluster && (
            <div className="animate-fade-in">
              <ClusterMatchingVisual userCluster={userCluster} />
            </div>
          )}

          {/* Cluster & Supplier Overview */}
          <Tabs defaultValue="artisan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="artisan">
                <Users className="mr-2 h-4 w-4" />
                Artisan Clusters
              </TabsTrigger>
              <TabsTrigger value="supplier">
                <Package className="mr-2 h-4 w-4" />
                Supplier Types
              </TabsTrigger>
            </TabsList>

            {/* Artisan Clusters Tab */}
            <TabsContent value="artisan" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {clustersData.artisanClusters.map((cluster) => (
                  <Card 
                    key={cluster.id} 
                    className={`p-6 card-glow hover-lift ${userCluster === cluster.id ? 'border-2 border-primary' : ''}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-5xl">{cluster.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-semibold mb-2">
                          {cluster.name}
                        </h3>
                        {userCluster === cluster.id && (
                          <Badge className="bg-primary text-primary-foreground mb-2">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Your Cluster
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Sub-Categories:</p>
                        <div className="flex flex-wrap gap-1">
                          {cluster.subCategories.slice(0, 3).map((sub, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                          {cluster.subCategories.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{cluster.subCategories.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Typical Materials:</p>
                        <div className="flex flex-wrap gap-1">
                          {cluster.typicalMaterials.slice(0, 3).map((material, idx) => (
                            <Badge key={idx} className="bg-accent/10 text-accent text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Matched Suppliers:</p>
                        <div className="flex flex-wrap gap-1">
                          {cluster.matchedSupplierTypes.map((typeId) => {
                            const supplierType = clustersData.supplierTypes.find(s => s.id === typeId);
                            return supplierType ? (
                              <Badge key={typeId} className="bg-primary/10 text-primary text-xs">
                                {supplierType.icon} {supplierType.name.split(' ')[0]}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Supplier Types Tab */}
            <TabsContent value="supplier" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {clustersData.supplierTypes.map((supplier) => (
                  <Card key={supplier.id} className="p-6 card-glow hover-lift">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-5xl">{supplier.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-semibold mb-2">
                          {supplier.name}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Materials Provided:</p>
                        <div className="flex flex-wrap gap-1">
                          {supplier.materials.slice(0, 4).map((material, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                          {supplier.materials.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{supplier.materials.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {supplier.certifications.map((cert, idx) => (
                            <Badge key={idx} className="bg-accent/10 text-accent text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {supplier.servesCluster && supplier.servesCluster.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Serves Clusters:</p>
                          <div className="flex flex-wrap gap-1">
                            {supplier.servesCluster.map((clusterId) => {
                              const cluster = clustersData.artisanClusters.find(c => c.id === clusterId);
                              return cluster ? (
                                <Badge key={clusterId} className="bg-primary/10 text-primary text-xs">
                                  {cluster.icon} {cluster.name.split(' ')[0]}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClusterMapping;
