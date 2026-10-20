import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../components/Modal';
import {
  buscarHistorialAuditoria,
  type EntidadAuditada,
  type EventoAuditoria,
  type PaginaAuditoria,
} from '../api/auditoriaApi';

const etiquetasEntidad: Record<EntidadAuditada, string> = {
  ASIGNACION: 'Asignación',
  ASIGNACION_DOCENTE: 'Asignación de docente',
  DOCENTE: 'Docente',
  MATERIA: 'Materia',
};

const etiquetasAccion: Record<EventoAuditoria['accion'], string> = {
  ADD: 'Alta',
  MOD: 'Modificación',
  DEL: 'Baja',
};

const coloresAccion: Record<EventoAuditoria['accion'], { fondo: string; texto: string }> = {
  ADD: { fondo: 'var(--color-success-light)', texto: 'var(--color-success)' },
  MOD: { fondo: 'var(--color-info-light)', texto: 'var(--color-info)' },
  DEL: { fondo: 'var(--color-error-light)', texto: 'var(--color-error)' },
};

const etiquetasCampo: Record<string, string> = {
  id: 'Identificador',
  cuatrimestreId: 'Cuatrimestre',
  turno: 'Turno',
  anio: 'Año',
  dia: 'Día',
  comision: 'Comisión',
  materia: 'Materia',
  docente: 'Docente',
  rol: 'Rol',
  horasAsignadas: 'Horas asignadas',
  confirmado: 'Confirmado',
  nombre: 'Nombre',
  dni: 'DNI',
  email: 'Correo electrónico',
  categoriaId: 'Categoría',
  dedicacion: 'Dedicación',
  concursado: 'Concursado',
  planId: 'Plan',
  codigo: 'Código',
};

const formatearFecha = (fecha: string) => new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(fecha));

const obtenerResumen = (evento: EventoAuditoria) => {
  const estado = evento.estado;
  if (evento.entidad === 'ASIGNACION') {
    return `Comisión ${estado.comision ?? 'sin definir'} · ${estado.dia ?? 'día sin definir'} · ${estado.turno ?? 'turno sin definir'}`;
  }
  if (evento.entidad === 'ASIGNACION_DOCENTE') {
    return `${estado.materia ?? 'Materia sin identificar'} · ${estado.docente ?? 'Docente sin identificar'}`;
  }
  if (evento.entidad === 'DOCENTE') {
    return String(estado.nombre ?? `Docente #${evento.entidadId}`);
  }
  return String(estado.nombre ?? `Materia #${evento.entidadId}`);
};

const formatearValor = (valor: unknown, campo: string) => {
  if (valor == null || valor === '') return 'Sin dato';
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  if (campo === 'turno' && typeof valor === 'string' && ['manana', 'maniana'].includes(valor.trim().toLowerCase())) {
    return 'Mañana';
  }
  return String(valor);
};

function HistorialCambios() {
  const [pagina, setPagina] = useState<PaginaAuditoria | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadAuditada | ''>('');
  const [autorIngresado, setAutorIngresado] = useState('');
  const [autorFiltro, setAutorFiltro] = useState('');
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoAuditoria | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    buscarHistorialAuditoria({
      pagina: numeroPagina,
      tamanio: 20,
      entidad: entidadSeleccionada || undefined,
      autor: autorFiltro || undefined,
    })
      .then((resultado) => {
        if (activo) setPagina(resultado);
      })
      .catch((err: any) => {
        if (activo) {
          setError(err?.response?.status === 403
            ? 'No tenés permisos para consultar la auditoría.'
            : 'No se pudo cargar el historial. Intentá nuevamente.');
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => { activo = false; };
  }, [numeroPagina, entidadSeleccionada, autorFiltro]);

  const aplicarBusqueda = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setNumeroPagina(0);
    setAutorFiltro(autorIngresado.trim());
  };

  const limpiarFiltros = () => {
    setEntidadSeleccionada('');
    setAutorIngresado('');
    setAutorFiltro('');
    setNumeroPagina(0);
  };

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        <div className="page-header">
          <h1>Historial de Cambios</h1>
          <p>Movimientos ordenados del más reciente al más antiguo en asignaciones, docentes y materias</p>
        </div>

        <form className="filter-bar" onSubmit={aplicarBusqueda} style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flex: 1, flexWrap: 'wrap' }}>
            <select
              className="form-select"
              aria-label="Filtrar por tipo de registro"
              value={entidadSeleccionada}
              onChange={(e) => {
                setNumeroPagina(0);
                setEntidadSeleccionada(e.target.value as EntidadAuditada | '');
              }}
              style={{ minWidth: '220px', flex: '1 1 220px' }}
            >
              <option value="">Todos los registros</option>
              {Object.entries(etiquetasEntidad).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>{etiqueta}</option>
              ))}
            </select>
            <input
              className="form-input"
              aria-label="Filtrar por usuario"
              placeholder="Buscar por usuario..."
              value={autorIngresado}
              onChange={(e) => setAutorIngresado(e.target.value)}
              style={{ minWidth: '220px', flex: '1 1 220px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button type="submit" className="btn btn-primary">Buscar</button>
            <button type="button" className="btn btn-ghost" onClick={limpiarFiltros}>Limpiar</button>
          </div>
        </form>

        {error && (
          <div role="alert" style={{ background: 'var(--color-error-light)', color: 'var(--color-error)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            {error}
          </div>
        )}

        {cargando ? (
          <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /><p>Cargando historial...</p></div>
        ) : !error && pagina?.contenido.length === 0 ? (
          <div className="empty-state">
            <h3>No hay movimientos para mostrar</h3>
            <p>Probá quitar filtros o realizá una modificación desde el sistema.</p>
          </div>
        ) : !error && pagina && (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Fecha y hora</th>
                    <th>Usuario</th>
                    <th>Registro</th>
                    <th>Acción</th>
                    <th>Detalle</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagina.contenido.map((evento, indice) => {
                    const color = coloresAccion[evento.accion] ?? coloresAccion.MOD;
                    return (
                      <tr key={`${evento.revision}-${evento.entidad}-${evento.entidadId}-${indice}`}>
                        <td style={{ whiteSpace: 'nowrap' }}>{formatearFecha(evento.fecha)}</td>
                        <td style={{ fontWeight: 600 }}>{evento.autor}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--color-gray-800)' }}>{etiquetasEntidad[evento.entidad]}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>ID #{evento.entidadId}</div>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: color.fondo, color: color.texto }}>
                            {etiquetasAccion[evento.accion] ?? evento.accion}
                          </span>
                        </td>
                        <td>{obtenerResumen(evento)}</td>
                        <td>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEventoSeleccionado(evento)}>
                            Ver estado
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
                Página {numeroPagina + 1} · {pagina.contenido.length} movimientos
              </span>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button type="button" className="btn btn-ghost" disabled={numeroPagina === 0 || cargando} onClick={() => setNumeroPagina((actual) => Math.max(0, actual - 1))}>
                  Anterior
                </button>
                <button type="button" className="btn btn-ghost" disabled={!pagina.hayMas || cargando} onClick={() => setNumeroPagina((actual) => actual + 1)}>
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {eventoSeleccionado && (
        <Modal title={`Estado histórico · ${etiquetasEntidad[eventoSeleccionado.entidad]}`} onClose={() => setEventoSeleccionado(null)}>
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
              <span className="badge badge-secondary">{etiquetasAccion[eventoSeleccionado.accion] ?? eventoSeleccionado.accion}</span>
              <span className="badge">Revisión #{eventoSeleccionado.revision}</span>
              <span className="badge">ID #{eventoSeleccionado.entidadId}</span>
            </div>
            <p style={{ margin: 0 }}><strong>{eventoSeleccionado.autor}</strong> · {formatearFecha(eventoSeleccionado.fecha)}</p>
            <div style={{ border: '1px solid var(--color-gray-200)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden' }}>
              {Object.entries(eventoSeleccionado.estado).map(([campo, valor]) => (
                <div key={campo} style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1fr) 2fr', gap: 'var(--spacing-md)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-gray-100)' }}>
                  <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>{etiquetasCampo[campo] ?? campo}</span>
                  <strong style={{ overflowWrap: 'anywhere' }}>{formatearValor(valor, campo)}</strong>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default HistorialCambios;
