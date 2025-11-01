import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Search, Package, TrendingUp, CheckCircle, Clock, Truck } from "lucide-react";
import { OrderTimeline } from "@/components/supplier/OrderTimeline";
import { toast } from "sonner";
import ordersData from "@/data/orders.json";

type Order = {
  id: string;
  material: string;
  quantity: string;
  buyer: string;
  date: string;
  status: string;
  eta: string;
  escrowStatus: string;
  price: number;
  timeline: {
    ordered: boolean;
    packed: boolean;
    inTransit: boolean;
    delivered: boolean;
  };
};

const statusConfig = {
  "Pending": { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  "Shipped": { icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
  "In Transit": { icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
  "Delivered": { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" }
};

const SupplierOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("supplierOrders");
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      setOrders(ordersData.orders);
      localStorage.setItem("supplierOrders", JSON.stringify(ordersData.orders));
    }
  }, []);

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem("supplierOrders", JSON.stringify(updatedOrders));
  };

  const updateStatus = (orderId: string) => {
    const statusFlow = ["Pending", "Shipped", "In Transit", "Delivered"];
    const updated = orders.map(order => {
      if (order.id === orderId) {
        const currentIndex = statusFlow.indexOf(order.status);
        const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];
        
        const newTimeline = { ...order.timeline };
        if (nextStatus === "Shipped") newTimeline.packed = true;
        if (nextStatus === "In Transit") newTimeline.inTransit = true;
        if (nextStatus === "Delivered") {
          newTimeline.delivered = true;
          toast.success("Payment released from escrow!");
        }

        return {
          ...order,
          status: nextStatus,
          timeline: newTimeline,
          escrowStatus: nextStatus === "Delivered" ? "Released" : order.escrowStatus
        };
      }
      return order;
    });
    
    saveOrders(updated);
    toast.success("Order status updated");
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.buyer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-6">
          <div className="animate-fade-in">
            <h1 className="font-heading text-4xl font-bold mb-2">Orders & Tracking</h1>
            <p className="text-muted-foreground">Manage incoming orders and delivery status</p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by material or buyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "Pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("Pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "In Transit" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("In Transit")}
                >
                  In Transit
                </Button>
                <Button
                  variant={filterStatus === "Delivered" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("Delivered")}
                >
                  Delivered
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
              const isExpanded = expandedOrder === order.id;

              return (
                <Card 
                  key={order.id}
                  className="p-6 card-glow hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-5 w-5 ${statusConfig[order.status as keyof typeof statusConfig]?.color}`} />
                          <h3 className="font-heading text-xl font-semibold">{order.material}</h3>
                          <Badge className={statusConfig[order.status as keyof typeof statusConfig]?.bg}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground">Order ID:</span> {order.id}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Quantity:</span> {order.quantity}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Buyer:</span> {order.buyer}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">ETA:</span> {order.eta}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="border-accent text-accent">
                            ₹{order.price.toLocaleString()}
                          </Badge>
                          <Badge variant="outline" className={order.escrowStatus === "Released" ? "border-green-500 text-green-600" : "border-orange-500 text-orange-600"}>
                            Escrow: {order.escrowStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          {isExpanded ? "Hide" : "Track"} Order
                        </Button>
                        {order.status !== "Delivered" && (
                          <Button
                            size="sm"
                            className="gradient-hero"
                            onClick={() => updateStatus(order.id)}
                          >
                            Update Status
                          </Button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-4 border-t animate-fade-in">
                        <OrderTimeline timeline={order.timeline} />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SupplierOrders;
