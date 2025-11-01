import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { db, storage } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    specialty: "",
    cluster: "",
    subCategory: "",
    profilePic: "",
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);

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
      countrycodes: "in", // optional: restrict to India or your region
    });

    const res = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        "User-Agent": "MingleMakersApp/1.0 (charanraj@example.com)",
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
  const { display_name, lat, lon } = suggestion;
  setForm({
    ...form,
    location: display_name,
  });
  setLocationSuggestions([]);
};

const detectUserLocation = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
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
  });
};



  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user data from Firestore
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    console.log("Stored user:", storedUser);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchUserData(parsed.email);
    }
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          name: data.name || "",
          location: data.location?.city || data.location || "",
          specialty: data.specialty || "",
          cluster: data.cluster || "",
          subCategory: data.subCategory || "",
          profilePic: data.profilePic || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Failed to load profile");
    }
  };

  // ✅ Handle text field updates
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile image upload selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ✅ Upload image to Firebase Storage
  const uploadProfileImage = async (uid, file) => {
    const storageRef = ref(storage, `profilePictures/${uid}.jpg`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // ✅ Save all updates
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const userRef = doc(db, "users", user.email);
      let updatedPicUrl = form.profilePic;

      // upload new photo if selected
      if (imageFile) {
        updatedPicUrl = await uploadProfileImage(user.uid, imageFile);
      }

      // update Firestore
      await updateDoc(userRef, {
        name: form.name,
        location: form.location,
        specialty: form.specialty,
        cluster: form.cluster,
        subCategory: form.subCategory,
        profilePic: updatedPicUrl,
      });

      // update localStorage
      const updatedUser = { ...user, ...form, profilePic: updatedPicUrl };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      navigate("/portfolio");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
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
    <div className="absolute bg-white border border-gray-200 rounded-lg shadow-md mt-1 max-h-48 overflow-y-auto w-full z-50">
      {locationSuggestions.map((loc) => (
        <div
          key={loc.place_id}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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
