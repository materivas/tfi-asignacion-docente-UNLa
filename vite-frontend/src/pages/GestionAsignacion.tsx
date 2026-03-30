import { useEffect, useState, useMemo } from "react";
import AsignacionForm from "../components/Formularios/AsignacionForm";
import Modal from "../components/Modal";
import {
  listarAsignaciones,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion
} from "../api/asignacionApi";
import { listarMaterias } from "../api/materiaApi";
import { listarCuatrimestres } from "../api/cuatrimestreApi";
import type { Asignacion, Materia, Cuatrimestre } from "../types";
import { useToast } from "../context/ToastContext";

const normalizarTurno = (turno: string) =>
  turno
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace("maniana", "manana");

const mostrarTurno = (turno: string) =>
  normalizarTurno(turno) === "manana" ? "Mañana" : turno;

function GestionAsignacion() {
  const { toast, confirm } = useToast();
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [cuatrimestres, setCuatrimestres] = useState<Cuatrimestre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asignacionEditando, setAsignacionEditando] = useState<Asignacion | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTurno, setFiltroTurno] = useState<string>("");
  const [filtroAnio, setFiltroAnio] = useState<number | "">("");
  const [filtroDia, setFiltroDia] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAsignaciones, resMaterias, resCuatrimestres] = await Promise.all([
          listarAsignaciones(),
          listarMaterias(),
          listarCuatrimestres()
        ]);

        setAsignaciones(resAsignaciones.data);
        setMaterias(resMaterias.data);
        setCuatrimestres(resCuatrimestres.data);
      } catch (err) {
        console.error("❌ Error al cargar asignaciones:", err);
        setError("No se pudieron cargar las asignaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditar = async (asignacion: Asignacion) => {
    if (asignacion.id == null) {
      toast.error("La asignación no tiene ID asignado");
      return;
    }

    try {
      const actualizada = await actualizarAsignacion(asignacion.id, asignacion);
      setAsignaciones((prev) =>
        prev.map((a) => (a.id === actualizada.data.id ? actualizada.data : a))
      );
      setAsignacionEditando(null);
      toast.success("Asignación actualizada exitosamente");
    } catch (err) {
      console.error("Error al editar asignación:", err);
      toast.error("No se pudo actualizar la asignación");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = await confirm({
      title: "Eliminar asignación",
      message: "¿Está seguro que desea eliminar esta asignación? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!confirmar) return;

    try {
      await eliminarAsignacion(id);
      setAsignaciones((prev) => prev.filter((a) => a.id !== id));
      toast.success("Asignación eliminada exitosamente");
    } catch (err) {
      console.error("Error al eliminar asignación:", err);
      toast.error("No se pudo eliminar la asignación");
    }
  };

  const handleCrear = async (asignacion: Asignacion) => {
    try {
      const res = await crearAsignacion(asignacion);
      setAsignaciones((prev) => [...prev, res.data]);
      setMostrarFormulario(false);
      toast.success("Asignación registrada exitosamente");
    } catch (err) {
      console.error("Error al crear asignación:", err);
      toast.error("No se pudo registrar la asignación");
    }
  };

  // Filtrado de asignaciones
  const asignacionesFiltradas = useMemo(() => {
    return asignaciones.filter((asig) => {
      const materia = materias.find((m) => m.id === asig.materiaId);
      const matchBusqueda = materia?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ?? false;
      const matchTurno =
        filtroTurno === "" || normalizarTurno(asig.turno ?? "") === normalizarTurno(filtroTurno);
      const matchAnio = filtroAnio === "" || asig.anio === filtroAnio;
      const matchDia = filtroDia === "" || asig.dia === filtroDia;
      return matchBusqueda && matchTurno && matchAnio && matchDia;
    });
  }, [asignaciones, materias, busqueda, filtroTurno, filtroAnio, filtroDia]);

  // Turnos y días disponibles
  const turnosDisponibles = ["Mañana", "Tarde", "Noche"];
  const diasDisponibles = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  const aniosDisponibles = useMemo(() => {
    const anios = new Set(asignaciones.map(a => a.anio).filter(Boolean));
    return Array.from(anios).sort();
  }, [asignaciones]);

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div className="page-header">
          <h1>Gestión de Asignaciones</h1>
          <p>Administre asignaciones de materias por cuatrimestre, turno y horarios</p>
        </div>

        {/* Controles y Filtros */}
        <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flex: 1, flexWrap: 'wrap' }}>
            <input type="text" placeholder="Buscar por materia..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="form-input" style={{ minWidth: '220px', flex: 1 }} />
            <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)} className="form-select" style={{ minWidth: '150px' }}>
              <option value="">Todos los turnos</option>
              {turnosDisponibles.map((turno) => (<option key={turno} value={turno}>{turno}</option>))}
            </select>
              <select
                value={filtroDia}
                onChange={(e) => setFiltroDia(e.target.value)}
                className="form-select"
                style={{ minWidth: '150px' }}
              >
                <option value="">Todos los días</option>
                {diasDisponibles.map((dia) => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>
              <select
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-select"
                style={{ minWidth: '120px' }}
              >
                <option value="">Todos los años</option>
                {aniosDisponibles.map((anio) => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
          <button onClick={() => setMostrarFormulario(true)} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva Asignación
          </button>
        </div>

        {/* Tabla de Asignaciones */}
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
              Cargando asignaciones...
            </p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : asignacionesFiltradas.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-lg)' }}>
              {busqueda || filtroTurno || filtroAnio || filtroDia ? "No se encontraron asignaciones con los filtros aplicados" : "No hay asignaciones registradas"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Materia</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Cuatrimestre</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>Año</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Turno</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Día</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>Código</th>
                  <th style={{ textAlign: 'center', width: '150px' }}>Comisión</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignacionesFiltradas.map((asig, index) => {
                  const materia = materias.find((m) => m.id === asig.materiaId);
                  const cuatri = cuatrimestres.find((c) => c.id === asig.cuatrimestreId);
                  return (
                    <tr key={asig.id}>
                      <td style={{ fontWeight: 500, color: 'var(--color-gray-500)' }}>
                        {index + 1}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                        {materia?.nombre ?? "Materia desconocida"}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          backgroundColor: 'var(--color-info-light)',
                          color: 'var(--color-info)',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '0.25rem 0.625rem',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 600,
                        }}>
                          {cuatri?.numeroCuatri ?? "?"}°
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                        {asig.anio ?? "?"}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-secondary">
                          {mostrarTurno(asig.turno ?? "")}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 500, color: 'var(--color-gray-700)' }}>
                        {asig.dia ?? "?"}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-gray-900)' }}>
                        <span style={{
                          display: 'inline-block',
                          backgroundColor: 'var(--color-secondary)',
                          color: 'var(--color-white)',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '0.25rem 0.5rem',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 600,
                        }}>
                          {materia?.codigo ?? "—"}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                        <span style={{
                          display: 'inline-block',
                          backgroundColor: '#7c3aed',
                          color: 'var(--color-white)',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '0.25rem 0.5rem',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 600,
                        }}>
                          {asig.comision ?? "—"}
                        </span>
                      </td>
                      <td>
                        <div style={{
                          display: 'flex',
                          gap: 'var(--spacing-sm)',
                          justifyContent: 'center',
                        }}>
                          <button
                            onClick={() => setAsignacionEditando(asig)}
                            className="btn btn-secondary btn-sm"
                            title="Editar asignación"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => asig.id != null && handleEliminar(asig.id)}
                            className="btn btn-danger btn-sm"
                            title="Eliminar asignación"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Estadísticas */}
        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
              <div className="stat-value">{asignaciones.length}</div>
              <div className="stat-label">Total Asignaciones</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--color-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div className="stat-value">{asignacionesFiltradas.length}</div>
              <div className="stat-label">Resultados Filtrados</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: 'var(--color-success)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div>
              <div className="stat-value">{new Set(asignaciones.map(a => a.materiaId)).size}</div>
              <div className="stat-label">Materias Asignadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      {mostrarFormulario && (
        <Modal onClose={() => setMostrarFormulario(false)} title="Registrar Nueva Asignación">
          <AsignacionForm
            materias={materias}
            cuatrimestres={cuatrimestres}
            onSubmit={handleCrear}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {asignacionEditando && (
        <Modal onClose={() => setAsignacionEditando(null)} title="Editar Asignación">
          <AsignacionForm
            materias={materias}
            cuatrimestres={cuatrimestres}
            AsignacionInicial={asignacionEditando}
            onSubmit={handleEditar}
            onCancel={() => setAsignacionEditando(null)}
          />
        </Modal>
      )}
    </main>
  );
}

export default GestionAsignacion;
