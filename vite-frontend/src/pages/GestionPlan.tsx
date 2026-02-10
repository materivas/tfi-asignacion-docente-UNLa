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

function GestionPlan() {
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
      alert("Plan registrado exitosamente");
    } catch (err) {
      console.error("Error al crear plan:", err);
      alert("No se pudo registrar el plan");
    }
  };

  const handleEditar = async (plan: Plan) => {
    if (plan.id == null) {
      alert("No se puede editar un plan sin ID");
      return;
    }
    try {
      const res = await actualizarPlan(plan.id, plan);
      setPlanes((prev) => prev.map((p) => (p.id === res.data.id ? res.data : p)));
      setPlanEditando(null);
      alert("Plan actualizado exitosamente");
    } catch (err) {
      console.error("Error al editar plan:", err);
      alert("No se pudo actualizar el plan");
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id == null) {
      alert("No se puede eliminar un plan sin ID");
      return;
    }
    const confirmar = window.confirm("¿Está seguro que desea eliminar este plan?");
    if (!confirmar) return;

    try {
      await eliminarPlan(id);
      setPlanes((prev) => prev.filter((p) => p.id !== id));
      alert("Plan eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar plan:", err);
      alert("No se pudo eliminar el plan");
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
            Planes de Estudio
          </h1>
          <p style={{
            color: 'var(--color-gray-600)',
            margin: 0,
            fontSize: 'var(--font-size-base)',
          }}>
            Administre planes académicos y ciclos formativos
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
              placeholder="Buscar plan por nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="form-input"
              style={{ minWidth: '300px', flex: 1 }}
            />
            <button
              onClick={() => setMostrarFormulario(true)}
              className="btn btn-primary"
            >
              + Nuevo Plan
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
              Total Planes
            </div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {planes.length}
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
              {planesFiltrados.length}
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