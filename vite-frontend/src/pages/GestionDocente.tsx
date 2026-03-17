import { useEffect, useState } from "react";
import DocenteForm from "../components/Formularios/DocenteForm";
import Modal from "../components/Modal";
import { listarDocentes, crearDocente, eliminarDocente, actualizarDocente, importarDocentesExcel } from "../api/docenteApi";
import { listarCategorias } from "../api/categoriaApi";
import { descargarTemplateDocentes } from "../utils/excelTemplates";
import type { Docente, Categoria } from "../types";
import { useToast } from "../context/ToastContext";

function GestionDocente() {
  const { toast, confirm } = useToast();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docenteEditando, setDocenteEditando] = useState<Docente | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<number | "">("")
  const [importando, setImportando] = useState(false);
  const [resultadoImport, setResultadoImport] = useState<{ creados: number; ignorados: number; errores: string[] } | null>(null);;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDocentes, resCategorias] = await Promise.all([
          listarDocentes(),
          listarCategorias()
        ]);

        setDocentes(resDocentes);

        const map = new Map<number, string>();
        resCategorias.data.forEach((cat: Categoria) => {
          if (cat.id != null) {
            map.set(cat.id, cat.nombre);
          }
        });
        setCategoriasMap(map);
      } catch (err) {
        setError("No se pudieron cargar los docentes o las categorías.");
        console.error("❌ Error en carga:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCrear = async (docente: Docente) => {
    // Validar si ya existe un docente con el mismo DNI
    const docenteExistente = docentes.find(d => d.dni === docente.dni);
    if (docenteExistente) {
      toast.error(`Ya existe un docente con el DNI ${docente.dni}`);
      return;
    }

    try {
      const nuevo = await crearDocente(docente);
      setDocentes((prev) => [...prev, nuevo]);
      setMostrarFormulario(false);
      toast.success("Docente registrado exitosamente");
    } catch (err) {
      console.error("❌ Error al crear docente:", err);
      toast.error("No se pudo registrar el docente");
    }
  };

  const handleEditar = async (docente: Docente) => {
    if (docente.id == null) {
      toast.error("No se puede editar un docente sin ID");
      return;
    }

    // Validar si ya existe otro docente con el mismo DNI
    const docenteExistente = docentes.find(d => d.dni === docente.dni && d.id !== docente.id);
    if (docenteExistente) {
      toast.error(`Ya existe otro docente con el DNI ${docente.dni}`);
      return;
    }

    try {
      const actualizado = await actualizarDocente(docente.id, docente);
      setDocentes((prev) =>
        prev.map((d) => (d.id === actualizado.id ? actualizado : d))
      );
      setDocenteEditando(null);
      toast.success("Docente actualizado exitosamente");
    } catch (err) {
      console.error("❌ Error al editar docente:", err);
      toast.error("No se pudo actualizar el docente");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = await confirm({
      title: "Eliminar docente",
      message: "¿Está seguro que desea eliminar este docente? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!confirmar) return;

    try {
      await eliminarDocente(id);
      setDocentes((prev) => prev.filter((d) => d.id !== id));
      toast.success("Docente eliminado exitosamente");
    } catch (err) {
      console.error("❌ Error al eliminar docente:", err);
      toast.error("No se pudo eliminar el docente");
    }
  };

  // Filtrado de docentes
  const docentesFiltrados = docentes.filter((doc) => {
    const matchBusqueda = doc.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                         doc.dni.includes(busqueda);
    const matchCategoria = filtroCategoria === "" || doc.categoriaId === filtroCategoria;
    return matchBusqueda && matchCategoria;
  });

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div className="page-header">
          <h1>Gestión de Docentes</h1>
          <p>Administre el registro de docentes y sus categorías académicas</p>
        </div>

        {/* Controles y Filtros */}
        <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flex: 1, flexWrap: 'wrap' }}>
            <input type="text" placeholder="Buscar por nombre o DNI..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="form-input" style={{ minWidth: '250px', flex: 1 }} />
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value === "" ? "" : Number(e.target.value))} className="form-select" style={{ minWidth: '200px' }}>
              <option value="">Todas las categorías</option>
              {Array.from(categoriasMap.entries()).map(([id, nombre]) => (
                <option key={id} value={id}>{nombre}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            <button onClick={() => setMostrarFormulario(true)} className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nuevo Docente
            </button>
            <button onClick={() => descargarTemplateDocentes(categoriasMap)} className="btn btn-ghost" title="Descargar template para importar docentes">
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
                  const res = await importarDocentesExcel(file);
                  setResultadoImport(res);
                  const resDocentes = await listarDocentes();
                  setDocentes(resDocentes);
                } catch (err) {
                  console.error('Error al importar docentes:', err);
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

        {/* Tabla de Docentes */}
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
              Cargando docentes...
            </p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : docentesFiltrados.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-lg)' }}>
              {busqueda || filtroCategoria ? "No se encontraron docentes con los filtros aplicados" : "No hay docentes registrados"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Categoría</th>
                  <th style={{ textAlign: 'center', width: '150px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentesFiltrados.map((doc, index) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-gray-500)' }}>
                      {index + 1}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                      {doc.nombre}
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>
                      {doc.dni}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {categoriasMap.get(doc.categoriaId ?? -1) ?? "Sin categoría"}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                        justifyContent: 'center',
                      }}>
                        <button
                          onClick={() => setDocenteEditando(doc)}
                          className="btn btn-secondary btn-sm"
                          title="Editar docente"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => doc.id != null && handleEliminar(doc.id)}
                          className="btn btn-danger btn-sm"
                          title="Eliminar docente"
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div>
              <div className="stat-value">{docentes.length}</div>
              <div className="stat-label">Total Docentes</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--color-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div className="stat-value">{docentesFiltrados.length}</div>
              <div className="stat-label">Resultados Filtrados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      {mostrarFormulario && (
        <Modal onClose={() => setMostrarFormulario(false)} title="Registrar Nuevo Docente">
          <DocenteForm
            onSubmit={handleCrear}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {docenteEditando && (
        <Modal onClose={() => setDocenteEditando(null)} title="Editar Docente">
          <DocenteForm
            docenteInicial={docenteEditando}
            onSubmit={handleEditar}
            onCancel={() => setDocenteEditando(null)}
          />
        </Modal>
      )}
    </main>
  );
}

export default GestionDocente;
