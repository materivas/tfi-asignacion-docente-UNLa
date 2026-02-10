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

function GestionCategoria() {
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
      alert("Categoría registrada exitosamente");
    } catch (err) {
      console.error("Error al crear categoría:", err);
      alert("No se pudo registrar la categoría");
    }
  };

  const handleEditar = async (categoria: Categoria) => {
    if (categoria.id == null) {
      alert("No se puede editar una categoría sin ID");
      return;
    }

    try {
      const res = await actualizarCategoria(categoria.id, categoria);
      setCategorias((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
      setCategoriaEditando(null);
      alert("Categoría actualizada exitosamente");
    } catch (err) {
      console.error("Error al editar categoría:", err);
      alert("No se pudo actualizar la categoría");
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id == null) {
      alert("No se puede eliminar una categoría sin ID");
      return;
    }

    const confirmar = window.confirm("¿Está seguro que desea eliminar esta categoría?");
    if (!confirmar) return;

    try {
      await eliminarCategoria(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      alert("Categoría eliminada exitosamente");
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      alert("No se pudo eliminar la categoría");
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
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-xl)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h1 style={{
            fontSize: 'var(--font-size-3xl)',
            color: 'var(--color-primary)',
            margin: 0,
            marginBottom: 'var(--spacing-sm)',
          }}>
            Categorías Docentes
          </h1>
          <p style={{
            color: 'var(--color-gray-600)',
            margin: 0,
            fontSize: 'var(--font-size-base)',
          }}>
            Administre categorías académicas y carga horaria permitida
          </p>
        </div>

        {/* Controles y Filtros */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="form-input"
              style={{ minWidth: '250px', flex: 1 }}
            />
            <button
              onClick={() => setMostrarFormulario(true)}
              className="btn btn-primary"
            >
              + Nueva Categoría
            </button>
          </div>
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
        <div style={{
          marginTop: 'var(--spacing-lg)',
          display: 'flex',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap',
        }}>
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            boxShadow: 'var(--shadow-sm)',
            flex: 1,
            minWidth: '200px',
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
              Total Categorías
            </div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {categorias.length}
            </div>
          </div>
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            boxShadow: 'var(--shadow-sm)',
            flex: 1,
            minWidth: '200px',
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
              Resultados Filtrados
            </div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-secondary)' }}>
              {categoriasFiltradas.length}
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