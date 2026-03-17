import { useEffect, useState, useMemo } from "react";
import PlanForm from "../components/Formularios/PlanForm";
import Modal from "../components/Modal";
import type { Plan } from "../types";
import {
  crearPlan,
  actualizarPlan,
  eliminarPlan,
  listarPlanes
} from "../api/planApi";
import { useToast } from "../context/ToastContext";

function GestionPlan() {
  const { toast, confirm } = useToast();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planEditando, setPlanEditando] = useState<Plan | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await listarPlanes();
        setPlanes(res.data);
      } catch (err) {
        console.error("❌ Error al cargar planes:", err);
        setError("No se pudieron cargar los planes académicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, []);

  const handleCrear = async (plan: Plan) => {
    try {
      const res = await crearPlan({ nombre: plan.nombre, descripcion: plan.descripcion });
      setPlanes((prev) => [...prev, res.data]);
      setMostrarFormulario(false);
      toast.success("Plan registrado exitosamente");
    } catch (err) {
      console.error("Error al crear plan:", err);
      toast.error("No se pudo registrar el plan");
    }
  };

  const handleEditar = async (plan: Plan) => {
    if (plan.id == null) {
      toast.error("No se puede editar un plan sin ID");
      return;
    }
    try {
      const res = await actualizarPlan(plan.id, plan);
      setPlanes((prev) => prev.map((p) => (p.id === res.data.id ? res.data : p)));
      setPlanEditando(null);
      toast.success("Plan actualizado exitosamente");
    } catch (err) {
      console.error("Error al editar plan:", err);
      toast.error("No se pudo actualizar el plan");
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id == null) {
      toast.error("No se puede eliminar un plan sin ID");
      return;
    }
    const confirmar = await confirm({
      title: "Eliminar plan",
      message: "¿Está seguro que desea eliminar este plan? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!confirmar) return;

    try {
      await eliminarPlan(id);
      setPlanes((prev) => prev.filter((p) => p.id !== id));
      toast.success("Plan eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar plan:", err);
      toast.error("No se pudo eliminar el plan");
    }
  };

  // Filtrado de planes
  const planesFiltrados = useMemo(() => {
    return planes.filter((plan) => 
      plan.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (plan.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ?? false)
    );
  }, [planes, busqueda]);

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div className="page-header">
          <h1>Planes de Estudio</h1>
          <p>Administre planes académicos y ciclos formativos</p>
        </div>

        {/* Controles y Filtros */}
        <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
          <input type="text" placeholder="Buscar plan por nombre o descripción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="form-input" style={{ minWidth: '300px', flex: 1 }} />
          <button onClick={() => setMostrarFormulario(true)} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo Plan
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
              Cargando planes...
            </p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : planesFiltrados.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-lg)' }}>
              {busqueda ? "No se encontraron planes" : "No hay planes registrados"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Nombre del Plan</th>
                  <th>Descripción</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {planesFiltrados.map((plan, index) => (
                  <tr key={plan.id ?? plan.nombre}>
                    <td style={{ fontWeight: 500, color: 'var(--color-gray-500)' }}>
                      {index + 1}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                      {plan.nombre}
                    </td>
                    <td style={{ color: 'var(--color-gray-700)' }}>
                      {plan.descripcion || (
                        <span style={{ fontStyle: 'italic', color: 'var(--color-gray-400)' }}>
                          Sin descripción
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
                          onClick={() => setPlanEditando(plan)}
                          className="btn btn-secondary btn-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(plan.id)}
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div>
              <div className="stat-value">{planes.length}</div>
              <div className="stat-label">Total Planes</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--color-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div className="stat-value">{planesFiltrados.length}</div>
              <div className="stat-label">Resultados Filtrados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      {mostrarFormulario && (
        <Modal onClose={() => setMostrarFormulario(false)} title="Registrar Nuevo Plan">
          <PlanForm
            onSubmit={handleCrear}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {planEditando && (
        <Modal onClose={() => setPlanEditando(null)} title="Editar Plan">
          <PlanForm
            planInicial={planEditando}
            onSubmit={handleEditar}
            onCancel={() => setPlanEditando(null)}
          />
        </Modal>
      )}
    </main>
  );
}

export default GestionPlan;