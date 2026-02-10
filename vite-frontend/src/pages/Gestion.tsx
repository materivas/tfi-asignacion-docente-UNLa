import { Link } from 'react-router-dom';

function Gestion() {
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
    border: '2px solid transparent',
    minHeight: '180px',
    justifyContent: 'center',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '3rem',
    marginBottom: 'var(--spacing-sm)',
  };

  const modules = [
    {
      to: '/gestionDocente',
      icon: '',
      title: 'Gestión de Docentes',
      description: 'Alta, baja y modificación de docentes con categorías académicas'
    },
    {
      to: '/gestionCategoria',
      icon: '',
      title: 'Categorías Docentes',
      description: 'Administración de categorías y carga horaria permitida'
    },
    {
      to: '/gestionPlan',
      icon: '',
      title: 'Planes de Estudio',
      description: 'Gestión de planes académicos y ciclos formativos'
    },
    {
      to: '/gestionMateria',
      icon: '',
      title: 'Gestión de Materias',
      description: 'Administración de materias por plan, año y cuatrimestre'
    },
    {
      to: '/gestionCuatrimestre',
      icon: '',
      title: 'Cuatrimestres',
      description: 'Configuración de períodos académicos'
    },
    {
      to: '/gestionAsignacion',
      icon: '',
      title: 'Asignaciones',
      description: 'Asignación de materias a cuatrimestres y turnos'
    },
  ];

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ 
        paddingTop: 'var(--spacing-2xl)', 
        paddingBottom: 'var(--spacing-2xl)' 
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-2xl)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'var(--font-size-4xl)',
            color: 'var(--color-primary)',
            margin: 0,
            marginBottom: 'var(--spacing-sm)',
          }}>
            Gestión Académica
          </h1>
          <p style={{
            color: 'var(--color-gray-600)',
            fontSize: 'var(--font-size-lg)',
            margin: 0,
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Centro de administración para docentes, materias, planes de estudio y asignaciones académicas
          </p>
        </div>

        {/* Grid de Módulos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {modules.map((module) => (
            <Link
              key={module.to}
              to={module.to}
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
              <h3 style={{
                color: 'var(--color-primary)',
                margin: 0,
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
              }}>
                {module.title}
              </h3>
              <p style={{
                color: 'var(--color-gray-600)',
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.6,
              }}>
                {module.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Información de Ayuda */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-xl)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{
            color: 'var(--color-gray-800)',
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: 600,
          }}>
            Guía de Uso
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-lg)',
          }}>
            <div>
              <h4 style={{ 
                color: 'var(--color-gray-700)', 
                fontSize: 'var(--font-size-base)', 
                marginBottom: 'var(--spacing-xs)',
                fontWeight: 600,
              }}>
                1. Configuración Inicial
              </h4>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Comience configurando Categorías, Planes de Estudio y Cuatrimestres
              </p>
            </div>
            <div>
              <h4 style={{ 
                color: 'var(--color-gray-700)', 
                fontSize: 'var(--font-size-base)', 
                marginBottom: 'var(--spacing-xs)',
                fontWeight: 600,
              }}>
                2. Registro de Datos
              </h4>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Registre Docentes y Materias con sus respectivas categorías
              </p>
            </div>
            <div>
              <h4 style={{ 
                color: 'var(--color-gray-700)', 
                fontSize: 'var(--font-size-base)', 
                marginBottom: 'var(--spacing-xs)',
                fontWeight: 600,
              }}>
                3. Asignaciones
              </h4>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Cree asignaciones y asocie docentes desde el Tablero Docente
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Gestion;