import { useEffect, useState } from 'react';
import Modal from './Modal';
import { buscarHistorialAsignacion, type EventoHistorialAsignacion } from '../api/auditoriaApi';

const entidadLabel: Record<EventoHistorialAsignacion['entidad'], string> = {
  ASIGNACION: 'Asignación',
  ASIGNACION_DOCENTE: 'Vínculo con docente',
};

const accionLabel: Record<EventoHistorialAsignacion['accion'], string> = {
  ADD: 'Creación',
  MOD: 'Modificación',
  DEL: 'Eliminación',
};

const fechaLabel = (fecha: string) => new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(fecha));

function HistorialAsignacionModal({ asignacionId, onClose }: { asignacionId: number; onClose: () => void }) {
  const [eventos, setEventos] = useState<EventoHistorialAsignacion[]>([]);
  const [pagina, setPagina] = useState(0);
  const [hayMas, setHayMas] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    buscarHistorialAsignacion(asignacionId, 0)
      .then((resultado) => {
        if (activo) {
          setEventos(resultado.contenido);
          setPagina(resultado.pagina);
          setHayMas(resultado.hayMas);
        }
      })
      .catch(() => { if (activo) setError('No se pudo cargar el historial de esta asignación.'); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [asignacionId]);

  const cargarMas = async () => {
    const paginaSiguiente = pagina + 1;
    setCargandoMas(true);
    try {
      const resultado = await buscarHistorialAsignacion(asignacionId, paginaSiguiente);
      setEventos((actuales) => [...actuales, ...resultado.contenido]);
      setPagina(resultado.pagina);
      setHayMas(resultado.hayMas);
    } catch {
      setError('No se pudo cargar más historial. Intentá nuevamente.');
    } finally {
      setCargandoMas(false);
    }
  };

  return (
    <Modal title={`Historial de Cambios · Asignación #${asignacionId}`} onClose={onClose} size="lg">
      {cargando ? (
        <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /><p>Cargando historial...</p></div>
      ) : error ? (
        <div role="alert" style={{ color: 'var(--color-error)', background: 'var(--color-error-light)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-md)' }}>{error}</div>
      ) : eventos.length === 0 ? (
        <div className="empty-state"><h3>Sin movimientos registrados</h3><p>Esta asignación todavía no tiene revisiones disponibles.</p></div>
      ) : (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {eventos.map((evento, indice) => (
            <li key={`${evento.revision}-${evento.entidad}-${indice}`} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 'var(--spacing-md)', paddingBottom: indice === eventos.length - 1 ? 0 : 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-primary)', border: '3px solid var(--color-primary-100)', flexShrink: 0, marginTop: 5 }} />
                {indice < eventos.length - 1 && <span style={{ flex: 1, width: 2, minHeight: 40, background: 'var(--color-gray-200)' }} />}
              </div>
              <article style={{ border: '1px solid var(--color-gray-200)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-md)', background: 'var(--color-white)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--color-gray-800)' }}>{accionLabel[evento.accion] ?? evento.accion} · {entidadLabel[evento.entidad] ?? evento.entidad}</strong>
                  <span className="badge">Revisión #{evento.revision}</span>
                </div>
                <div style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>
                  {fechaLabel(evento.fecha)} · <strong>{evento.autor}</strong>
                </div>
                <details style={{ marginTop: 'var(--spacing-sm)' }}>
                  <summary style={{ cursor: 'pointer', color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Ver estado de esta revisión</summary>
                  <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 2fr', gap: '8px 16px', margin: 'var(--spacing-md) 0 0', fontSize: 'var(--font-size-sm)' }}>
                    {Object.entries(evento.estado).map(([campo, valor]) => (
                      <div key={campo} style={{ display: 'contents' }}>
                        <dt style={{ color: 'var(--color-gray-500)' }}>{campo}</dt>
                        <dd style={{ margin: 0, color: 'var(--color-gray-800)', overflowWrap: 'anywhere' }}>{valor == null || valor === '' ? 'Sin dato' : typeof valor === 'boolean' ? (valor ? 'Sí' : 'No') : String(valor)}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </article>
            </li>
          ))}
        </ol>
      )}
      {!cargando && !error && eventos.length > 0 && hayMas && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button type="button" className="btn btn-secondary" onClick={cargarMas} disabled={cargandoMas}>
            {cargandoMas ? 'Cargando…' : 'Cargar más'}
          </button>
        </div>
      )}
    </Modal>
  );
}

export default HistorialAsignacionModal;
