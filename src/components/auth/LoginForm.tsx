import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const LoginForm = () => {
  const [role, setRole] = useState("artisan");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const roleParam = query.get("role");
    if (roleParam === "supplier" || roleParam === "artisan") {
      setRole(roleParam);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with Lovable Cloud Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch user role from database
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id)
          .single();

        if (roleError) {
          console.error("Error fetching role:", roleError);
        }

        const userRole = roleData?.role || role;

        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        // Store user data in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            uid: authData.user.id,
            email: authData.user.email,
            name: profileData?.full_name || authData.user.email,
            role: userRole,
          })
        );

        toast.success(`Welcome back, ${profileData?.full_name || authData.user.email}!`);
        navigate(userRole === "artisan" ? "/portfolio" : "/supplier");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password!");
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            role === "artisan" ? "Login as Artisan" : "Login as Supplier"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
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
