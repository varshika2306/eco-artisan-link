import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

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

type AddListingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
  onSave: (listing: Listing) => void;
};

export function AddListingModal({ open, onOpenChange, listing, onSave }: AddListingModalProps) {
  const [formData, setFormData] = useState<Listing>({
    id: "",
    name: "",
    stock: "",
    unit: "kg",
    pricePerKg: 0,
    orders: 0,
    ecoScore: 75,
    status: "active",
    moq: 10,
    image: "/placeholder.svg",
    description: ""
  });

  useEffect(() => {
    if (listing) {
      setFormData(listing);
    } else {
      setFormData({
        id: "",
        name: "",
        stock: "",
        unit: "kg",
        pricePerKg: 0,
        orders: 0,
        ecoScore: 75,
        status: "active",
        moq: 10,
        image: "/placeholder.svg",
        description: ""
      });
    }
  }, [listing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {listing ? "Edit Listing" : "Add New Listing"}
          </DialogTitle>
          <DialogDescription>
            {listing ? "Update the details of your material listing" : "Add a new material to your catalog"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Material Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Organic Clay"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="e.g., 2.5 tons"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., kg, meter, liter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Unit (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                placeholder="0"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moq">Minimum Order Quantity *</Label>
              <Input
                id="moq"
                type="number"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: Number(e.target.value) })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Eco Score: {formData.ecoScore}%</Label>
              <Slider
                value={[formData.ecoScore]}
                onValueChange={(value) => setFormData({ ...formData, ecoScore: value[0] })}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your material, sourcing, and sustainability practices..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-hero">
              {listing ? "Update Listing" : "Add Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
