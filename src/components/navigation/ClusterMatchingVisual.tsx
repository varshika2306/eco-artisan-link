import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import clustersData from "@/data/clusters_mapping.json";

interface ClusterMatchingVisualProps {
  userCluster?: string;
}

export const ClusterMatchingVisual = ({ userCluster }: ClusterMatchingVisualProps) => {
  if (!userCluster) return null;

  const cluster = clustersData.artisanClusters.find(c => c.id === userCluster);
  if (!cluster) return null;

  const matchedSuppliers = cluster.matchedSupplierTypes
    .map(id => clustersData.supplierTypes.find(s => s.id === id))
    .filter(Boolean);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-xl font-semibold">Smart Supplier Matching</h3>
      </div>

      <div className="grid gap-6">
        {/* Artisan Cluster */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex-1">
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{cluster.icon}</span>
                <div>
                  <h4 className="font-semibold">{cluster.name}</h4>
                  <p className="text-sm text-muted-foreground">Your Craft Cluster</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Arrow Connector */}
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowRight className="h-8 w-8 text-primary" />
          </motion.div>
        </div>

        {/* Matched Suppliers */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Recommended Supplier Types:</p>
          <div className="grid gap-3">
            {matchedSuppliers.map((supplier, index) => (
              <motion.div
                key={supplier?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover-lift cursor-pointer bg-card/50 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{supplier?.icon}</span>
                    <div className="flex-1">
                      <h5 className="font-medium">{supplier?.name}</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {supplier?.certifications.slice(0, 2).map((cert, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {supplier?.materials && (
                    <p className="text-xs text-muted-foreground mt-2 pl-12">
                      Materials: {supplier.materials.slice(0, 3).join(", ")}
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Typical Materials */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Typical Materials Needed:</p>
          <div className="flex flex-wrap gap-2">
            {cluster.typicalMaterials.map((material, idx) => (
              <Badge key={idx} className="bg-primary/10 text-primary">
                {material}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
