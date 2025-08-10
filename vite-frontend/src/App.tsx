import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Tablero from './pages/Tablero';
import Gestion from './pages/Gestion';
import GestionCategoria from './pages/GestionCategoria';
import GestionCuatrimestre from './pages/GestionCuatrimestre';
import GestionPlan from './pages/GestionPlan';
import GestionMateria from './pages/GestionMateria';
import GestionDocente from './pages/GestionDocente';

import Layout from './components/Layout';
import Navbar from './components/Navbar';

function App() {
  return (
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
      </Routes>
    </Layout>
  );
}

export default App;