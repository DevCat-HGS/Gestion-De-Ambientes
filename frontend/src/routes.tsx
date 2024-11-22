import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { AmbientesPage } from './pages/Ambientes';
import { DispositivosPage } from './pages/Dispositivos';
import { InstructoresPage } from './pages/Instructores';
import { JornadasPage } from './pages/Jornadas';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="ambientes" element={<AmbientesPage />} />
        <Route path="dispositivos" element={<DispositivosPage />} />
        <Route path="instructores" element={<InstructoresPage />} />
        <Route path="jornadas" element={<JornadasPage />} />
      </Route>
    </Routes>
  );
}