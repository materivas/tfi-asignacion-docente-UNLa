import { useEffect, useState } from "react";
import MateriaForm from "../components/Formularios/MateriaForm";
import Modal from "../components/Modal";
import {
  listarMaterias,
  actualizarMateria,
  eliminarMateria,
  crearMateria
} from "../api/materiaApi";
import { listarPlanes } from "../api/planApi";
import type { Materia, Plan } from "../types";

function GestionMateria() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [planesMap, setPlanesMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPlan, setFiltroPlan] = useState<number | "">("");
  const [filtroAnio, setFiltroAnio] = useState<number | "">("");

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
      alert("❌ La materia no tiene ID asignado");
      return;
    }

    try {
      const actualizada = await actualizarMateria(materia.id, materia);
      setMaterias((prev) =>
        prev.map((m) => (m.id === actualizada.data.id ? actualizada.data : m))
      );
      setMateriaEditando(null);
      alert("✅ Materia actualizada exitosamente");
    } catch (err) {
      console.error("❌ Error al editar materia:", err);
      alert("❌ No se pudo actualizar la materia");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Está seguro que desea eliminar esta materia?");
    if (!confirmar) return;

    try {
      await eliminarMateria(id);
      setMaterias((prev) => prev.filter((m) => m.id !== id));
      alert("✅ Materia eliminada exitosamente");
    } catch (err) {
      console.error("❌ Error al eliminar materia:", err);
      alert("❌ No se pudo eliminar la materia");
    }
  };

  const handleCrear = async (materia: Materia) => {
    try {
      const res = await crearMateria(materia);
      setMaterias((prev) => [...prev, res.data]);
      setMostrarFormulario(false);
      alert("✅ Materia registrada exitosamente");
    } catch (err) {
      console.error("❌ Error al crear materia:", err);
      alert("❌ No se pudo registrar la materia");
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
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}>
            Gestión de Materias
          </h1>
          <p style={{
            color: 'var(--color-gray-600)',
            margin: 0,
            fontSize: 'var(--font-size-base)',
          }}>
            Administre materias organizadas por plan de estudio y año académico
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
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flex: 1, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Buscar materia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="form-input"
                style={{ minWidth: '200px', flex: 1 }}
              />
              <select
                value={filtroPlan}
                onChange={(e) => setFiltroPlan(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-select"
                style={{ minWidth: '180px' }}
              >
                <option value="">Todos los planes</option>
                {Array.from(planesMap.entries()).map(([id, nombre]) => (
                  <option key={id} value={id}>{nombre}</option>
                ))}
              </select>
              <select
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-select"
                style={{ minWidth: '150px' }}
              >
                <option value="">Todos los años</option>
                {aniosDisponibles.map((anio) => (
                  <option key={anio} value={anio}>{anio}° Año</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="btn btn-primary"
            >
              + Nueva Materia
            </button>
          </div>
        </div>

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
              Total Materias
            </div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {materias.length}
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
              {materiasFiltradas.length}
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
              Planes Activos
            </div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-success)' }}>
              {planesMap.size}
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