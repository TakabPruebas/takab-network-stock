import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import UserManagementPage from "./pages/UserManagement";
import ProductsPage from "./pages/Products";
import Configuration from "./pages/Configuration";
import SolicitudesPage from "./pages/Solicitudes";
import InventarioPage from "./pages/Inventario";
import ReportesPage from "./pages/Reportes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/usuarios" element={<UserManagementPage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/configuracion" element={<Configuration />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
