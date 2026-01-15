import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  name?: string;
  specialty?: string;
  cluster?: string;
  subCategory?: string;
  profilePic?: string;
  location?: string | { city?: string };
  locationCoords?: { lat: number; lon: number };
}

const ClusterPeopleList = () => {
  const { clusterId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCurrentLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      (err) => console.warn("Location denied", err)
    );
  }, []);

  // Load users from localStorage (mock data for demo)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // For now, use mock data since we're not using Firebase
        // In a real app, you'd fetch from your backend
        const mockUsers: UserData[] = [
          {
            id: "1",
            name: "Rajesh Kumar",
            specialty: "Traditional Pottery",
            cluster: clusterId,
            subCategory: "Terracotta",
            location: "Jaipur, Rajasthan",
          },
          {
            id: "2",
            name: "Lakshmi Devi",
            specialty: "Textile Weaving",
            cluster: clusterId,
            subCategory: "Handloom",
            location: "Varanasi, UP",
          },
          {
            id: "3",
            name: "Amit Singh",
            specialty: "Wood Carving",
            cluster: clusterId,
            subCategory: "Furniture",
            location: "Saharanpur, UP",
          },
        ];

        setUsers(mockUsers);
      } catch (e) {
        toast.error("Failed to load cluster members");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [clusterId, currentLocation]);

  // Helper to calculate distance (Haversine)
  const getDistance = (loc1: any, loc2: any) => {
    if (!loc1 || !loc2) return Infinity;
    const R = 6371;
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLon = ((loc2.lon - loc1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 transition-all">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="hover:bg-indigo-50 dark:hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-wide capitalize">
            {clusterId} Cluster
          </h2>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20 text-lg text-muted-foreground animate-pulse">
            Loading artisans nearby...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <User className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <p>No artisans found in this cluster.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {users.map((u) => (
              <Card
                key={u.id}
                className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-indigo-100 dark:border-slate-700"
              >
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <img
                    src={u.profilePic || "/placeholder.svg"}
                    alt={u.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-500"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.specialty || "Artisan"}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center mt-3 text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4 text-indigo-500" />
                  {typeof u.location === "object" ? u.location?.city : u.location || "Unknown"}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {u.subCategory && (
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-2 py-1">
                      {u.subCategory}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClusterPeopleList;
