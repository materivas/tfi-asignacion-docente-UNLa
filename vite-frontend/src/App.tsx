import './index.css';
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
import MisHorarios from './pages/MisHorarios';

import Layout from './components/Layout';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />

            <Route path="/*" element={
                <ProtectedRoute>
                    <Layout>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/mis-horarios" element={<MisHorarios />} />

                            <Route path="/tablero" element={<ProtectedRoute requireAdmin={true}><Tablero /></ProtectedRoute>} />
                            <Route path="/gestion" element={<ProtectedRoute requireAdmin={true}><Gestion /></ProtectedRoute>} />
                            <Route path="/gestionCuatrimestre" element={<ProtectedRoute requireAdmin={true}><GestionCuatrimestre /></ProtectedRoute>} />
                            <Route path="/gestionCategoria" element={<ProtectedRoute requireAdmin={true}><GestionCategoria /></ProtectedRoute>} />
                            <Route path="/gestionDocente" element={<ProtectedRoute requireAdmin={true}><GestionDocente /></ProtectedRoute>} />
                            <Route path="/gestionPlan" element={<ProtectedRoute requireAdmin={true}><GestionPlan /></ProtectedRoute>} />
                            <Route path="/gestionMateria" element={<ProtectedRoute requireAdmin={true}><GestionMateria /></ProtectedRoute>} />
                            <Route path="/gestionAsignacion" element={<ProtectedRoute requireAdmin={true}><GestionAsignacion /></ProtectedRoute>} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;