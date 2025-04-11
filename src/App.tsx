
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Patients from "./pages/Patients";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import Nutritionists from "./pages/Nutritionists";
import NutritionistForm from "./pages/NutritionistForm";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Rotas de Pacientes */}
                <Route path="/pacientes" element={<Patients />} />
                <Route path="/pacientes/novo" element={<PatientForm />} />
                <Route path="/pacientes/:id" element={<PatientDetails />} />
                <Route path="/pacientes/:id/editar" element={<PatientForm />} />
                
                {/* Rotas de Nutricionistas (admin) */}
                <Route path="/admin/nutricionistas" element={<Nutritionists />} />
                <Route path="/admin/nutricionistas/novo" element={<NutritionistForm />} />
                <Route path="/admin/nutricionistas/:id/editar" element={<NutritionistForm />} />
                
                {/* Configurações */}
                <Route path="/configuracoes" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
