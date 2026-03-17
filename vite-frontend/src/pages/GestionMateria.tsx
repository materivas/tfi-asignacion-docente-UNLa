import { useEffect, useState } from "react";
import MateriaForm from "../components/Formularios/MateriaForm";
import Modal from "../components/Modal";
import {
  listarMaterias,
  actualizarMateria,
  eliminarMateria,
  crearMateria,
  importarMateriasExcel
} from "../api/materiaApi";
import { listarPlanes } from "../api/planApi";
import { descargarTemplateMateria } from "../utils/excelTemplates";
import type { Materia, Plan } from "../types";
import { useToast } from "../context/ToastContext";

function GestionMateria() {
  const { toast, confirm } = useToast();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [planesMap, setPlanesMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPlan, setFiltroPlan] = useState<number | "">("");
  const [filtroAnio, setFiltroAnio] = useState<number | "">("");  const [importando, setImportando] = useState(false);
  const [resultadoImport, setResultadoImport] = useState<{ creados: number; ignorados: number; errores: string[] } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMaterias, resPlanes] = await Promise.all([
          listarMaterias(),
          listarPlanes()
        ]);

        setMaterias(resMaterias.data);

        const map = new Map<number, string>();
        resPlanes.data.forEach((plan: Plan) => {
          if (plan.id != null) {
            map.set(plan.id, plan.nombre);
          }
        });
        setPlanesMap(map);
      } catch (err) {
        console.error("❌ Error al cargar materias o planes:", err);
        setError("No se pudieron cargar las materias o los planes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditar = async (materia: Materia) => {
    if (materia.id == null) {
      toast.error("La materia no tiene ID asignado");
      return;
    }

    try {
      const actualizada = await actualizarMateria(materia.id, materia);
      setMaterias((prev) =>
        prev.map((m) => (m.id === actualizada.data.id ? actualizada.data : m))
      );
      setMateriaEditando(null);
      toast.success("Materia actualizada exitosamente");
    } catch (err) {
      console.error("❌ Error al editar materia:", err);
      toast.error("No se pudo actualizar la materia");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = await confirm({
      title: "Eliminar materia",
      message: "¿Está seguro que desea eliminar esta materia? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!confirmar) return;

    try {
      await eliminarMateria(id);
      setMaterias((prev) => prev.filter((m) => m.id !== id));
      toast.success("Materia eliminada exitosamente");
    } catch (err) {
      console.error("❌ Error al eliminar materia:", err);
      toast.error("No se pudo eliminar la materia");
    }
  };

  const handleCrear = async (materia: Materia) => {
    try {
      const res = await crearMateria(materia);
      setMaterias((prev) => [...prev, res.data]);
      setMostrarFormulario(false);
      toast.success("Materia registrada exitosamente");
    } catch (err) {
      console.error("❌ Error al crear materia:", err);
      toast.error("No se pudo registrar la materia");
    }
  };

  // Filtrado de materias
  const materiasFiltradas = materias.filter((mat) => {
    const matchBusqueda = mat.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchPlan = filtroPlan === "" || mat.planId === filtroPlan;
    const matchAnio = filtroAnio === "" || mat.anio === filtroAnio;
    return matchBusqueda && matchPlan && matchAnio;
  });

  // Años disponibles (1-5)
  const aniosDisponibles = [1, 2, 3, 4, 5];

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div className="page-header">
          <h1>Gestión de Materias</h1>
          <p>Administre materias organizadas por plan de estudio y año académico</p>
        </div>

        {/* Controles y Filtros */}
        <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flex: 1, flexWrap: 'wrap' }}>
            <input type="text" placeholder="Buscar materia..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="form-input" style={{ minWidth: '200px', flex: 1 }} />
            <select value={filtroPlan} onChange={(e) => setFiltroPlan(e.target.value === "" ? "" : Number(e.target.value))} className="form-select" style={{ minWidth: '180px' }}>
              <option value="">Todos los planes</option>
              {Array.from(planesMap.entries()).map(([id, nombre]) => (<option key={id} value={id}>{nombre}</option>))}
            </select>
            <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value === "" ? "" : Number(e.target.value))} className="form-select" style={{ minWidth: '150px' }}>
              <option value="">Todos los años</option>
              {aniosDisponibles.map((anio) => (<option key={anio} value={anio}>{anio}° Año</option>))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            <button onClick={() => setMostrarFormulario(true)} className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nueva Materia
            </button>
            <button onClick={() => descargarTemplateMateria(planesMap)} className="btn btn-ghost" title="Descargar template para importar materias">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="12 7 12 19"/><polyline points="7 14 12 19 17 14"/></svg>
              Template
            </button>
            <label className="btn btn-ghost" style={{ cursor: importando ? 'not-allowed' : 'pointer', opacity: importando ? 0.6 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {importando ? 'Importando…' : 'Importar'}
              <input type="file" accept=".xlsx,.xls" style={{ display: 'none' }} disabled={importando} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImportando(true);
                setResultadoImport(null);
                try {
                  const res = await importarMateriasExcel(file);
                  setResultadoImport(res);
                  const resMaterias = await listarMaterias();
                  setMaterias(resMaterias.data);
                } catch (err) {
                  console.error('Error al importar materias:', err);
                  toast.error('Error al importar el archivo Excel');
                } finally {
                  setImportando(false);
                  e.target.value = '';
                }
              }} />
            </label>
          </div>
        </div>

        {/* Resultado de importación */}
        {resultadoImport && (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            position: 'relative'
          }}>
            <button
              onClick={() => setResultadoImport(null)}
              style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}
            >✕</button>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#065f46' }}>
              Resultado de la importación
            </h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: resultadoImport.filasIgnoradas?.length ? 12 : 0 }}>
              <span style={{ fontWeight: 600, color: '#065f46' }}>✓ Creados: {resultadoImport.creados}</span>
              <span style={{ fontWeight: 600, color: '#92400e' }}>⊘ Ignorados: {resultadoImport.ignorados}</span>
            </div>
            {resultadoImport.filasIgnoradas?.length > 0 && (
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#92400e', userSelect: 'none' }}>
                  Filas ignoradas ({resultadoImport.filasIgnoradas.length})
                </summary>
                <ul style={{ 
                  marginTop: 8, 
                  marginBottom: 0,
                  paddingLeft: 20,
                  fontSize: 'var(--font-size-sm)',
                  color: '#666',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {resultadoImport.filasIgnoradas.map((fila, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{fila}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* Tabla de Materias */}
        {loading ? (
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-gray-600)' }}>
              Cargando materias...
            </p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : materiasFiltradas.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-lg)' }}>
              {busqueda || filtroPlan || filtroAnio ? "No se encontraron materias con los filtros aplicados" : "No hay materias registradas"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Materia</th>
                  <th>Plan de Estudio</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>Año</th>
                  <th style={{ textAlign: 'center', width: '150px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {materiasFiltradas.map((mat, index) => (
                  <tr key={mat.id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-gray-500)' }}>
                      {index + 1}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                      {mat.nombre}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {planesMap.get(mat.planId) ?? "Sin plan"}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--color-secondary)',
                        color: 'var(--color-white)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.25rem 0.5rem',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                      }}>
                        {mat.anio ?? "?"}°
                      </span>
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                        justifyContent: 'center',
                      }}>
                        <button
                          onClick={() => setMateriaEditando(mat)}
                          className="btn btn-secondary btn-sm"
                          title="Editar materia"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => mat.id != null && handleEliminar(mat.id)}
                          className="btn btn-danger btn-sm"
                          title="Eliminar materia"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Estadísticas */}
        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div>
              <div className="stat-value">{materias.length}</div>
              <div className="stat-label">Total Materias</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--color-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div className="stat-value">{materiasFiltradas.length}</div>
              <div className="stat-label">Resultados Filtrados</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: 'var(--color-success)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div>
              <div className="stat-value">{planesMap.size}</div>
              <div className="stat-label">Planes Activos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      {mostrarFormulario && (
        <Modal onClose={() => setMostrarFormulario(false)} title="Registrar Nueva Materia">
          <MateriaForm
            planes={Array.from(planesMap.entries()).map(([id, nombre]) => ({ id, nombre }))}
            onSubmit={handleCrear}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {materiaEditando && (
        <Modal onClose={() => setMateriaEditando(null)} title="Editar Materia">
          <MateriaForm
            materiaInicial={materiaEditando}
            planes={Array.from(planesMap.entries()).map(([id, nombre]) => ({ id, nombre }))}
            onSubmit={handleEditar}
            onCancel={() => setMateriaEditando(null)}
          />
        </Modal>
      )}
    </main>
  );
}

export default GestionMateria;