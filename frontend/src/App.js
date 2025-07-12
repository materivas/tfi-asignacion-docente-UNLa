// Importamos elementos de react-router-dom para definir rutas
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos nuestros componentes
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tablero from './pages/Tablero';
import Gestion from './pages/Gestion';

function App() {
  return (
    <Router>
      {/* Siempre visible: la barra de navegación */}
      <Navbar />

      {/* Acá definimos qué componente se muestra en cada ruta */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tablero" element={<Tablero />} />
        <Route path="/gestion" element={<Gestion />} />
      </Routes>
    </Router>
  );
}

export default App;