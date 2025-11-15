import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { Navigation } from "@/components/Navigation";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import Dashboard from "./pages/Dashboard";
import NovaCompra from "./pages/NovaCompra";
import Lotes from "./pages/Lotes";
import DetalhesLote from "./pages/DetalhesLote";
import Produtores from "./pages/Produtores";
import Fazendas from "./pages/Fazendas";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Offline from "./pages/Offline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAUpdatePrompt />
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nova-compra" element={<NovaCompra />} />
              <Route path="/lotes" element={<Lotes />} />
              <Route path="/lotes/:id" element={<DetalhesLote />} />
              <Route path="/produtores" element={<Produtores />} />
              <Route path="/fazendas" element={<Fazendas />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/offline" element={<Offline />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
