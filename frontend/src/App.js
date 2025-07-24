import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tablero from './pages/Tablero';
import Gestion from './pages/Gestion';
import GestionCuatrimestre from './pages/GestionCuatrimestre';
import GestionDocente from './pages/GestionDocente';
import GestionCategoria from './pages/GestionCategoria';
import GestionPlan from './pages/GestionPlan';
import GestionMateria from './pages/GestionMateria';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tablero" element={<Tablero />} />
        <Route path="/gestion" element={<Gestion />} />
        <Route path="/gestion/docentes" element={<GestionDocente />} />
        <Route path="/gestion/categorias" element={<GestionCategoria />} />
        <Route path="/gestion/planes" element={<GestionPlan />} />
        <Route path="/gestion/materias" element={<GestionMateria />} />
        <Route path="/gestion/cuatrimestre" element={<GestionCuatrimestre />} />
      </Routes>
    </Router>
  );
}

export default App;