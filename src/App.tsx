import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import FormVariants from "./pages/FormVariants";
import GalleryShowcase from "./pages/GalleryShowcase";
import ComponentPage from "./pages/ComponentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<AppLayout />}>
              <Route path="/lab" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/form-builder" element={<FormBuilder />} />
              <Route path="/forms" element={<FormVariants />} />
              <Route path="/galleries" element={<GalleryShowcase />} />
              <Route path="/components/:componentId" element={<ComponentPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
