import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import ArtisanPortfolio from "./pages/ArtisanPortfolio";
import MaterialHub from "./pages/MaterialHub";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierListings from "./pages/SupplierListings";
import SupplierOrders from "./pages/SupplierOrders";
import SupplierAnalytics from "./pages/SupplierAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/portfolio" element={<ArtisanPortfolio />} />
          <Route path="/hub" element={<MaterialHub />} />
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/supplier/listings" element={<SupplierListings />} />
          <Route path="/supplier/orders" element={<SupplierOrders />} />
          <Route path="/supplier/analytics" element={<SupplierAnalytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
