import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import WaitlistLanding from "./pages/WaitlistLanding";
import Onboarding from "./pages/Index";
import Roadmap from "./pages/Roadmap";
import Calculator from "./pages/Calculator";
import Services from "./pages/Services";
import Guides from "./pages/Guides";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Cookies from "./pages/Cookies";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<WaitlistLanding />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/services" element={<Services />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/community" element={<Community />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
