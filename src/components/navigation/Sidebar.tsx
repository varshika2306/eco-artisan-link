import { Home, User, Package, Repeat, Sparkles, Users, BarChart3, Settings, LogOut, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: sidebarState } = useSidebar();
  const userRole = localStorage.getItem("userRole") || "artisan";
  const collapsed = sidebarState === "collapsed";

  const artisanItems = [
    { title: "Portfolio", url: "/portfolio", icon: User },
    { title: "Material Hub", url: "/hub", icon: Package },
    { title: "Swap & Barter", url: "/swap", icon: Repeat },
    { title: "AI Studio", url: "/studio", icon: Sparkles },
    { title: "Community", url: "/community", icon: Users },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
  ];

  const supplierItems = [
    { title: "Dashboard", url: "/supplier", icon: Home },
    { title: "Listings", url: "/supplier/listings", icon: Package },
    { title: "Orders", url: "/supplier/orders", icon: Repeat },
    { title: "Analytics", url: "/supplier/analytics", icon: BarChart3 },
  ];

  const commonItems = [
    { title: "Cluster Mapping", url: "/cluster-mapping", icon: Users },
    { title: "Policy Dashboard", url: "/policy-dashboard", icon: FileText },
  ];

  const items = userRole === "artisan" ? artisanItems : supplierItems;

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const switchRole = () => {
    const newRole = userRole === "artisan" ? "supplier" : "artisan";
    localStorage.setItem("userRole", newRole);
    toast.success(`Switched to ${newRole} portal`);
    navigate(newRole === "artisan" ? "/portfolio" : "/supplier");
  };

  return (
    <SidebarComponent className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MingleMakers
          </h2>
        )}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "•" : "Navigation"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={isActive ? "bg-primary text-primary-foreground" : ""}
                      tooltip={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {commonItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={isActive ? "bg-primary text-primary-foreground" : ""}
                      tooltip={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "•" : "Settings"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={switchRole} tooltip="Switch Role">
                  <Repeat className="h-5 w-5" />
                  {!collapsed && <span>Switch to {userRole === "artisan" ? "Supplier" : "Artisan"}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/settings")} tooltip="Settings">
                  <Settings className="h-5 w-5" />
                  {!collapsed && <span>Settings</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut className="h-5 w-5" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}
