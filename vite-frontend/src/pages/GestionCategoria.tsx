import { useEffect, useState, useMemo } from "react";
import CategoriaForm from "../components/Formularios/CategoriaForm";
import Modal from "../components/Modal";
import type { Categoria } from "../types";
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from "../api/categoriaApi";
import { useToast } from "../context/ToastContext";

function GestionCategoria() {
  const { toast, confirm } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await listarCategorias();
        setCategorias(res.data);
      } catch (err) {
        setError("No se pudieron cargar las categorías.");
        console.error("❌ Error al listar categorías:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleCrear = async (categoria: Categoria) => {
    try {
      const res = await crearCategoria({
        nombre: categoria.nombre,
        maxMaterias: categoria.maxMaterias
      });
      setCategorias((prev) => [...prev, res.data]);
      setMostrarFormulario(false);
      toast.success("Categoría registrada exitosamente");
    } catch (err) {
      console.error("Error al crear categoría:", err);
      toast.error("No se pudo registrar la categoría");
    }
  };

  const handleEditar = async (categoria: Categoria) => {
    if (categoria.id == null) {
      toast.error("No se puede editar una categoría sin ID");
      return;
    }

    try {
      const res = await actualizarCategoria(categoria.id, categoria);
      setCategorias((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
      setCategoriaEditando(null);
      toast.success("Categoría actualizada exitosamente");
    } catch (err) {
      console.error("Error al editar categoría:", err);
      toast.error("No se pudo actualizar la categoría");
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id == null) {
      toast.error("No se puede eliminar una categoría sin ID");
      return;
    }

    const confirmar = await confirm({
      title: "Eliminar categoría",
      message: "¿Está seguro que desea eliminar esta categoría? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!confirmar) return;

    try {
      await eliminarCategoria(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoría eliminada exitosamente");
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      toast.error("No se pudo eliminar la categoría");
    }
  };

  // Filtrado de categorías
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((cat) => 
      cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [categorias, busqueda]);

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div className="page-header">
          <h1>Categorías Docentes</h1>
          <p>Administre categorías académicas y carga horaria permitida</p>
        </div>

        {/* Controles y Filtros */}
        <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
          <input type="text" placeholder="Buscar categoría..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="form-input" style={{ minWidth: '250px', flex: 1 }} />
          <button onClick={() => setMostrarFormulario(true)} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva Categoría
          </button>
        </div>

        {/* Tabla */}
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
              Cargando categorías...
            </p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : categoriasFiltradas.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-lg)' }}>
              {busqueda ? "No se encontraron categorías" : "No hay categorías registradas"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Categoría</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>Máx. Materias</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoriasFiltradas.map((cat, index) => (
                  <tr key={cat.id ?? `sin-id-${index}`}>
                    <td style={{ fontWeight: 500, color: 'var(--color-gray-500)' }}>
                      {index + 1}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                      {cat.nombre}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--color-success-light)',
                        color: 'var(--color-success)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.25rem 0.75rem',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                      }}>
                        {cat.maxMaterias}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                        justifyContent: 'center',
                      }}>
                        <button
                          onClick={() => setCategoriaEditando(cat)}
                          className="btn btn-secondary btn-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(cat.id)}
                          className="btn btn-danger btn-sm"
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <div>
              <div className="stat-value">{categorias.length}</div>
              <div className="stat-label">Total Categorías</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--color-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div className="stat-value">{categoriasFiltradas.length}</div>
              <div className="stat-label">Resultados Filtrados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      {mostrarFormulario && (
        <Modal onClose={() => setMostrarFormulario(false)} title="Registrar Nueva Categoría">
          <CategoriaForm
            onSubmit={handleCrear}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {categoriaEditando && (
        <Modal onClose={() => setCategoriaEditando(null)} title="Editar Categoría">
          <CategoriaForm
            categoriaInicial={categoriaEditando}
            onSubmit={handleEditar}
            onCancel={() => setCategoriaEditando(null)}
          />
        </Modal>
      )}
    </main>
  );
}

export default GestionCategoria;