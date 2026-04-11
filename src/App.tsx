import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Customize from "./pages/Customize";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import Manager from "./pages/Manager";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./contexts/CartContext";
import EmailCapturePopup, { useEmailPopup } from "./components/EmailCapturePopup";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Only retry Supabase 429 errors up to 3 times
        if (error?.code === "429" || error?.status === 429) {
          return failureCount < 3;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s, 2s, 4s
        return Math.min(1000 * 2 ** attemptIndex, 4000);
      },
      staleTime: 5 * 60 * 1000, // 5 min - avoids unnecessary refetches
      refetchOnWindowFocus: false, // prevents extra requests
    },
  },
});

const AppContent = () => {
  const { showPopup, handleClose, handleSuccess, popupCode, popupDiscount } = useEmailPopup();
  
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/colecao" element={<Collection />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/personalizar" element={<Customize />} />
        <Route path="/sobre" element={<About />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <WhatsAppFAB />
      {showPopup && (
        <EmailCapturePopup 
          onClose={handleClose} 
          onSuccess={handleSuccess}
          popupCode={popupCode}
          popupDiscount={popupDiscount}
        />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
