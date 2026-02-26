import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CopsoqLayout from "./components/copsoq/CopsoqLayout";
import Overview from "./pages/copsoq/q1/Overview";
import OnboardCompany from "./pages/copsoq/q1/OnboardCompany";
import OnboardWorkforce from "./pages/copsoq/q1/OnboardWorkforce";
import MensurarElias from "./pages/copsoq/q1/MensurarElias";
import MensurarSurvey from "./pages/copsoq/q1/MensurarSurvey";
import ResultsDashboard from "./pages/copsoq/q1/ResultsDashboard";
import ResultsMTRF from "./pages/copsoq/q1/ResultsMTRF";
import EducarTrilhas from "./pages/copsoq/q1/EducarTrilhas";
import TransformarBacklog from "./pages/copsoq/q1/TransformarBacklog";
import EvoluirESG from "./pages/copsoq/q1/EvoluirESG";
import MTRFWebDeck from "./pages/metodologia/MTRFWebDeck";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MTRFWebDeck />} />
          {/* Q1 COPSOQ Module — isolated namespace */}
          <Route path="/copsoq/q1" element={<CopsoqLayout />}>
            <Route path="overview" element={<Overview />} />
            <Route path="onboarding/company" element={<OnboardCompany />} />
            <Route path="onboarding/workforce" element={<OnboardWorkforce />} />
            <Route path="mensurar/elias" element={<MensurarElias />} />
            <Route path="mensurar/survey" element={<MensurarSurvey />} />
            <Route path="results/overview" element={<ResultsDashboard />} />
            <Route path="results/mtrf" element={<ResultsMTRF />} />
            <Route path="educar/trilhas" element={<EducarTrilhas />} />
            <Route path="transformar/backlog" element={<TransformarBacklog />} />
            <Route path="evoluir/esg" element={<EvoluirESG />} />
          </Route>
          {/* Metodologia WebDeck — isolated route */}
          <Route path="/metodologia/mtrf" element={<MTRFWebDeck />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
