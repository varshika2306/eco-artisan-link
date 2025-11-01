// src/components/auth/LoginForm.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

const LoginForm = () => {
  const [role, setRole] = useState("artisan");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const roleParam = query.get("role");
    if (roleParam === "supplier" || roleParam === "artisan") {
      setRole(roleParam);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.email));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== role) {
          alert(`This account is not registered as a ${role}.`);
          return;
        }

        localStorage.setItem("currentUser", JSON.stringify(userData));
        alert(`Welcome back, ${userData.name}!`);

        navigate(role === "artisan" ? "/portfolio" : "/supplier");
      } else {
        alert("User data not found in database!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <form
        onSubmit={handleLogin}
        className="bg-card shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">
          {role === "artisan" ? "Artisan Login" : "Supplier Login"}
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Welcome back to MingleMakers!
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6">
          {role === "artisan" ? "Login as Artisan" : "Login as Supplier"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don’t have an account?{" "}
          <Link
            to={`/register?role=${role}`}
            className="text-primary font-medium hover:underline"
          >
            Sign up as {role === "artisan" ? "Artisan" : "Supplier"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
