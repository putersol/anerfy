import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
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
import GameMap from "./pages/GameMap";
import Auth from "./pages/Auth";
import Diagnostico from "./pages/Diagnostico";
import DiagnosticoGated from "./pages/DiagnosticoGated";
import Admin from "./pages/Admin";
import ResultsDashboard from "./pages/resultados/ResultsDashboard";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0f1729 0%, #1a1040 100%)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

// Profile sync wrapper - syncs Zustand store with Supabase
function ProfileSync({ children }: { children: React.ReactNode }) {
  useProfile();
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    {/* Public routes — no auth, no ProfileSync */}
    <Route path="/diagnostico" element={<DiagnosticoGated />} />
    <Route path="/diagnostico/:token" element={<DiagnosticoGated />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/resultados/:submissionId" element={<ResultsDashboard />} />
    <Route path="/mapa" element={<GameMap />} />
    <Route path="/mapa" element={<GameMap />} />
    
    {/* Routes with ProfileSync */}
    <Route path="*" element={
      <ProfileSync>
        <Layout>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/waitlist" element={<WaitlistLanding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ProfileSync>
    } />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
