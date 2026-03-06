import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound";
import MTRFWebDeck from "./pages/metodologia/MTRFWebDeck";

import LandingLayout from "./components/landing/LandingLayout";
import LandingHome from "./pages/landing/Home";
import LandingPricing from "./pages/landing/Pricing";
import LandingSecurity from "./pages/landing/Security";
import LandingCaseStudies from "./pages/landing/CaseStudies";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import { AuthProvider } from "@/lib/auth/context";
import RequireAuth from "@/components/app/RequireAuth";
import AppShell from "@/components/app/AppShell";
import AppHome from "@/pages/app/AppHome";
import RequirePerm from "@/components/app/RequirePerm";
import Mensurar from "@/pages/app/Mensurar";
import Educar from "@/pages/app/Educar";
import Transformar from "@/pages/app/Transformar";
import Evoluir from "@/pages/app/Evoluir";
import EvidenceExplorer from "@/pages/app/EvidenceExplorer";
import CopsoqSurveyChat from "@/pages/app/CopsoqSurveyChat";
import CopsoqMyResults from "@/pages/app/CopsoqMyResults";
import ManagerDashboard from "@/pages/app/ManagerDashboard";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public marketing / landing */}
            <Route path="/" element={<LandingLayout />}>
              <Route index element={<LandingHome />} />
              <Route path="pricing" element={<LandingPricing />} />
              <Route path="security" element={<LandingSecurity />} />
              <Route path="case-studies" element={<LandingCaseStudies />} />
            </Route>

            {/* Public auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Public methodology deck */}
            <Route path="/metodologia/mtrf" element={<MTRFWebDeck />} />

            {/* Authenticated workspace */}
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route index element={<AppHome />} />
              <Route path="mensurar" element={<RequirePerm perm="VIEW_MENSURAR"><Mensurar /></RequirePerm>} />
              <Route path="educar" element={<RequirePerm perm="VIEW_EDUCAR"><Educar /></RequirePerm>} />
              <Route path="transformar" element={<RequirePerm perm="VIEW_TRANSFORMAR"><Transformar /></RequirePerm>} />
              <Route path="evoluir" element={<RequirePerm perm="VIEW_EVOLUIR"><Evoluir /></RequirePerm>} />
              <Route path="evidence" element={<RequirePerm perm="VERIFY_EVIDENCE"><EvidenceExplorer /></RequirePerm>} />
              <Route path="diagnostico" element={<CopsoqSurveyChat />} />
              <Route path="meus-resultados" element={<CopsoqMyResults />} />
              <Route path="dashboard-organizacional" element={<RequirePerm perm="VIEW_MENSURAR"><ManagerDashboard /></RequirePerm>} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>

            {/* Q1 COPSOQ Module — preserved, now protected */}
            <Route
              path="/copsoq/q1"
              element={
                <RequireAuth>
                  <CopsoqLayout />
                </RequireAuth>
              }
            >
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

            {/* Backward compatibility */}
            <Route path="/deck" element={<MTRFWebDeck />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
