import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/unla-logo.png';

const Home: React.FC = () => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-lg)',
    padding: 'var(--spacing-xl)',
    boxShadow: 'var(--shadow-md)',
    textAlign: 'center',
    transition: 'all var(--transition-base)',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    border: '1px solid transparent',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '3rem',
    marginBottom: 'var(--spacing-sm)',
  };

  return (
    <main style={{ flex: 1 }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header Hero */}
        <section style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-xl)',
          }}>
            <img
              src={logo}
              alt="Logo UNLa"
              style={{ 
                width: '120px', 
                height: 'auto',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
              }}
            />
          </div>
          <h1 
            style={{ 
              color: 'var(--color-primary)', 
              fontSize: 'var(--font-size-4xl)',
              marginBottom: 'var(--spacing-md)',
              fontWeight: 600,
            }}
          >
            Sistema de Gestión Docente
          </h1>
          <p
            style={{
              color: 'var(--color-gray-600)',
              fontSize: 'var(--font-size-lg)',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Plataforma integral para la administración de docentes, materias y asignaciones académicas de la Universidad Nacional de Lanús
          </p>
        </section>

        {/* Cards de Acceso Rápido */}
        <section>
          <h2 
            style={{ 
              textAlign: 'center', 
              color: 'var(--color-gray-800)',
              fontSize: 'var(--font-size-3xl)',
              marginBottom: 'var(--spacing-xl)',
              fontWeight: 600,
            }}
          >
            Acceso Rápido
          </h2>
          
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-xl)',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {/* Card Tablero Docente */}
            <Link
              to="/tablero"
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{...iconStyle, fontFamily: 'Arial', fontWeight: 'bold', color: 'var(--color-secondary)'}}>▦</div>
              <h3 style={{ 
                color: 'var(--color-primary)', 
                margin: 0,
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
              }}>
                Tablero Docente
              </h3>
              <p style={{ 
                color: 'var(--color-gray-600)', 
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.6,
              }}>
                Visualizá asignaciones de docentes por materia, cuatrimestre y turno. Gestioná roles y confirmaciones.
              </p>
            </Link>

            {/* Card Gestión Académica */}
            <Link
              to="/gestion"
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={iconStyle}>⚙</div>
              <h3 style={{ 
                color: 'var(--color-primary)', 
                margin: 0,
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
              }}>
                Gestión Académica
              </h3>
              <p style={{ 
                color: 'var(--color-gray-600)', 
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.6,
              }}>
                Administrá docentes, materias, planes de estudio, categorías y cuatrimestres del sistema.
              </p>
            </Link>

            {/* Card Gestión Docentes */}
            <Link
              to="/gestionDocente"
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{...iconStyle, fontWeight: 700, fontSize: '2.5rem', color: 'var(--color-primary)'}}>👤</div>
              <h3 style={{ 
                color: 'var(--color-primary)', 
                margin: 0,
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
              }}>
                Gestión de Docentes
              </h3>
              <p style={{ 
                color: 'var(--color-gray-600)', 
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.6,
              }}>
                Registrá y gestioná docentes, asignando categorías académicas y datos de contacto.
              </p>
            </Link>
          </div>
        </section>

        {/* Información del Sistema */}
        <section 
          style={{ 
            marginTop: 'var(--spacing-2xl)',
            padding: 'var(--spacing-xl)',
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <h3 
            style={{ 
              color: 'var(--color-gray-800)',
              fontSize: 'var(--font-size-xl)',
              marginBottom: 'var(--spacing-md)',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Características del Sistema
          </h3>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
              marginTop: 'var(--spacing-lg)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-success)', fontWeight: 'bold' }}>✓</div>
              <h4 style={{ color: 'var(--color-gray-800)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>
                Gestión Completa
              </h4>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Administración integral de docentes, materias y asignaciones
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>⌕</div>
              <h4 style={{ color: 'var(--color-gray-800)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>
                Filtros Avanzados
              </h4>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Búsqueda y filtrado por múltiples criterios académicos
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)', fontWeight: 'bold' }}>⊞</div>
              <h4 style={{ color: 'var(--color-gray-800)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>
                Diseño Responsive
              </h4>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Interfaz adaptable a diferentes dispositivos
              </p>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <footer 
          style={{ 
            marginTop: 'var(--spacing-2xl)',
            textAlign: 'center',
            color: 'var(--color-gray-600)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <p style={{ margin: 0 }}>
            Trabajo Final Integrador - Licenciatura en Sistemas
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-gray-600)' }}>
            Universidad Nacional de Lanús © 2026
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Home;