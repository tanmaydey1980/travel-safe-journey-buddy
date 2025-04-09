
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InsuranceProvider } from "./context/InsuranceContext";
import Index from "./pages/Index";
import MotorInsurance from "./pages/MotorInsurance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InsuranceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/motor" element={<MotorInsurance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </InsuranceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
