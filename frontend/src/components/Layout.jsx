function Layout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2E7DC",    // Fondo beige institucional
      padding: "2rem"
    }}>
      {children}  {/* Renderiza el contenido de cada página */}
    </div>
  );
}

export default Layout;