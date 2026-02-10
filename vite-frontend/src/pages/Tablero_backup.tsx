import { useEffect, useMemo, useRef, useState } from "react";
import type { Asignacion, Materia, AsignacionDocente, Categoria, Docente, Rol } from "../types";
import { listarAsignaciones, actualizarAsignacion } from "../api/asignacionApi";
import { listarMaterias } from "../api/materiaApi";
import { listarAsignacionesDocentes, crearAsignacionDocente, eliminarAsignacionDocente, actualizarAsignacionDocente } from "../api/asignacionDocenteApi";
import { listarCategorias } from "../api/categoriaApi";
import { listarDocentes } from "../api/docenteApi";
import { listarCuatrimestres } from "../api/cuatrimestreApi";
import { listarRoles } from "../api/rolApi";
import Modal from "src/components/Modal";

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const turnos = ["Maniana", "Tarde", "Noche"];
const anios = [1, 2, 3, 4, 5];

interface Warning {
  id: string;
  type: 'error' | 'warning' | 'info';
  docenteId: number;
  docenteNombre: string;
  message: string;
  carga: number;
  maxCarga: number;
}

function Tablero() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [asignacionesDocentes, setAsignacionesDocentes] = useState<AsignacionDocente[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<Map<number, Categoria>>(new Map());
  const [docentesLookup, setDocentesLookup] = useState<Map<number, Docente>>(new Map());
  const [cuatrimestresMap, setCuatrimestresMap] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAsignacionId, setSelectedAsignacionId] = useState<number | null>(null);
  const [selectedDocenteId, setSelectedDocenteId] = useState<string>("");
  const [rolesMap, setRolesMap] = useState<Map<number, string>>(new Map());
  const [selectedRolId, setSelectedRolId] = useState<number | "">("");
  const [busquedaDocente, setBusquedaDocente] = useState<string>("");
  const [editandoAsignacionDocenteId, setEditandoAsignacionDocenteId] = useState<number | null>(null);
  
  // Filtros
  const [filtroCuatrimestre, setFiltroCuatrimestre] = useState<number | "">(""); 
  const [filtroAnioAsignacion, setFiltroAnioAsignacion] = useState<number | "">(2025);
  const [filtroTurno, setFiltroTurno] = useState<string | "">("");

  // Drag & Drop state
  const [draggedItem, setDraggedItem] = useState<{
    asignacionDocenteId: number;
    docenteId: number;
    docenteNombre: string;
    rolId: number;
    fromAsignacionId: number;
  } | null>(null);

  // Warnings panel
  const [showWarnings, setShowWarnings] = useState(true);

  const docentesFiltrados = Array.from(docentesLookup.values()).filter((d) =>
    d.nombre.toLowerCase().includes(busquedaDocente.toLowerCase())
  );

  const fetchData = async () => {
    setRefreshing(true);
    try {
      setLoading(true);
      const [resAsignaciones, resMaterias, resAsignacionesDocentes, resCategorias, resDocentes, resCuatrimestres, resRoles] = await Promise.all([
        listarAsignaciones(),
        listarMaterias(),
        listarAsignacionesDocentes(),
        listarCategorias(),
        listarDocentes(),
        listarCuatrimestres(),
        listarRoles()
      ]);

      const asignacionesArray: Asignacion[] = Array.isArray(resAsignaciones) ? resAsignaciones : (resAsignaciones as any)?.data ?? [];
      const materiasArray: Materia[] = Array.isArray(resMaterias) ? resMaterias : (resMaterias as any)?.data ?? [];
      const asignacionesDocentesArray: AsignacionDocente[] = Array.isArray(resAsignacionesDocentes)
        ? resAsignacionesDocentes
        : (resAsignacionesDocentes as any)?.data ?? [];

      setAsignaciones(asignacionesArray);
      setMaterias(materiasArray);
      setAsignacionesDocentes(asignacionesDocentesArray);

      const rolesArray: Rol[] = Array.isArray(resRoles) ? resRoles : (resRoles as any)?.data ?? [];
      const mapRoles = new Map<number, string>();
      rolesArray.forEach((r) => { if (r?.id != null) mapRoles.set(r.id, r.nombre); });
      setRolesMap(mapRoles);
      console.log("rolesMap cargado:", mapRoles);


      // fetchData: después de listarCategorias()
      const categoriasArray: Categoria[] = Array.isArray(resCategorias)
        ? resCategorias
        : (resCategorias as any)?.data ?? [];

      const mapCat = new Map<number, Categoria>();
      categoriasArray.forEach((c) => {
        if (c?.id != null) mapCat.set(c.id, c); // guardamos el objeto
      });
      setCategoriasMap(mapCat);

      const resDocentesSafe: unknown = resDocentes;
      const docentesArray: Docente[] = Array.isArray(resDocentesSafe)
        ? (resDocentesSafe as Docente[])
        : ((resDocentesSafe as any)?.data ?? (resDocentesSafe as any)) || [];

      const mapDoc = new Map<number, Docente>();
      docentesArray.forEach((d) => { if (d?.id != null) mapDoc.set(d.id, d); });
      setDocentesLookup(mapDoc);

      // procesar cuatrimestres: esperamos objetos con { id, numero_cuatri }
      const cuatArray: any[] = Array.isArray(resCuatrimestres) ? resCuatrimestres : (resCuatrimestres as any)?.data ?? [];
      const cuatMap = new Map<number, number>();
      cuatArray.forEach((c) => {
        const id = c?.id;
        const num = c?.numero_cuatri ?? c?.numeroCuatri ?? c?.numero_cuatrimestre ?? null;
        if (id != null && num != null) cuatMap.set(Number(id), Number(num));
      });
      setCuatrimestresMap(cuatMap);
    } catch (err) {
      console.error("❌ Error al cargar el tablero:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => { void fetchData(); }, []);
  
  // Calcular warnings basados en límites de categorías
  const warnings = useMemo<Warning[]>(() => {
    const warns: Warning[] = [];
    const anoFiltro = filtroAnioAsignacion === "" ? null : Number(filtroAnioAsignacion);

    const docenteCargaMap = new Map<number, number>();
    
    asignaciones.forEach((a) => {
      if (anoFiltro != null && a.anio !== anoFiltro) return;

      const docs = (a.id != null ? getAsignacionesDocentes(a.id) : [])
        .filter((ad) => ad.confirmado === true);

      docs.forEach((ad) => {
        docenteCargaMap.set(ad.docenteId, (docenteCargaMap.get(ad.docenteId) || 0) + 1);
      });
    });

    docenteCargaMap.forEach((carga, docenteId) => {
      const docente = docentesLookup.get(docenteId);
      if (!docente) return;

      const categoria = docente.categoriaId ? categoriasMap.get(docente.categoriaId) : undefined;
      if (!categoria) return;

      const max = Number(categoria.maxMaterias);
      
      if (carga > max + 1) {
        warns.push({
          id: `error-${docenteId}`,
          type: 'error',
          docenteId,
          docenteNombre: docente.nombre,
          message: `${docente.nombre} excede el límite en ${carga - max} materia(s)`,
          carga,
          maxCarga: max
        });
      } else if (carga === max + 1 || carga === max) {
        warns.push({
          id: `ok-${docenteId}`,
          type: 'info',
          docenteId,
          docenteNombre: docente.nombre,
          message: `${docente.nombre} está en el límite correcto`,
          carga,
          maxCarga: max
        });
      } else if (carga < max) {
        warns.push({
          id: `warning-${docenteId}`,
          type: 'warning',
          docenteId,
          docenteNombre: docente.nombre,
          message: `${docente.nombre} está por debajo del límite en ${max - carga} materia(s)`,
          carga,
          maxCarga: max
        });
      }
    });

    return warns.sort((a, b) => {
      const typeOrder = { error: 0, warning: 1, info: 2 };
      if (a.type !== b.type) return typeOrder[a.type] - typeOrder[b.type];
      return a.docenteNombre.localeCompare(b.docenteNombre);
    });
  }, [asignaciones, asignacionesDocentes, docentesLookup, categoriasMap, filtroAnioAsignacion]);

  const abrirModal = (asignacionId: number) => {
    if (asignacionId == null) return;
    setSelectedAsignacionId(asignacionId);

    const firstDocente = Array.from(docentesLookup.values())[0]?.id;
    const firstRol = Array.from(rolesMap.keys())[0];

    setSelectedDocenteId(firstDocente != null ? String(firstDocente) : "");
    setSelectedRolId(firstRol ?? "");
    setEditandoAsignacionDocenteId(null);
    setBusquedaDocente("");
    setShowModal(true);

  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedAsignacionId(null);
    setSelectedDocenteId("");
    setSelectedRolId("");
    setEditandoAsignacionDocenteId(null);
  };

  const confirmarAsignacionDocente = async () => {
    if (selectedAsignacionId == null || selectedDocenteId === "" || selectedRolId === "") {
      alert("Seleccioná asignación, docente y rol.");
      return;
    }
    if (!rolesMap.has(Number(selectedRolId))) {
      alert("El rol seleccionado no existe en el backend.");
      return;
    }

    const payloadCrear = {
      asignacionId: selectedAsignacionId!,
      docenteId: Number(selectedDocenteId),
      docenteNombre: "",
      rolId: Number(selectedRolId),
      horasAsignadas: 1,
      confirmado: true
    };
    // payload para edición (solo campos editables)
    const payloadEditar = {
      id: editandoAsignacionDocenteId!,
      asignacionId: selectedAsignacionId!,
      docenteId: Number(selectedDocenteId),
      docenteNombre: "", // o el nombre real si lo tenés
      rolId: Number(selectedRolId),
      horasAsignadas: 1, // o el valor real
      confirmado: true

    };


    try {


      if (editandoAsignacionDocenteId) {
        console.log("PUT actualizarAsignacionDocente payload:", payloadEditar);
        await actualizarAsignacionDocente(editandoAsignacionDocenteId, payloadEditar);
      } else {
        console.log("POST crearAsignacionDocente payload:", payloadCrear);
        await crearAsignacionDocente(payloadCrear as any);
      }
      await fetchData();
      cerrarModal();
    } catch (err: any) {

      console.error("❌ Error al guardar asignación_docente:", err?.response?.status, err?.response?.data ?? err);
      alert(`Error al guardar: ${err?.response?.data?.message ?? err?.message}`);
    }

  };

  const getMateria = (id: number) => materias.find((m) => m.id === id);
  const getAsignacionesDocentes = (asignacionId: number) =>
    asignacionId != null ? asignacionesDocentes.filter((ad) => ad.asignacionId === asignacionId) : [];


  const getColorPorCarga = (docenteId: number, fallbackRolId?: number | null) => {
    const cantidad = calcularCargaDocente(docenteId);
    const docente = docentesLookup.get(docenteId);
    const categoriaId = docente?.categoriaId ?? fallbackRolId;
    const categoria = categoriaId != null ? categoriasMap.get(categoriaId) : undefined;

    if (!categoria) return "#94a3b8"; // gris

    const max = Number(categoria.maxMaterias);

    if (cantidad === max || cantidad === max + 1) return "#10b981"; // verde - OK
    if (cantidad > max + 1) return "#ef4444"; // rojo - exceso
    return "#f59e0b"; // amarillo - por debajo
  };
  
  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, asignacionDocenteId: number, docenteId: number, docenteNombre: string, rolId: number, fromAsignacionId: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem({ asignacionDocenteId, docenteId, docenteNombre, rolId, fromAsignacionId });
    
    // Visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetAsignacionId: number) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.fromAsignacionId === targetAsignacionId) {
      setDraggedItem(null);
      return;
    }

    try {
      // Eliminar de la asignación original
      await eliminarAsignacionDocente(draggedItem.asignacionDocenteId);
      
      // Crear en la nueva asignación
      await crearAsignacionDocente({
        asignacionId: targetAsignacionId,
        docenteId: draggedItem.docenteId,
        docenteNombre: draggedItem.docenteNombre,
        rolId: draggedItem.rolId,
        horasAsignadas: 1,
        confirmado: true
      } as any);

      await fetchData();
      setDraggedItem(null);
    } catch (err: any) {
      console.error("❌ Error al mover asignación:", err);
      alert(`Error al mover: ${err?.response?.data?.message ?? err?.message}`);
      setDraggedItem(null);
    }
  };
  
  const extraerNumeroCuatrimestre = (a: Asignacion): number | null => {
    const maybe = a as any;
    const cand =
      maybe.cuatrimestre?.numero_cuatri ??
      maybe.cuatrimestre?.numeroCuatri ??
      maybe.cuatrimestre?.numero_cuatrimestre ??
      maybe.numero_cuatri ??
      maybe.numeroCuatri ??
      null;

    if (cand != null) {
      const n = Number(cand);
      if (!Number.isNaN(n)) return n;
    }

    const cid = maybe.cuatrimestreId ?? maybe.cuatrimestre_id;
    if (cid != null) {
      const mapped = cuatrimestresMap.get(Number(cid));
      if (mapped != null) return mapped;
    }
    return null;
  };
  const getAsignacionesPorDiaTurnoAnio = (dia: string, turno: string, anio: number) =>
    asignaciones
      .filter((a) => {
        if (filtroCuatrimestre !== "") {
          const nro = extraerNumeroCuatrimestre(a);
          if (nro == null) return false;
          if (nro !== Number(filtroCuatrimestre)) return false;
        }

        if (filtroAnioAsignacion !== "" && a.anio !== filtroAnioAsignacion) return false;
        if (filtroTurno && a.turno !== filtroTurno) return false;
        const materia = getMateria(a.materiaId);
        if (!materia) return false;
        if (materia.anio !== anio) return false;
        return a.dia === dia && a.turno === turno;
      })
      .sort((a, b) => {
        const nombreA = getMateria(a.materiaId)?.nombre ?? "";
        const nombreB = getMateria(b.materiaId)?.nombre ?? "";
        return nombreA.localeCompare(nombreB);
      });

  const docentePasaFiltrosGlobales = (d: AsignacionDocente) => {
    return true; // Simplificado para el nuevo diseño
  };

  const docentesCargaMap = useMemo(() => {
    const m = new Map<number, number>();
    const anoFiltro = filtroAnioAsignacion === "" ? null : Number(filtroAnioAsignacion);

    asignaciones.forEach((a) => {
      if (anoFiltro != null && a.anio !== anoFiltro) return;

      const materia = getMateria(a.materiaId);
      if (!materia) return;

      const docs = (a.id != null ? getAsignacionesDocentes(a.id) : [])
        .filter((ad) => ad.confirmado === true)
        .filter(docentePasaFiltrosGlobales);

      docs.forEach((ad) => {
        m.set(ad.docenteId, (m.get(ad.docenteId) || 0) + 1);
      });
    });

    return m;
  }, [
    asignaciones,
    asignacionesDocentes,
    filtroAnioAsignacion
  ]);

  const calcularCargaDocente = (docenteId: number) => {
    return docentesCargaMap.get(docenteId) || 0;
  };

  // cuatrimestresDisponibles ahora construye la lista de numeros encontrados en el mapa o en asignaciones
  const cuatrimestresDisponibles = useMemo(() => {
    const s = new Set<number>();
    // preferir el mapa de cuatrimestres traído
    if (cuatrimestresMap.size > 0) {
      cuatrimestresMap.forEach((num) => s.add(num));
    } else {
      asignaciones.forEach((a) => {
        const n = extraerNumeroCuatrimestre(a);
        if (n != null) s.add(n);
      });
    }
    if (s.size === 0) { s.add(1); s.add(2); }
    return Array.from(s).sort((x, y) => x - y);
  }, [cuatrimestresMap, asignaciones]);

  const aniosAsignacionDisponibles = useMemo(() => {
    const s = new Set<number>();
    asignaciones.forEach((a) => { if (typeof a.anio === "number") s.add(a.anio); });
    if (!s.has(2025)) s.add(2025);
    return Array.from(s).sort((x, y) => x - y);
  }, [asignaciones]);

  const materiasDisponibles = useMemo(() => materias.map((m) => m.nombre).filter(Boolean), [materias]);

  const resetFiltros = () => {
    setFiltroCuatrimestre("");
    setFiltroAnioAsignacion(2025);
    setFiltroTurno("");
  };

  const filtrosActivos = useMemo(() => {
    let c = 0;
    if (filtroCuatrimestre !== "") c++;
    if (filtroAnioAsignacion !== "") c++;
    if (filtroTurno !== "") c++;
    return c;
  }, [filtroCuatrimestre, filtroAnioAsignacion, filtroTurno]);

  const borrarAsignacionDocente = async (id: number) => {
    if (!id) return;
    if (!window.confirm("¿Seguro que querés eliminar esta asignación de docente?")) return;

    try {
      await eliminarAsignacionDocente(id);
      console.log("✅ Asignación docente eliminada:", id);
      await fetchData(); // refresca el tablero
    } catch (err: any) {
      console.error("❌ Error al eliminar asignación_docente:", err?.response?.data ?? err);
      alert(`Error al eliminar: ${err?.response?.data?.message ?? err?.message}`);
    }
  };


  // Docente seleccionado desde el dropdown del modal
  const selectedDocenteObj = selectedDocenteId
    ? docentesLookup.get(Number(selectedDocenteId))
    : null;
  const selectedDocenteCategoriaId =
    selectedDocenteObj?.categoriaId != null ? selectedDocenteObj.categoriaId : null;

  const selectedDocenteCategoriaNombre =
    selectedDocenteCategoriaId != null
      ? (categoriasMap.get(selectedDocenteCategoriaId)?.nombre ?? "")
      : "";


  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)', padding: '2rem', minHeight: '100vh' }}>
      <style>{`
        .field { 
          height: 42px; 
          border-radius: 8px; 
          border: 1px solid #e2e8f0; 
          padding: 0 14px; 
          background: #fff; 
          transition: all .2s;
          font-size: 14px;
        }
        .field:focus-visible { 
          outline: none; 
          border-color: var(--color-primary); 
          box-shadow: 0 0 0 3px rgba(122,31,31,0.1); 
        }
        .select { 
          appearance: none; 
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-position: right 12px center;
          background-repeat: no-repeat;
          padding-right: 36px;
        }
        .assignment-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .assignment-card:hover {
          box-shadow: 0 8px 16px rgba(122,31,31,0.12);
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }
        .teacher-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .teacher-chip:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .status-empty {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .status-assigned {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }
        .filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #eff6ff;
          color: #1e40af;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 600;
        }
        .day-column {
          min-width: 320px;
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
        }
        .day-header {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-primary);
          padding: 12px 16px;
          background: #fff;
          border-radius: 8px;
          margin-bottom: 16px;
          text-align: center;
          border: 2px solid #fce7e7;
        }
        .assignments-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .empty-slot {
          padding: 32px;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
          font-style: italic;
        }
      `}</style>

      {/* Header Section */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: 'var(--color-primary)',
            margin: 0,
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Tablero de Asignaciones
          </h1>
          <p style={{
            color: 'var(--color-gray-600)',
            margin: 0,
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Gestión integral de docentes por materia, turno y cuatrimestre
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
      }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ 
            fontSize: 16, 
            fontWeight: 700, 
            color: '#1e293b', 
            margin: 0,
            marginBottom: 4
          }}>
            Filtros de búsqueda
          </h3>
          <p style={{ 
            fontSize: 13, 
            color: '#64748b', 
            margin: 0 
          }}>
            Personaliza la vista según tus necesidades
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: 16,
          marginBottom: 16
        }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: 13, 
              fontWeight: 600, 
              color: "#475569", 
              marginBottom: 8,
              letterSpacing: '0.3px'
            }}>
              Cuatrimestre
            </label>
            <select 
              className="field select" 
              value={filtroCuatrimestre} 
              onChange={(e) => setFiltroCuatrimestre(e.target.value === "" ? "" : Number(e.target.value))}
            >
              <option value="">Todos</option>
              {cuatrimestresDisponibles.map((c) => <option key={c} value={c}>Cuatrimestre {c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: 13, 
              fontWeight: 600, 
              color: "#475569", 
              marginBottom: 8,
              letterSpacing: '0.3px'
            }}>
              Año de asignación
            </label>
            <select 
              className="field select" 
              value={filtroAnioAsignacion} 
              onChange={(e) => setFiltroAnioAsignacion(e.target.value === "" ? "" : Number(e.target.value))}
            >
              <option value="">Todos</option>
              {aniosAsignacionDisponibles.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: 13, 
              fontWeight: 600, 
              color: "#475569", 
              marginBottom: 8,
              letterSpacing: '0.3px'
            }}>
              Materia
            </label>
            <input 
              className="field" 
              placeholder="Buscar materia..." 
              value={filtroMateria} 
              onChange={(e) => setFiltroMateria(e.target.value)} 
              list="materias-list" 
            />
            <datalist id="materias-list">
              {materiasDisponibles.map((m) => <option key={m} value={m} />)}
            </datalist>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: 13, 
              fontWeight: 600, 
              color: "#475569", 
              marginBottom: 8,
              letterSpacing: '0.3px'
            }}>
              Docente
            </label>
            <input
              className="field"
              placeholder="Buscar docente..."
              value={filtroDocente}
              onChange={(e) => setFiltroDocente(e.target.value)}
              list="docentes-list"
            />
            <datalist id="docentes-list">
              {Array.from(docentesLookup.values()).map((d) => (
                <option key={d.id} value={d.nombre} />
              ))}
            </datalist>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: 13, 
              fontWeight: 600, 
              color: "#475569", 
              marginBottom: 8,
              letterSpacing: '0.3px'
            }}>
              Categoría
            </label>
            <select
              className="field select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value === "" ? "" : Number(e.target.value))}
            >
              <option value="">Todas</option>
              {Array.from(categoriasMap.entries()).map(([id, categoria]) => (
                <option key={id} value={id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: 13, 
              fontWeight: 600, 
              color: "#475569", 
              marginBottom: 8,
              letterSpacing: '0.3px'
            }}>
              Turno
            </label>
            <select 
              className="field select" 
              value={filtroTurno} 
              onChange={(e) => setFiltroTurno(e.target.value === "" ? "" : e.target.value)}
            >
              <option value="">Todos</option>
              {turnos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginTop: 20,
          paddingTop: 20,
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {filtrosActivos > 0 && (
              <div className="filter-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {filtrosActivos} filtro{filtrosActivos > 1 ? "s" : ""} activo{filtrosActivos > 1 ? "s" : ""}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={resetFiltros} 
              className="btn btn-secondary"
              style={{ height: 42 }}
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => { void fetchData(); }}
              disabled={refreshing}
              className="btn btn-primary"
              style={{ height: 42 }}
            >
              {refreshing ? "Actualizando..." : "Actualizar datos"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: '3rem',
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-600)' }}>
            Cargando asignaciones...
          </div>
        </div>
      ) : (
        <>
          {/* View by Year and Shift */}
          {anios.map((anio) =>
            turnos.map((turno) => {
              const hasAssignments = diasSemana.some(dia => 
                getAsignacionesPorDiaTurnoAnio(dia, turno, anio).length > 0
              );
              
              if (!hasAssignments) return null;

              return (
                <div key={`${anio}-${turno}`} style={{ marginBottom: 32 }}>
                  {/* Section Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #5a1414 100%)',
                    borderRadius: '12px 12px 0 0',
                    padding: '20px 24px',
                    marginBottom: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#fff'
                      }}>
                        {anio}°
                      </div>
                      <div>
                        <h2 style={{
                          margin: 0,
                          fontSize: 22,
                          fontWeight: 700,
                          color: '#fff',
                          letterSpacing: '-0.3px'
                        }}>
                          {anio}° Año · Turno {turno}
                        </h2>
                        <p style={{
                          margin: 0,
                          marginTop: 4,
                          fontSize: 14,
                          color: 'rgba(255,255,255,0.85)'
                        }}>
                          Asignaciones por día de la semana
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Days Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 16,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    padding: 24
                  }}>
                    {diasSemana.map((dia) => {
                      const asignacionesDelDia = getAsignacionesPorDiaTurnoAnio(dia, turno, anio);
                      
                      return (
                        <div key={dia} className="day-column">
                          <div className="day-header">{dia}</div>
                          
                          {asignacionesDelDia.length === 0 ? (
                            <div className="empty-slot">
                              Sin asignaciones
                            </div>
                          ) : (
                            <div className="assignments-grid">
                              {asignacionesDelDia.map((a) => {
                                const materia = getMateria(a.materiaId);
                                const docentes = (a.id != null ? getAsignacionesDocentes(a.id) : [])
                                  .filter(docentePasaFiltrosGlobales)
                                  .slice()
                                  .sort((d1, d2) => {
                                    const rolA = d1.rolId != null ? (rolesMap.get(d1.rolId) ?? "") : "";
                                    const rolB = d2.rolId != null ? (rolesMap.get(d2.rolId) ?? "") : "";
                                    const byRolDesc = rolB.localeCompare(rolA);
                                    if (byRolDesc !== 0) return byRolDesc;
                                    const nombreA = (docentesLookup.get(d1.docenteId)?.nombre ?? d1.docenteNombre ?? "").toLowerCase();
                                    const nombreB = (docentesLookup.get(d2.docenteId)?.nombre ?? d2.docenteNombre ?? "").toLowerCase();
                                    return nombreA.localeCompare(nombreB);
                                  });

                                return (
                                  <div key={a.id ?? Math.random()} className="assignment-card">
                                    {/* Subject Header */}
                                    <div style={{ 
                                      marginBottom: 16,
                                      paddingBottom: 16,
                                      borderBottom: '1px solid #f1f5f9'
                                    }}>
                                      <h3 style={{
                                        margin: 0,
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        marginBottom: 6
                                      }}>
                                        {materia?.nombre ?? "Materia desconocida"}
                                      </h3>
                                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        {materia?.anio && (
                                          <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: '4px 10px',
                                            background: '#fef2f2',
                                            color: 'var(--color-primary)',
                                            borderRadius: '12px',
                                            fontSize: 12,
                                            fontWeight: 700,
                                            border: '1px solid #fecaca'
                                          }}>
                                            {materia.anio}° año
                                          </span>
                                        )}
                                        {docentes.length < 2 && (
                                          <button
                                            onClick={() => a.id && abrirModal(a.id)}
                                            disabled={!a.id}
                                            style={{
                                              marginLeft: 'auto',
                                              padding: '6px 12px',
                                              background: 'var(--color-primary)',
                                              color: '#fff',
                                              border: 'none',
                                              borderRadius: '8px',
                                              fontSize: 13,
                                              fontWeight: 600,
                                              cursor: a.id ? 'pointer' : 'not-allowed',
                                              opacity: a.id ? 1 : 0.5,
                                              transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => a.id && (e.currentTarget.style.background = '#5a1414')}
                                            onMouseLeave={(e) => a.id && (e.currentTarget.style.background = 'var(--color-primary)')}
                                          >
                                            + Asignar
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Teachers List */}
                                    {docentes.length === 0 ? (
                                      <div className="status-badge status-empty">
                                        Sin docente asignado
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {docentes.map((d) => {
                                          const docenteReal = docentesLookup.get(d.docenteId);
                                          const nombreReal = docenteReal?.nombre ?? d.docenteNombre ?? "Docente";
                                          const rolNombre = d.rolId != null ? (rolesMap.get(d.rolId) ?? "") : "";
                                          const color = getColorPorCarga(d.docenteId, d.rolId);
                                          const carga = calcularCargaDocente(d.docenteId);

                                          return (
                                            <div key={d.id} className="teacher-chip">
                                              <div style={{
                                                width: 8,
                                                height: 36,
                                                background: color,
                                                borderRadius: 4,
                                                flexShrink: 0
                                              }} />
                                              <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                  fontSize: 14,
                                                  fontWeight: 700,
                                                  color: '#1e293b',
                                                  marginBottom: 2,
                                                  whiteSpace: 'nowrap',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis'
                                                }}>
                                                  {nombreReal}
                                                </div>
                                                <div style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 8,
                                                  fontSize: 12,
                                                  color: '#64748b'
                                                }}>
                                                  <span style={{
                                                    padding: '2px 8px',
                                                    background: '#e0f2fe',
                                                    color: '#0369a1',
                                                    borderRadius: '10px',
                                                    fontWeight: 600
                                                  }}>
                                                    {rolNombre || "Sin rol"}
                                                  </span>
                                                  <span>•</span>
                                                  <span style={{ fontWeight: 600 }}>{carga} asign.</span>
                                                </div>
                                              </div>
                                              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                                <button
                                                  onClick={() => {
                                                    setSelectedAsignacionId(d.asignacionId);
                                                    setSelectedDocenteId(String(d.docenteId));
                                                    setSelectedRolId(d.rolId ?? "");
                                                    setEditandoAsignacionDocenteId(d.id!);
                                                    setShowModal(true);
                                                  }}
                                                  style={{
                                                    width: 32,
                                                    height: 32,
                                                    padding: 0,
                                                    background: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                  }}
                                                  onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#f8fafc';
                                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                                  }}
                                                  onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = '#fff';
                                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                                  }}
                                                  title="Editar"
                                                >
                                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9Z" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                  </svg>
                                                </button>
                                                <button
                                                  onClick={() => borrarAsignacionDocente(d.id!)}
                                                  style={{
                                                    width: 32,
                                                    height: 32,
                                                    padding: 0,
                                                    background: '#fff',
                                                    border: '1px solid #fecaca',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                  }}
                                                  onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#fef2f2';
                                                    e.currentTarget.style.borderColor = '#f87171';
                                                  }}
                                                  onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = '#fff';
                                                    e.currentTarget.style.borderColor = '#fecaca';
                                                  }}
                                                  title="Eliminar"
                                                >
                                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                  </svg>
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </>
      )}

      {/* Modal for Assigning Teachers */}
      {showModal && (
        <Modal onClose={cerrarModal} title="Asignar docente" size="medium">

            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 20,
              padding: '8px 0'
            }}>
              <div>
                <label style={{ 
                  fontSize: 14, 
                  fontWeight: 700, 
                  color: 'var(--color-gray-700)',
                  marginBottom: 8,
                  display: 'block'
                }}>
                  Docente
                </label>
              <input
                type="text"
                className="field"
                placeholder="Buscar docente..."
                value={busquedaDocente}
                onChange={(e) => setBusquedaDocente(e.target.value)}
                style={{ marginBottom: 6 }}
              />
              <select
                className="field select"
                value={selectedDocenteId}
                onChange={(e) => setSelectedDocenteId(e.target.value)}
              >
                <option value="">Seleccioná un docente…</option>
                {docentesFiltrados
                  .slice()
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((d) => {
                    const categoriaNombre = d.categoriaId
                      ? categoriasMap.get(d.categoriaId)?.nombre ?? ""
                      : "";
                    return (
                      <option key={d.id} value={String(d.id)}>
                        {d.nombre}{categoriaNombre ? ` — ${categoriaNombre}` : ""}
                      </option>
                    );
                  })}
              </select>
              {/* Categoría del docente seleccionado */}
              {selectedDocenteObj && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 8,
                    padding: '12px',
                    background: '#f8fafb',
                    borderRadius: '10px',
                    border: '1px solid #e5e9ed'
                  }}
                >
                  <span style={{ color: "#374151", fontWeight: 600, fontSize: 14 }}>Categoría:</span>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "var(--color-primary)",
                      fontWeight: 700,
                      fontSize: 14
                    }}
                  >
                    {selectedDocenteCategoriaNombre || "Sin categoría"}
                  </span>
                </div>
              )}
            </div>

              <div>
              <label style={{ 
                fontSize: 14, 
                fontWeight: 700, 
                color: 'var(--color-gray-700)',
                marginBottom: 8,
                display: 'block'
              }}>
                Rol
              </label>
              <select
                className="field select"
                value={selectedRolId}
                onChange={(e) => setSelectedRolId(e.target.value === "" ? "" : Number(e.target.value))}
              >
                {rolesMap.size === 0
                  ? <option value="">Cargando roles…</option>
                  : Array.from(rolesMap.entries()).map(([id, nombre]) => (
                    <option key={id} value={id}>{nombre}</option>
                  ))
                }
              </select>
            </div>

              <div style={{ 
                display: "flex", 
                gap: 12, 
                marginTop: 24,
                paddingTop: 20,
                borderTop: '1px solid #e5e9ed'
              }}>
                <button 
                  onClick={cerrarModal}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAsignacionDocente}
                  disabled={selectedAsignacionId == null || selectedDocenteId === "" || selectedRolId === ""}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {editandoAsignacionDocenteId ? "Actualizar asignación" : "Asignar docente"}
                </button>
              </div>
            </div>

          </Modal>
        )
      }
    </main >
  );
}

export default Tablero;