
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InsuranceProvider } from "./context/InsuranceContext";
import { CommerceProvider } from "./context/CommerceContext";
import { MarketingProvider } from "./context/MarketingContext";
import Index from "./pages/Index";
import MotorInsurance from "./pages/MotorInsurance";
import NotFound from "./pages/NotFound";
import CmsLogin from "./pages/cms/CmsLogin";
import CmsProducts from "./pages/cms/CmsProducts";
import CmsDiscounts from "./pages/cms/CmsDiscounts";
import CmsBundles from "./pages/cms/CmsBundles";
import CmsSocialDeploy from "./pages/cms/CmsSocialDeploy";
import StoreFront from "./pages/store/StoreFront";
import ProductDetail from "./pages/store/ProductDetail";
import Cart from "./pages/store/Cart";
import HomeInsurance from "./pages/HomeInsurance";
import HomeForm from "./pages/home/HomeForm";
import HomeQuote from "./pages/home/HomeQuote";
import HomeCheckout from "./pages/home/HomeCheckout";
import HomeConfirmation from "./pages/home/HomeConfirmation";
import SocialDemoApp from "./pages/SocialDemoApp";

// Marketing app pages
import CustomersPage from "./pages/marketing/Customers";
import SegmentsPage from "./pages/marketing/Segments";
import CampaignsPage from "./pages/marketing/Campaigns";
import AnalyticsPage from "./pages/marketing/Analytics";
import SettingsPage from "./pages/marketing/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CommerceProvider>
        <InsuranceProvider>
          <MarketingProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/motor" element={<MotorInsurance />} />
                <Route path="/home" element={<HomeInsurance />} />
                <Route path="/home/form" element={<HomeForm />} />
                <Route path="/home/quote" element={<HomeQuote />} />
                <Route path="/home/checkout" element={<HomeCheckout />} />
                <Route path="/home/confirmation" element={<HomeConfirmation />} />
                <Route path="/social-demo" element={<SocialDemoApp />} />
                
                {/* CMS Routes */}
                <Route path="/cms/login" element={<CmsLogin />} />
                <Route path="/cms/products" element={<CmsProducts />} />
                <Route path="/cms/discounts" element={<CmsDiscounts />} />
                <Route path="/cms/bundles" element={<CmsBundles />} />
                <Route path="/cms/social-deploy" element={<CmsSocialDeploy />} />
                
                {/* Store Routes */}
                <Route path="/store" element={<StoreFront />} />
                <Route path="/store/product/:id" element={<ProductDetail />} />
                <Route path="/store/cart" element={<Cart />} />
                
                {/* Marketing App Routes */}
                <Route path="/marketing/customers" element={<CustomersPage />} />
                <Route path="/marketing/segments" element={<SegmentsPage />} />
                <Route path="/marketing/campaigns" element={<CampaignsPage />} />
                <Route path="/marketing/analytics" element={<AnalyticsPage />} />
                <Route path="/marketing/settings" element={<SettingsPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MarketingProvider>
        </InsuranceProvider>
      </CommerceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
