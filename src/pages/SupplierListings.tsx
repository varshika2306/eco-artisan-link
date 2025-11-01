import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, TrendingUp, Package, Leaf } from "lucide-react";
import { AddListingModal } from "@/components/supplier/AddListingModal";
import { toast } from "sonner";
import supplierData from "@/data/supplier_data.json";

type Listing = {
  id: string;
  name: string;
  stock: string;
  unit: string;
  pricePerKg: number;
  orders: number;
  ecoScore: number;
  status: string;
  moq: number;
  image: string;
  description: string;
};

const SupplierListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "eco">("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("supplierListings");
    if (stored) {
      setListings(JSON.parse(stored));
    } else {
      setListings(supplierData.listings);
      localStorage.setItem("supplierListings", JSON.stringify(supplierData.listings));
    }
  }, []);

  const saveListings = (updatedListings: Listing[]) => {
    setListings(updatedListings);
    localStorage.setItem("supplierListings", JSON.stringify(updatedListings));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      const updated = listings.filter(l => l.id !== id);
      saveListings(updated);
      toast.success("Listing deleted successfully");
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setIsModalOpen(true);
  };

  const handleAddOrUpdate = (listing: Listing) => {
    if (editingListing) {
      const updated = listings.map(l => l.id === listing.id ? listing : l);
      saveListings(updated);
      toast.success("Listing updated successfully");
    } else {
      const newListing = { ...listing, id: Date.now().toString() };
      saveListings([...listings, newListing]);
      toast.success("🎉 New listing added!");
    }
    setIsModalOpen(false);
    setEditingListing(null);
  };

  const filteredListings = listings
    .filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return b.pricePerKg - a.pricePerKg;
      if (sortBy === "eco") return b.ecoScore - a.ecoScore;
      return 0;
    });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-6">
          <div className="animate-fade-in">
            <h1 className="font-heading text-4xl font-bold mb-2">Material Listings</h1>
            <p className="text-muted-foreground">Manage your inventory and catalog</p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={sortBy === "name" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("name")}
                >
                  Name
                </Button>
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("price")}
                >
                  Price
                </Button>
                <Button
                  variant={sortBy === "eco" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("eco")}
                >
                  Eco Score
                </Button>
                <Button
                  className="gradient-hero hover-lift"
                  onClick={() => {
                    setEditingListing(null);
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Listing
                </Button>
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Eco Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map((listing, index) => (
                    <TableRow 
                      key={listing.id}
                      className="animate-fade-in hover:bg-muted/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          {listing.name}
                        </div>
                      </TableCell>
                      <TableCell>{listing.stock}</TableCell>
                      <TableCell>₹{listing.pricePerKg}/{listing.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-secondary" />
                          {listing.orders}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-accent" />
                          <span className="font-medium text-accent">{listing.ecoScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary capitalize">
                          {listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(listing)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(listing.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </main>

        <AddListingModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          listing={editingListing}
          onSave={handleAddOrUpdate}
        />
      </div>
    </SidebarProvider>
  );
};

export default SupplierListings;
