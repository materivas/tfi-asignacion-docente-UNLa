import Layout from '../components/Layout';
import logo from '../assets/unla-logo.png';

function Home() {
  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Logo UNLa" style={{ width: "120px", marginBottom: "1rem" }} />
        <h1 style={{ color: "#7A1F1F" }}>Bienvenidos al Sistema de Gestión Docente</h1>
        <p style={{ color: "#333", fontSize: "1.1rem", maxWidth: "600px", margin: "auto" }}>
          Organizá turnos, docentes y materias de manera clara, eficiente y profesional.
        </p>
      </div>
    </Layout>
  );
}
export default Home;