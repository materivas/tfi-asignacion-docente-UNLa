import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/unla-logo.png';

const Home: React.FC = () => {
  const cards = [
    {
      to: '/tablero',
      title: 'Tablero Docente',
      desc: 'Calendario semanal con asignaciones por turno. Arrastrá y soltá para reasignar docentes.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      accent: 'var(--color-secondary)',
    },
    {
      to: '/gestion',
      title: 'Gestión Académica',
      desc: 'Administrá docentes, materias, planes de estudio, categorías y cuatrimestres.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09c-.658.003-1.25.396-1.51 1z"/>
        </svg>
      ),
      accent: 'var(--color-primary)',
    },
    {
      to: '/gestionDocente',
      title: 'Docentes',
      desc: 'Registrá y gestioná docentes, categorías académicas y datos de contacto.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      accent: 'var(--color-success)',
    },
  ];

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      title: 'Gestión Completa',
      desc: 'Administración integral de docentes, materias y asignaciones',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      title: 'Filtros Avanzados',
      desc: 'Búsqueda y filtrado por múltiples criterios académicos',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'Drag & Drop',
      desc: 'Reasigná docentes arrastrando y soltando en el calendario',
    },
  ];

  return (
    <main style={{ flex: 1, animation: 'fadeIn 0.4s ease-out' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <img
              src={logo}
              alt="Logo UNLa"
              style={{ width: '88px', height: 'auto', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))' }}
            />
          </div>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Sistema de Gestión Docente
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-lg)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
            Plataforma integral para la administración de docentes, materias y asignaciones de la Universidad Nacional de Lanús
          </p>
        </section>

        {/* Cards */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-xl)', maxWidth: '1000px', margin: '0 auto' }}>
            {cards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--border-radius-xl)',
                  padding: 'var(--spacing-xl)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-gray-200)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = card.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--color-gray-200)';
                }}
              >
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: 'var(--border-radius-lg)',
                  background: `color-mix(in srgb, ${card.accent} 8%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {card.icon}
                </div>
                <h3 style={{ color: 'var(--color-gray-800)', margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                  {card.title}
                </h3>
                <p style={{ color: 'var(--color-gray-500)', margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--border-radius-xl)',
          padding: 'var(--spacing-xl) var(--spacing-xl)',
          boxShadow: 'var(--shadow-xs)',
          border: '1px solid var(--color-gray-200)',
        }}>
          <h3 style={{ textAlign: 'center', color: 'var(--color-gray-800)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-xl)', fontWeight: 700 }}>
            Características
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-xl)' }}>
            {features.map((f) => (
              <div key={f.title} style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)' }}>
                  {f.icon}
                </div>
                <h4 style={{ color: 'var(--color-gray-800)', marginBottom: '0.25rem', fontWeight: 600 }}>{f.title}</h4>
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>
          <p style={{ margin: 0 }}>Trabajo Final Integrador — Licenciatura en Sistemas</p>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-gray-400)' }}>Universidad Nacional de Lanús © 2026</p>
        </footer>
      </div>
    </main>
  );
};

export default Home;