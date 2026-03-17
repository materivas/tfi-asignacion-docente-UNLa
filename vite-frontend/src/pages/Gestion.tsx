import { Link } from 'react-router-dom';

function Gestion() {
  const modules = [
    {
      to: '/gestionDocente',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-50)',
      title: 'Gestión de Docentes',
      description: 'Alta, baja y modificación de docentes con categorías académicas'
    },
    {
      to: '/gestionCategoria',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
      color: '#7c3aed',
      bg: '#f5f3ff',
      title: 'Categorías Docentes',
      description: 'Administración de categorías y carga horaria permitida'
    },
    {
      to: '/gestionPlan',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      color: 'var(--color-secondary)',
      bg: '#e0f2fe',
      title: 'Planes de Estudio',
      description: 'Gestión de planes académicos y ciclos formativos'
    },
    {
      to: '/gestionMateria',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
      color: '#059669',
      bg: '#ecfdf5',
      title: 'Gestión de Materias',
      description: 'Administración de materias por plan, año y cuatrimestre'
    },
    {
      to: '/gestionCuatrimestre',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      color: '#d97706',
      bg: '#fffbeb',
      title: 'Cuatrimestres',
      description: 'Configuración de períodos académicos'
    },
    {
      to: '/gestionAsignacion',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
      color: '#2563eb',
      bg: '#eff6ff',
      title: 'Asignaciones',
      description: 'Asignación de materias a cuatrimestres y turnos'
    },
  ];

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)', animation: 'fadeIn 0.3s ease-out' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div className="page-header" style={{ textAlign: 'center', borderLeft: 'none' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.375rem' }}>Gestión Académica</h1>
          <p>Centro de administración para docentes, materias, planes y asignaciones</p>
        </div>

        {/* Grid de Módulos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {modules.map((mod) => (
            <Link
              key={mod.to}
              to={mod.to}
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--border-radius-xl)',
                padding: 'var(--spacing-xl)',
                boxShadow: 'var(--shadow-xs)',
                border: '1px solid var(--color-gray-200)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--spacing-lg)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = mod.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                e.currentTarget.style.borderColor = 'var(--color-gray-200)';
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: 'var(--border-radius-lg)',
                background: mod.bg, color: mod.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {mod.icon}
              </div>
              <div>
                <h3 style={{ color: 'var(--color-gray-800)', margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {mod.title}
                </h3>
                <p style={{ color: 'var(--color-gray-500)', margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                  {mod.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Guía de Uso */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          background: 'var(--color-white)',
          borderRadius: 'var(--border-radius-xl)',
          padding: 'var(--spacing-xl)',
          boxShadow: 'var(--shadow-xs)',
          border: '1px solid var(--color-gray-200)',
        }}>
          <h3 style={{ color: 'var(--color-gray-800)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-lg)', fontWeight: 700 }}>
            Guía de Uso
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {[
              { num: '1', title: 'Configuración Inicial', desc: 'Comience configurando Categorías, Planes de Estudio y Cuatrimestres' },
              { num: '2', title: 'Registro de Datos', desc: 'Registre Docentes y Materias con sus respectivas categorías' },
              { num: '3', title: 'Asignaciones', desc: 'Cree asignaciones y asocie docentes desde el Tablero Docente' },
            ].map((step) => (
              <div key={step.num} style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--color-primary-50)', color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 'var(--font-size-sm)', flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-gray-700)', fontSize: 'var(--font-size-sm)', marginBottom: '0.125rem', fontWeight: 700 }}>
                    {step.title}
                  </h4>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Gestion;