import { useEffect, useState, useMemo } from "react";
import CuatrimestreForm from "../components/Formularios/CuatrimestreForm";
import Modal from "../components/Modal";
import {
  listarCuatrimestres,
  crearCuatrimestre,
  actualizarCuatrimestre,
  eliminarCuatrimestre
} from "../api/cuatrimestreApi";
import type { Cuatrimestre } from "../types";
import { useToast } from "../context/ToastContext";

function GestionCuatrimestre() {
  const { toast, confirm } = useToast();
  const [cuatrimestres, setCuatrimestres] = useState<Cuatrimestre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cuatrimestreEditando, setCuatrimestreEditando] = useState<Cuatrimestre | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroNumero, setFiltroNumero] = useState<number | "">("" );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listarCuatrimestres();
        setCuatrimestres(res.data);
      } catch (err) {
        console.error("❌ Error al cargar cuatrimestres:", err);
        setError("No se pudieron cargar los cuatrimestres.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCrear = async (cuatrimestre: Cuatrimestre) => {
    try {
      const res = await crearCuatrimestre(cuatrimestre);
      setCuatrimestres((prev) => [...prev, res.data]);
      setMostrarFormulario(false);
      toast.success("Cuatrimestre registrado exitosamente");
    } catch (err) {
      console.error("Error al crear cuatrimestre:", err);
      toast.error("No se pudo registrar el cuatrimestre");
    }
  };

  const handleEditar = async (cuatrimestre: Cuatrimestre) => {
    if (cuatrimestre.id == null) {
      toast.error("El cuatrimestre no tiene ID asignado");
      return;
    }

    try {
      const actualizado = await actualizarCuatrimestre(cuatrimestre.id, cuatrimestre);
      setCuatrimestres((prev) =>
        prev.map((c) => (c.id === actualizado.data.id ? actualizado.data : c))
      );
      setCuatrimestreEditando(null);
      toast.success("Cuatrimestre actualizado exitosamente");
    } catch (err) {
      console.error("Error al editar cuatrimestre:", err);
      toast.error("No se pudo actualizar el cuatrimestre");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = await confirm({
      title: "Eliminar cuatrimestre",
      message: "¿Está seguro que desea eliminar este cuatrimestre? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!confirmar) return;

    try {
      await eliminarCuatrimestre(id);
      setCuatrimestres((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cuatrimestre eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar cuatrimestre:", err);
      toast.error("No se pudo eliminar el cuatrimestre");
    }
  };

  // Filtrado de cuatrimestres
  const cuatrimestresFiltrados = useMemo(() => {
    return cuatrimestres.filter((c) => 
      filtroNumero === "" || c.numeroCuatri === filtroNumero
    );
  }, [cuatrimestres, filtroNumero]);

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div className="page-header">
          <h1>Gestión de Cuatrimestres</h1>
          <p>Configure períodos académicos por año</p>
        </div>

        {/* Controles y Filtros */}
        <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
          <select value={filtroNumero} onChange={(e) => setFiltroNumero(e.target.value === "" ? "" : Number(e.target.value))} className="form-select" style={{ minWidth: '200px' }}>
            <option value="">Todos los cuatrimestres</option>
            <option value={1}>1° Cuatrimestre</option>
            <option value={2}>2° Cuatrimestre</option>
          </select>
          <button onClick={() => setMostrarFormulario(true)} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo Cuatrimestre
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
              Cargando cuatrimestres...
            </p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : cuatrimestresFiltrados.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-lg)' }}>
              {filtroNumero ? "No hay cuatrimestres con ese número" : "No hay cuatrimestres registrados"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th style={{ textAlign: 'center' }}>Número</th>
                  <th style={{ textAlign: 'center' }}>Año</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuatrimestresFiltrados.map((c, index) => (
                  <tr key={c.id ?? `sin-id-${index}`}>
                    <td style={{ fontWeight: 500, color: 'var(--color-gray-500)' }}>
                      {index + 1}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--color-info-light)',
                        color: 'var(--color-info)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.375rem 0.875rem',
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 700,
                      }}>
                        {c.numeroCuatri}° Cuatrimestre
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-gray-900)', fontSize: 'var(--font-size-lg)' }}>
                      {typeof (c as any).anio !== "undefined" ? (c as any).anio : (
                        <span style={{ fontStyle: 'italic', color: 'var(--color-gray-400)' }}>
                          No especificado
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                        justifyContent: 'center',
                      }}>
                        <button
                          onClick={() => setCuatrimestreEditando(c)}
                          className="btn btn-secondary btn-sm"
                        >
                          Editar
                        </button>
                        {c.id != null && (
                          <button
                            onClick={() => handleEliminar(c.id!)}
                            className="btn btn-danger btn-sm"
                          >
                            Eliminar
                          </button>
                        )}
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div className="stat-value">{cuatrimestres.length}</div>
              <div className="stat-label">Total Cuatrimestres</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--color-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div className="stat-value">{cuatrimestresFiltrados.length}</div>
              <div className="stat-label">Resultados Filtrados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      {mostrarFormulario && (
        <Modal onClose={() => setMostrarFormulario(false)} title="Registrar Nuevo Cuatrimestre">
          <CuatrimestreForm
            onSubmit={handleCrear}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {cuatrimestreEditando && (
        <Modal onClose={() => setCuatrimestreEditando(null)} title="Editar Cuatrimestre">
          <CuatrimestreForm
            cuatrimestreInicial={cuatrimestreEditando}
            onSubmit={handleEditar}
            onCancel={() => setCuatrimestreEditando(null)}
          />
        </Modal>
      )}
    </main>
  );
}

export default GestionCuatrimestre;