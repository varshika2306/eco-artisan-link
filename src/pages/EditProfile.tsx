import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  uid: string;
  email: string;
  name: string;
  location: string;
  specialty: string;
  cluster: string;
  subCategory: string;
  profilePic: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    specialty: "",
    cluster: "",
    subCategory: "",
    profilePic: "",
  });

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, location: value });

    if (value.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const endpoint = `https://nominatim.openstreetmap.org/search`;
      const params = new URLSearchParams({
        q: value,
        format: "json",
        addressdetails: "1",
        limit: "5",
        countrycodes: "in",
      });

      const res = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
          "User-Agent": "MingleMakersApp/1.0",
          "Accept-Language": "en",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const { display_name } = suggestion;
    setForm({
      ...form,
      location: display_name,
    });
    setLocationSuggestions([]);
  };

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      const data = await res.json();

      setForm({
        ...form,
        location: data.display_name
      });
      toast.success("Location detected!");
    }, () => {
      toast.error("Failed to detect location.");
    });
  };

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        location: parsed.location || "",
        specialty: parsed.specialty || "",
        cluster: parsed.cluster || "",
        subCategory: parsed.subCategory || "",
        profilePic: parsed.profilePic || "",
      });
    }
  }, []);

  // Handle text field updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle profile image upload selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Save all updates
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let updatedPicUrl = form.profilePic;

      // Convert new photo to base64 if selected
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          updatedPicUrl = reader.result as string;
          saveToLocalStorage(updatedPicUrl);
        };
        reader.readAsDataURL(imageFile);
        return; // Wait for reader to complete
      } else {
        saveToLocalStorage(updatedPicUrl);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  const saveToLocalStorage = async (profilePicUrl: string) => {
    try {
      // Update profile in database
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase
          .from("profiles")
          .update({ full_name: form.name })
          .eq("id", authUser.id);
      }

      // Update localStorage
      const updatedUser = { ...user, ...form, profilePic: profilePicUrl };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      navigate("/portfolio");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-6">
      <div className="bg-card shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={previewUrl || form.profilePic}
              alt={form.name}
            />
            <AvatarFallback>
              {form.name ? form.name[0].toUpperCase() : "A"}
            </AvatarFallback>
          </Avatar>

          <label
            htmlFor="profilePic"
            className="mt-3 text-sm text-primary cursor-pointer hover:underline"
          >
            Change Photo
          </label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="relative">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Input
                name="location"
                value={form.location}
                onChange={handleLocationChange}
                placeholder="Enter your city"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="outline"
                onClick={detectUserLocation}
                className="shrink-0"
              >
                Use My Location
              </Button>
            </div>

            {locationSuggestions.length > 0 && (
              <div className="absolute bg-background border border-border rounded-lg shadow-md mt-1 max-h-48 overflow-y-auto w-full z-50">
                {locationSuggestions.map((loc) => (
                  <div
                    key={loc.place_id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => handleSelectSuggestion(loc)}
                  >
                    {loc.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Specialty</Label>
            <Input
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Cluster</Label>
            <Input
              name="cluster"
              value={form.cluster}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Subcategory</Label>
            <Input
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
