import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'
import Tablero from './pages/Tablero';
import Gestion from './pages/Gestion';
import GestionCategoria from './pages/GestionCategoria';
import GestionCuatrimestre from './pages/GestionCuatrimestre';
import GestionPlan from './pages/GestionPlan';
import GestionMateria from './pages/GestionMateria';
import GestionDocente from './pages/GestionDocente';
import GestionAsignacion from './pages/GestionAsignacion';
import Login from './pages/Login';

import Layout from './components/Layout';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Ruta pública de login */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      
      {/* Rutas protegidas */}
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tablero" element={<Tablero />} />
              <Route path="/gestion" element={<Gestion />} />
              <Route path="/gestionCuatrimestre" element={<GestionCuatrimestre />} />
              <Route path="/gestionCategoria" element={<GestionCategoria />} />
              <Route path="/gestionDocente" element={<GestionDocente />} />
              <Route path="/gestionPlan" element={<GestionPlan />} />
              <Route path="/gestionMateria" element={<GestionMateria />} /> 
              <Route path="/gestionAsignacion" element={<GestionAsignacion />} />          
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;