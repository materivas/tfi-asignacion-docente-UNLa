import { useEffect, useMemo, useState } from "react";
import type { Asignacion, Materia, AsignacionDocente, Categoria, Docente, Rol } from "../types";
import { listarAsignaciones, actualizarAsignacion, crearAsignacion, eliminarAsignacion, exportarCalendarioExcel } from "../api/asignacionApi";
import { listarMaterias } from "../api/materiaApi";
import { listarAsignacionesDocentes, crearAsignacionDocente, eliminarAsignacionDocente, actualizarAsignacionDocente } from "../api/asignacionDocenteApi";
import { listarCategorias } from "../api/categoriaApi";
import { listarDocentes } from "../api/docenteApi";
import { listarCuatrimestres } from "../api/cuatrimestreApi";
import { listarRoles } from "../api/rolApi";
import Modal from "src/components/Modal";

const normalizarTurno = (turno: string) =>
  turno
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace("maniana", "manana");

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const diasCortos: Record<string, string> = {
  Lunes: "LUN", Martes: "MAR", Miercoles: "MIÉ", Jueves: "JUE", Viernes: "VIE", Sabado: "SÁB"
};
const turnos = ["Mañana", "Tarde", "Noche"];
const turnoLabels: Record<string, string> = { Maniana: "Mañana", Tarde: "Tarde", Noche: "Noche" };
const turnoIcons: Record<string, string> = { Maniana: "☀️", Tarde: "🌤️", Noche: "🌙" };
const turnoColors: Record<string, string> = { Maniana: "#fbbf24", Tarde: "#fb923c", Noche: "#6366f1" };
const anios = [1, 2, 3, 4, 5];
const turnosCanonicos = ["Mañana", "Tarde", "Noche"];
const mostrarTurno = (turno: string) => normalizarTurno(turno) === "manana" ? "Mañana" : turno;
const iconoTurno = (turno: string) => normalizarTurno(turno) === "manana" ? "☀️" : turnoIcons[turno];
const colorTurno = (turno: string) => normalizarTurno(turno) === "manana" ? "#fbbf24" : turnoColors[turno];

interface Warning {
  id: string;
  type: 'error' | 'warning' | 'info';
  docenteId: number;
  docenteNombre: string;
  message: string;
  carga: number;
  maxCarga: number;
}

interface Conflicto {
  docenteId: number;
  docenteNombre: string;
  dia: string;
  turno: string;
  materias: string[];
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

  const [filtroCuatrimestre, setFiltroCuatrimestre] = useState<number | "">("");
  const [filtroAnioAsignacion, setFiltroAnioAsignacion] = useState<number | "">(2025);
  const [filtroTurno, setFiltroTurno] = useState<string | "">("");  const [filtroMateria, setFiltroMateria] = useState<string>("");
  const [filtroDocente, setFiltroDocente] = useState<string>("");
  const [selectedAnio, setSelectedAnio] = useState<number>(1);
  const [showWarnings, setShowWarnings] = useState(false);
  const [warningFilter, setWarningFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCuatrimestre, setExportCuatrimestre] = useState<number | "">("")

  // Estado para modal de nueva asignación
  const [showAddAsignacionModal, setShowAddAsignacionModal] = useState(false);
  const [addAsignacionDia, setAddAsignacionDia] = useState<string>("");
  const [addAsignacionTurno, setAddAsignacionTurno] = useState<string>("");
  const [addAsignacionMateriaId, setAddAsignacionMateriaId] = useState<number | "">("");
  const [addAsignacionCuatrimestreId, setAddAsignacionCuatrimestreId] = useState<number | "">("");

  const [draggedItem, setDraggedItem] = useState<{
    asignacionDocenteId: number;
    docenteId: number;
    docenteNombre: string;
    rolId: number;
    fromAsignacionId: number;
  } | null>(null);

  const [draggedAsignacion, setDraggedAsignacion] = useState<{
    asignacionId: number;
    fromDia: string;
    fromTurno: string;
  } | null>(null);

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

      const categoriasArray: Categoria[] = Array.isArray(resCategorias)
        ? resCategorias
        : (resCategorias as any)?.data ?? [];

      const mapCat = new Map<number, Categoria>();
      categoriasArray.forEach((c) => {
        if (c?.id != null) mapCat.set(c.id, c);
      });
      setCategoriasMap(mapCat);

      const resDocentesSafe: unknown = resDocentes;
      const docentesArray: Docente[] = Array.isArray(resDocentesSafe)
        ? (resDocentesSafe as Docente[])
        : ((resDocentesSafe as any)?.data ?? (resDocentesSafe as any)) || [];

      const mapDoc = new Map<number, Docente>();
      docentesArray.forEach((d) => { if (d?.id != null) mapDoc.set(d.id, d); });
      setDocentesLookup(mapDoc);

      const cuatArray: any[] = Array.isArray(resCuatrimestres) ? resCuatrimestres : (resCuatrimestres as any)?.data ?? [];
      const cuatMap = new Map<number, number>();
      cuatArray.forEach((c) => {
        const id = c?.id;
        const num = c?.numero_cuatri ?? c?.numeroCuatri ?? c?.numero_cuatrimestre ?? null;
        if (id != null && num != null) cuatMap.set(Number(id), Number(num));
      });
      setCuatrimestresMap(cuatMap);
    } catch (err) {
      console.error("Error al cargar el tablero:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => { void fetchData(); }, []);

  const getMateria = (id: number) => materias.find((m) => m.id === id);
  const getAsignacionesDocentes = (asignacionId: number) =>
    asignacionId != null ? asignacionesDocentes.filter((ad) => ad.asignacionId === asignacionId) : [];

  /* ──── Advertencias de carga ──── */
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
        warns.push({ id: `error-${docenteId}`, type: 'error', docenteId, docenteNombre: docente.nombre,
          message: `${docente.nombre} excede el límite en ${carga - max} materia(s)`, carga, maxCarga: max });
      } else if (carga === max + 1 || carga === max) {
        warns.push({ id: `ok-${docenteId}`, type: 'info', docenteId, docenteNombre: docente.nombre,
          message: `${docente.nombre} está en el límite correcto`, carga, maxCarga: max });
      } else if (carga < max) {
        warns.push({ id: `warning-${docenteId}`, type: 'warning', docenteId, docenteNombre: docente.nombre,
          message: `${docente.nombre} está por debajo del límite en ${max - carga} materia(s)`, carga, maxCarga: max });
      }
    });

    return warns.sort((a, b) => {
      const typeOrder = { error: 0, warning: 1, info: 2 };
      if (a.type !== b.type) return typeOrder[a.type] - typeOrder[b.type];
      return a.docenteNombre.localeCompare(b.docenteNombre);
    });
  }, [asignaciones, asignacionesDocentes, docentesLookup, categoriasMap, filtroAnioAsignacion]);

  /* ──── Conflictos de superposición horaria ──── */
  const conflictos = useMemo<Conflicto[]>(() => {
    const result: Conflicto[] = [];
    const anoFiltro = filtroAnioAsignacion === "" ? null : Number(filtroAnioAsignacion);
    const docenteSlots = new Map<number, Map<string, string[]>>();

    asignaciones.forEach((a) => {
      if (anoFiltro != null && a.anio !== anoFiltro) return;
      const materia = getMateria(a.materiaId);
      if (!materia) return;
      const docs = (a.id != null ? getAsignacionesDocentes(a.id) : [])
        .filter((ad) => ad.confirmado === true);
      docs.forEach((ad) => {
        if (!docenteSlots.has(ad.docenteId)) docenteSlots.set(ad.docenteId, new Map());
        const slots = docenteSlots.get(ad.docenteId)!;
        const key = `${a.dia}|${a.turno}`;
        if (!slots.has(key)) slots.set(key, []);
        slots.get(key)!.push(materia.nombre);
      });
    });

    docenteSlots.forEach((slots, docenteId) => {
      const docente = docentesLookup.get(docenteId);
      if (!docente) return;
      slots.forEach((materiaNames, key) => {
        if (materiaNames.length > 1) {
          const [dia, turno] = key.split('|');
          result.push({ docenteId, docenteNombre: docente.nombre, dia, turno, materias: materiaNames });
        }
      });
    });
    return result;
  }, [asignaciones, asignacionesDocentes, docentesLookup, materias, filtroAnioAsignacion]);

  const warningsFiltered = useMemo(() => {
    if (warningFilter === 'all') return warnings;
    return warnings.filter(w => w.type === warningFilter);
  }, [warnings, warningFilter]);

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

    const payloadEditar = {
      id: editandoAsignacionDocenteId!,
      asignacionId: selectedAsignacionId!,
      docenteId: Number(selectedDocenteId),
      docenteNombre: "",
      rolId: Number(selectedRolId),
      horasAsignadas: 1,
      confirmado: true
    };

    try {
      if (editandoAsignacionDocenteId) {
        await actualizarAsignacionDocente(editandoAsignacionDocenteId, payloadEditar);
      } else {
        await crearAsignacionDocente(payloadCrear as any);
      }
      await fetchData();
      cerrarModal();
    } catch (err: any) {
      console.error("Error al guardar asignación_docente:", err?.response?.status, err?.response?.data ?? err);
      alert(`Error al guardar: ${err?.response?.data?.message ?? err?.message}`);
    }
  };

  const getColorPorCarga = (docenteId: number, fallbackRolId?: number | null) => {
    const cantidad = calcularCargaDocente(docenteId);
    const docente = docentesLookup.get(docenteId);
    const categoriaId = docente?.categoriaId ?? fallbackRolId;
    const categoria = categoriaId != null ? categoriasMap.get(categoriaId) : undefined;
    if (!categoria) return "#94a3b8";
    const max = Number(categoria.maxMaterias);
    if (cantidad === max || cantidad === max + 1) return "#10b981";
    if (cantidad > max + 1) return "#ef4444";
    return "#f59e0b";
  };

  const handleDragStart = (e: React.DragEvent, asignacionDocenteId: number, docenteId: number, docenteNombre: string, rolId: number, fromAsignacionId: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem({ asignacionDocenteId, docenteId, docenteNombre, rolId, fromAsignacionId });
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = '1';
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
      await eliminarAsignacionDocente(draggedItem.asignacionDocenteId);
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
      console.error("Error al mover asignación:", err);
      alert(`Error al mover: ${err?.response?.data?.message ?? err?.message}`);
      setDraggedItem(null);
    }
  };

  const handleDragStartAsignacion = (e: React.DragEvent, asignacionId: number, dia: string, turno: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("asignacionId", String(asignacionId));
    setDraggedAsignacion({ asignacionId, fromDia: dia, fromTurno: turno });
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.6';
      e.currentTarget.style.borderColor = '#7A1F1F';
      e.currentTarget.style.borderWidth = '2px';
    }
  };

  const handleDragEndAsignacion = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.borderColor = 'transparent';
      e.currentTarget.style.borderWidth = '1px';
    }
    setDraggedAsignacion(null);
  };

  const handleDropAsignacion = async (e: React.DragEvent, toDia: string, toTurno: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedAsignacion) {
      setDraggedAsignacion(null);
      return;
    }

    const { asignacionId, fromDia, fromTurno } = draggedAsignacion;

    // Si es la misma celda, no hacer nada
    if (fromDia === toDia && fromTurno === toTurno) {
      setDraggedAsignacion(null);
      return;
    }

    try {
      // Obtener la asignación original
      const asignacion = asignaciones.find(a => a.id === asignacionId);
      if (!asignacion) {
        alert("Asignación no encontrada");
        setDraggedAsignacion(null);
        return;
      }

      // Actualizar la asignación con el nuevo día y turno
      const updatedAsignacion: Asignacion = {
        ...asignacion,
        dia: toDia,
        turno: toTurno
      };

      await actualizarAsignacion(asignacionId, updatedAsignacion);
      await fetchData();
      setDraggedAsignacion(null);
    } catch (err: any) {
      console.error("Error al mover materia:", err);
      alert(`Error al mover: ${err?.response?.data?.message ?? err?.message}`);
      setDraggedAsignacion(null);
    }
  };

  const handleDragOverAsignacion = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.background = '#fef7f7';
      e.currentTarget.style.borderColor = '#7A1F1F';
      e.currentTarget.style.borderStyle = 'dashed';
    }
  };

  const handleDragLeaveAsignacion = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.background = '#fff';
      e.currentTarget.style.borderColor = '#f1f5f9';
      e.currentTarget.style.borderStyle = 'solid';
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
    if (cand != null) { const n = Number(cand); if (!Number.isNaN(n)) return n; }
    const cid = maybe.cuatrimestreId ?? maybe.cuatrimestre_id;
    if (cid != null) { const mapped = cuatrimestresMap.get(Number(cid)); if (mapped != null) return mapped; }
    return null;
  };

  const getAsignacionesPorDiaTurnoAnio = (dia: string, turno: string, anio: number) =>
    asignaciones
      .filter((a) => {
        if (filtroCuatrimestre !== "") { const nro = extraerNumeroCuatrimestre(a); if (nro == null || nro !== Number(filtroCuatrimestre)) return false; }
        if (filtroAnioAsignacion !== "" && a.anio !== filtroAnioAsignacion) return false;
        if (filtroTurno && normalizarTurno(a.turno ?? "") !== normalizarTurno(filtroTurno)) return false;
        const materia = getMateria(a.materiaId);
        if (!materia || materia.anio !== anio) return false;
        if (filtroMateria && !materia.nombre.toLowerCase().includes(filtroMateria.toLowerCase())) return false;
        if (filtroDocente) {
          const docs = (a.id != null ? getAsignacionesDocentes(a.id) : []).filter((ad) => ad.confirmado === true);
          const hasDocente = docs.some((ad) => {
            const docenteReal = docentesLookup.get(ad.docenteId);
            return docenteReal?.nombre.toLowerCase().includes(filtroDocente.toLowerCase());
          });
          if (!hasDocente) return false;
        }
        return a.dia === dia && normalizarTurno(a.turno ?? "") === normalizarTurno(turno);
      })
      .sort((a, b) => (getMateria(a.materiaId)?.nombre ?? "").localeCompare(getMateria(b.materiaId)?.nombre ?? ""));

  const docentesCargaMap = useMemo(() => {
    const m = new Map<number, number>();
    const anoFiltro = filtroAnioAsignacion === "" ? null : Number(filtroAnioAsignacion);
    asignaciones.forEach((a) => {
      if (anoFiltro != null && a.anio !== anoFiltro) return;
      const materia = getMateria(a.materiaId);
      if (!materia) return;
      const docs = (a.id != null ? getAsignacionesDocentes(a.id) : []).filter((ad) => ad.confirmado === true);
      docs.forEach((ad) => { m.set(ad.docenteId, (m.get(ad.docenteId) || 0) + 1); });
    });
    return m;
  }, [asignaciones, asignacionesDocentes, filtroAnioAsignacion]);

  const calcularCargaDocente = (docenteId: number) => docentesCargaMap.get(docenteId) || 0;

  const cuatrimestresDisponibles = useMemo(() => {
    const s = new Set<number>();
    if (cuatrimestresMap.size > 0) { cuatrimestresMap.forEach((num) => s.add(num)); }
    else { asignaciones.forEach((a) => { const n = extraerNumeroCuatrimestre(a); if (n != null) s.add(n); }); }
    if (s.size === 0) { s.add(1); s.add(2); }
    return Array.from(s).sort((x, y) => x - y);
  }, [cuatrimestresMap, asignaciones]);

  const aniosAsignacionDisponibles = useMemo(() => {
    const s = new Set<number>();
    asignaciones.forEach((a) => { if (typeof a.anio === "number") s.add(a.anio); });
    if (!s.has(2025)) s.add(2025);
    return Array.from(s).sort((x, y) => x - y);
  }, [asignaciones]);

  const resetFiltros = () => { setFiltroCuatrimestre(""); setFiltroAnioAsignacion(2025); setFiltroTurno(""); setFiltroMateria(""); setFiltroDocente(""); };

  /* ──── Crear nueva asignación ──── */
  const abrirAddAsignacionModal = (dia: string, turno: string) => {
    setAddAsignacionDia(dia);
    setAddAsignacionTurno(turno);
    setAddAsignacionMateriaId("");
    // Pre-seleccionar cuatrimestre si hay filtro activo
    const cuatEntries = Array.from(cuatrimestresMap.entries());
    if (filtroCuatrimestre !== "") {
      const found = cuatEntries.find(([, num]) => num === Number(filtroCuatrimestre));
      setAddAsignacionCuatrimestreId(found ? found[0] : "");
    } else {
      setAddAsignacionCuatrimestreId(cuatEntries.length > 0 ? cuatEntries[0][0] : "");
    }
    setShowAddAsignacionModal(true);
  };

  const confirmarAddAsignacion = async () => {
    if (addAsignacionMateriaId === "" || addAsignacionCuatrimestreId === "") {
      alert("Seleccioná una materia y un cuatrimestre.");
      return;
    }
    try {
      await crearAsignacion({
        materiaId: Number(addAsignacionMateriaId),
        cuatrimestreId: Number(addAsignacionCuatrimestreId),
        turno: addAsignacionTurno,
        anio: filtroAnioAsignacion !== "" ? Number(filtroAnioAsignacion) : new Date().getFullYear(),
        dia: addAsignacionDia,
      });
      await fetchData();
      setShowAddAsignacionModal(false);
    } catch (err: any) {
      console.error("Error al crear asignación:", err);
      alert(`Error al crear: ${err?.response?.data?.message ?? err?.message}`);
    }
  };

  /* ──── Eliminar asignación completa ──── */
  const borrarAsignacion = async (id: number) => {
    if (!id) return;
    if (!window.confirm("¿Seguro que querés eliminar esta asignación completa (materia + docentes asignados)?")) return;
    try {
      await eliminarAsignacion(id);
      await fetchData();
    } catch (err: any) {
      console.error("Error al eliminar asignación:", err?.response?.data ?? err);
      alert(`Error al eliminar: ${err?.response?.data?.message ?? err?.message}`);
    }
  };

  // Materias filtradas por año seleccionado para el modal de agregar
  const materiasParaAgregar = useMemo(() => {
    return materias.filter(m => m.anio === selectedAnio).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [materias, selectedAnio]);

  /* ──── Stats rápidos ──── */
  const stats = useMemo(() => {
    const docentesConAsig = new Set<number>();
    const materiasConAsig = new Set<number>();
    let totalAsignaciones = 0;
    const anoFiltro = filtroAnioAsignacion === "" ? null : Number(filtroAnioAsignacion);
    asignaciones.forEach((a) => {
      if (anoFiltro != null && a.anio !== anoFiltro) return;
      if (a.id == null) return;
      totalAsignaciones++;
      materiasConAsig.add(a.materiaId);
      const docs = getAsignacionesDocentes(a.id).filter(ad => ad.confirmado);
      docs.forEach(ad => docentesConAsig.add(ad.docenteId));
    });
    const sinDocente = asignaciones.filter(a => {
      if (anoFiltro != null && a.anio !== anoFiltro) return false;
      if (a.id == null) return false;
      return getAsignacionesDocentes(a.id).filter(ad => ad.confirmado).length === 0;
    }).length;
    return { docentesActivos: docentesConAsig.size, materiasActivas: materiasConAsig.size, totalAsignaciones, sinDocente };
  }, [asignaciones, asignacionesDocentes, filtroAnioAsignacion]);

  /* ──── Años que tienen datos ──── */
  const aniosConDatos = useMemo(() => {
    const s = new Set<number>();
    asignaciones.forEach((a) => {
      if (filtroAnioAsignacion !== "" && a.anio !== filtroAnioAsignacion) return;
      const materia = getMateria(a.materiaId);
      if (materia) s.add(materia.anio);
    });
    return anios.filter(y => s.has(y));
  }, [asignaciones, materias, filtroAnioAsignacion]);

  useEffect(() => {
    if (aniosConDatos.length > 0 && !aniosConDatos.includes(selectedAnio)) setSelectedAnio(aniosConDatos[0]);
  }, [aniosConDatos]);

  const borrarAsignacionDocente = async (id: number) => {
    if (!id) return;
    if (!window.confirm("¿Seguro que querés eliminar esta asignación de docente?")) return;
    try {
      await eliminarAsignacionDocente(id);
      await fetchData();
    } catch (err: any) {
      console.error("Error al eliminar asignación_docente:", err?.response?.data ?? err);
      alert(`Error al eliminar: ${err?.response?.data?.message ?? err?.message}`);
    }
  };

  const turnosVisibles = useMemo(() => {
    if (filtroTurno) return [filtroTurno];
    return turnosCanonicos;
  }, [filtroTurno]);

  const errCount = warnings.filter(w => w.type === 'error').length;
  const warnCount = warnings.filter(w => w.type === 'warning').length;
  const okCount = warnings.filter(w => w.type === 'info').length;

  const handleExportExcel = async () => {
    if (exportCuatrimestre === "") {
      alert("Seleccioná un cuatrimestre para exportar");
      return;
    }
    setExporting(true);
    try {
      await exportarCalendarioExcel(
        filtroAnioAsignacion,
        exportCuatrimestre
      );
      setShowExportModal(false);
    } catch (err) {
      console.error("Error al exportar Excel:", err);
      alert("Error al exportar el calendario a Excel");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)', minHeight: '100vh' }}>
      <style>{`
        .cal-grid { display: grid; grid-template-columns: 100px repeat(6, 1fr); gap: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); background: #fff; }
        .cal-day-header { background: linear-gradient(135deg, var(--color-primary) 0%, #5a1414 100%); color: #fff; font-weight: 700; font-size: 13px; text-align: center; padding: 14px 6px; letter-spacing: 0.5px; border-right: 1px solid rgba(255,255,255,0.15); }
        .cal-day-header:last-child { border-right: none; }
        .cal-turno-label { background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 12px 8px; font-weight: 700; font-size: 12px; color: var(--color-gray-700); border-bottom: 1px solid #e2e8f0; border-right: 2px solid #e2e8f0; min-height: 140px; position: sticky; left: 0; z-index: 5; }
        .cal-cell { background: #fff; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; padding: 8px; min-height: 140px; transition: all 0.15s ease; overflow-y: auto; }
        .cal-cell:hover { background: #fafbfd; }
        .cal-cell.drag-target { background: #fffbeb; border: 2px dashed #f59e0b; }
        .cal-corner { background: linear-gradient(135deg, var(--color-primary) 0%, #5a1414 100%); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; }
        .materia-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 10px; margin-bottom: 6px; transition: all 0.15s; cursor: move; user-select: none; }
        .materia-card:hover { border-color: var(--color-primary); box-shadow: 0 2px 8px rgba(122,31,31,0.08); }
        .materia-card-name { font-size: 11px; font-weight: 700; color: var(--color-primary); margin-bottom: 5px; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .docente-chip { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px 8px; margin: 3px 0; cursor: grab; display: flex; align-items: center; gap: 6px; transition: all 0.15s; font-size: 11px; }
        .docente-chip:hover { background: #f1f5f9; transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
        .docente-chip:active { cursor: grabbing; opacity: 0.5; }
        .color-indicator { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
        .warning-sidebar { position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: #fff; box-shadow: -8px 0 30px rgba(0,0,0,0.12); z-index: 1000; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); overflow: hidden; }
        .warning-sidebar.open { transform: translateX(0); }
        .warning-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 999; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .warning-overlay.open { opacity: 1; pointer-events: all; }
        .warning-item { padding: 12px 14px; border-radius: 10px; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; border: 1px solid; transition: transform 0.15s; }
        .warning-item:hover { transform: translateX(-2px); }
        .warning-item.error { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
        .warning-item.warning { background: #fffbeb; border-color: #fde68a; color: #92400e; }
        .warning-item.info { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
        .conflict-item { padding: 12px 14px; border-radius: 10px; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 10px; background: #fdf2f8; border: 1px solid #fbcfe8; color: #9d174d; }
        .anio-tabs { display: flex; gap: 4px; background: #f1f5f9; border-radius: 12px; padding: 4px; }
        .anio-tab { padding: 10px 20px; border-radius: 10px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--color-gray-500); min-width: 70px; }
        .anio-tab:hover { background: #e2e8f0; color: var(--color-gray-700); }
        .anio-tab.active { background: var(--color-primary); color: #fff; box-shadow: 0 2px 8px rgba(122,31,31,0.3); }
        .stat-card { background: #fff; border-radius: 14px; padding: 18px 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 14px; transition: all 0.2s; flex: 1; min-width: 180px; }
        .stat-card:hover { border-color: var(--color-primary); box-shadow: 0 4px 12px rgba(122,31,31,0.06); }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .filter-pill { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0 4px 0 12px; height: 38px; font-size: 13px; transition: all 0.15s; }
        .filter-pill:hover { border-color: var(--color-primary); }
        .filter-pill select { border: none; background: transparent; font-size: 13px; font-weight: 600; color: var(--color-gray-700); padding: 4px 8px 4px 0; cursor: pointer; outline: none; }
        .filter-pill label { font-size: 11px; font-weight: 600; color: var(--color-gray-400); white-space: nowrap; }
        .add-btn { width: 100%; padding: 6px; background: transparent; border: 2px dashed #e2e8f0; border-radius: 8px; font-size: 11px; color: #94a3b8; cursor: pointer; font-weight: 600; transition: all 0.15s; }
        .add-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: #fef7f7; }
        .warn-badge { min-width: 20px; height: 20px; border-radius: 10px; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; color: #fff; padding: 0 5px; }
        @media (max-width: 1200px) { .cal-grid { grid-template-columns: 80px repeat(6, 1fr); } .warning-sidebar { width: 340px; } }
        @media (max-width: 768px) { .cal-grid { grid-template-columns: 60px repeat(6, minmax(120px, 1fr)); } .warning-sidebar { width: 100%; } }
      `}</style>

      {/* ──── SIDEBAR DE ALERTAS ──── */}
      <div className={`warning-overlay ${showWarnings ? 'open' : ''}`} onClick={() => setShowWarnings(false)} />
      <aside className={`warning-sidebar ${showWarnings ? 'open' : ''}`}>
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, var(--color-primary) 0%, #5a1414 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Alertas y Advertencias</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.8 }}>{warnings.length} alertas · {conflictos.length} conflictos</p>
          </div>
          <button onClick={() => setShowWarnings(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e2e8f0' }}>
          {([
            { key: 'all' as const, label: 'Todas', count: warnings.length + conflictos.length },
            { key: 'error' as const, label: 'Exceden', count: errCount },
            { key: 'warning' as const, label: 'Bajas', count: warnCount },
            { key: 'info' as const, label: 'OK', count: okCount }
          ]).map(tab => (
            <button key={tab.key} onClick={() => setWarningFilter(tab.key)} style={{ flex: 1, padding: '12px 8px', border: 'none', background: warningFilter === tab.key ? '#fff' : '#f8fafc', borderBottom: warningFilter === tab.key ? '3px solid var(--color-primary)' : '3px solid transparent', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: warningFilter === tab.key ? 'var(--color-primary)' : '#94a3b8', transition: 'all 0.15s' }}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {(warningFilter === 'all' || warningFilter === 'error') && conflictos.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9d174d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Superposiciones horarias</div>
              {conflictos.map((c, idx) => (
                <div key={idx} className="conflict-item">
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ec4899', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>!</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{c.docenteNombre}</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>{c.dia} {mostrarTurno(c.turno)}: {c.materias.join(' + ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {warningsFiltered.length > 0 ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Carga docente</div>
              {warningsFiltered.map((w) => (
                <div key={w.id} className={`warning-item ${w.type}`}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 800, color: '#fff', background: w.type === 'error' ? '#dc2626' : w.type === 'warning' ? '#f59e0b' : '#10b981' }}>
                    {w.type === 'error' ? '!' : w.type === 'warning' ? '▼' : '✓'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{w.docenteNombre}</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>{w.message}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, background: w.type === 'error' ? '#fecaca' : w.type === 'warning' ? '#fde68a' : '#a7f3d0', color: w.type === 'error' ? '#991b1b' : w.type === 'warning' ? '#92400e' : '#065f46', whiteSpace: 'nowrap' }}>
                    {w.carga}/{w.maxCarga}
                  </div>
                </div>
              ))}
            </>
          ) : warningFilter !== 'all' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Sin alertas en esta categoría</div>
            </div>
          ) : null}
          {warnings.length === 0 && conflictos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981' }}>Todo en orden</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>No hay alertas ni conflictos</div>
            </div>
          )}
        </div>
      </aside>

      {/* ──── CONTENIDO PRINCIPAL ──── */}
      <div style={{ padding: '24px 28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2 }}>Calendario Docente</h1>
            <p style={{ color: 'var(--color-gray-500)', margin: '4px 0 0', fontSize: 14 }}>Horario semanal de asignaciones — Arrastrá y soltá para reasignar</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => { void fetchData(); }} disabled={refreshing} style={{ padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: refreshing ? 'not-allowed' : 'pointer', color: 'var(--color-gray-600)', display: 'flex', alignItems: 'center', gap: 6, opacity: refreshing ? 0.6 : 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              {refreshing ? "Actualizando…" : "Actualizar"}
            </button>
            <button onClick={() => { setExportCuatrimestre(""); setShowExportModal(true); }} style={{ padding: '10px 18px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Exportar Excel
            </button>
            <button onClick={() => setShowWarnings(true)} style={{ position: 'relative', padding: '10px 18px', background: (errCount + conflictos.length) > 0 ? '#fef2f2' : '#ecfdf5', border: `1px solid ${(errCount + conflictos.length) > 0 ? '#fecaca' : '#a7f3d0'}`, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: (errCount + conflictos.length) > 0 ? '#991b1b' : '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              Alertas
              {(errCount + conflictos.length) > 0 && (
                <span className="warn-badge" style={{ background: '#dc2626', marginLeft: 2 }}>{errCount + conflictos.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>👨‍🏫</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-gray-800)', lineHeight: 1 }}>{stats.docentesActivos}</div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-500)', fontWeight: 500 }}>Docentes activos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>📚</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-gray-800)', lineHeight: 1 }}>{stats.materiasActivas}</div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-500)', fontWeight: 500 }}>Materias activas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>📋</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-gray-800)', lineHeight: 1 }}>{stats.totalAsignaciones}</div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-500)', fontWeight: 500 }}>Total asignaciones</div>
            </div>
          </div>
          {stats.sinDocente > 0 && (
            <div className="stat-card" style={{ borderColor: '#fecaca' }}>
              <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>⚠️</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{stats.sinDocente}</div>
                <div style={{ fontSize: 12, color: '#991b1b', fontWeight: 500 }}>Sin docente asignado</div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros + Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 20, background: '#fff', borderRadius: 14, padding: '14px 20px', border: '1px solid #e2e8f0' }}>
          <div className="anio-tabs">
            {anios.map((a) => {
              const hasData = aniosConDatos.includes(a);
              return (
                <button key={a} className={`anio-tab ${selectedAnio === a ? 'active' : ''}`} onClick={() => setSelectedAnio(a)} style={{ opacity: hasData ? 1 : 0.4 }} title={hasData ? `${a}° Año` : `${a}° Año (sin datos)`}>
                  {a}° Año
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="filter-pill">
              <label>Cuatri</label>
              <select value={filtroCuatrimestre} onChange={(e) => setFiltroCuatrimestre(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">Todos</option>
                {cuatrimestresDisponibles.map((c) => <option key={c} value={c}>C{c}</option>)}
              </select>
            </div>
            <div className="filter-pill">
              <label>Año</label>
              <select value={filtroAnioAsignacion} onChange={(e) => setFiltroAnioAsignacion(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">Todos</option>
                {aniosAsignacionDisponibles.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="filter-pill">
              <label>Turno</label>
              <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)}>
                <option value="">Todos</option>
                {turnosCanonicos.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <input type="text" placeholder="Buscar materia..." value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)} style={{ height: 38, borderRadius: 10, border: '1px solid #e2e8f0', padding: '0 12px', fontSize: 13, background: '#fff', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Buscar docente..." value={filtroDocente} onChange={(e) => setFiltroDocente(e.target.value)} style={{ height: 38, borderRadius: 10, border: '1px solid #e2e8f0', padding: '0 12px', fontSize: 13, background: '#fff', boxSizing: 'border-box' }} />
            <button onClick={resetFiltros} style={{ padding: '0 14px', height: 38, background: '#f1f5f9', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>Limpiar</button>
          </div>
        </div>

        {/* ──── CALENDARIO ──── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <div style={{ fontSize: 16, color: '#64748b', fontWeight: 600 }}>Cargando calendario…</div>
          </div>
        ) : turnosVisibles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 16, color: '#64748b', fontWeight: 600 }}>No hay asignaciones para {selectedAnio}° Año con los filtros seleccionados</div>
            <button onClick={resetFiltros} style={{ marginTop: 16, padding: '10px 24px', background: 'var(--color-primary)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Limpiar filtros</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 16 }}>
            <div className="cal-grid">
              <div className="cal-corner"><span style={{ fontSize: 12 }}>Turno</span></div>
              {diasSemana.map((dia) => (
                <div key={dia} className="cal-day-header">
                  <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{diasCortos[dia]}</div>
                  <div>{dia}</div>
                </div>
              ))}

              {turnosVisibles.map((turno) => (
                <>
                  <div key={`label-${turno}`} className="cal-turno-label">
                    <span style={{ fontSize: 22 }}>{iconoTurno(turno)}</span>
                    <span style={{ color: colorTurno(turno), fontWeight: 800, fontSize: 13 }}>{mostrarTurno(turno)}</span>
                  </div>

                  {diasSemana.map((dia) => {
                    const asigs = getAsignacionesPorDiaTurnoAnio(dia, turno, selectedAnio);
                    return (
                      <div key={`${turno}-${dia}`} className={`cal-cell ${draggedItem ? 'drag-target' : ''}`} onDragOver={(e) => { handleDragOver(e); draggedAsignacion && handleDragOverAsignacion(e); }} onDrop={(e) => { const first = asigs[0]; if (first?.id) handleDrop(e, first.id); draggedAsignacion && handleDropAsignacion(e, dia, turno); }} onDragLeave={draggedAsignacion ? handleDragLeaveAsignacion : undefined}>
                        {asigs.length === 0 ? (
                          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <button
                              onClick={() => abrirAddAsignacionModal(dia, turno)}
                              style={{ width: 36, height: 36, borderRadius: '50%', border: '2px dashed #cbd5e1', background: 'transparent', color: '#94a3b8', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = '#fef7f7'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                              title="Agregar asignación"
                            >+</button>
                            <span style={{ fontSize: 10, color: '#cbd5e1' }}>Agregar</span>
                          </div>
                        ) : (
                          asigs.map((asignacion) => {
                            const materia = getMateria(asignacion.materiaId);
                            if (!materia || !asignacion.id) return null;
                            const docentes = getAsignacionesDocentes(asignacion.id)
                              .sort((d1, d2) => {
                                const rolA = d1.rolId != null ? (rolesMap.get(d1.rolId) ?? "") : "";
                                const rolB = d2.rolId != null ? (rolesMap.get(d2.rolId) ?? "") : "";
                                return rolB.localeCompare(rolA);
                              });

                            return (
                              <div key={asignacion.id} className="materia-card" draggable onDragStart={(e) => handleDragStartAsignacion(e, asignacion.id!, dia, turno)} onDragEnd={handleDragEndAsignacion} onDragOver={handleDragOverAsignacion} onDragLeave={handleDragLeaveAsignacion}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
                                  <div className="materia-card-name" style={{ flex: 1 }}>{materia.nombre}</div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); borrarAsignacion(asignacion.id!); }}
                                    style={{ width: 20, height: 20, padding: 0, background: 'transparent', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.4, transition: 'opacity 0.15s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = '#fff5f5'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.background = 'transparent'; }}
                                    title="Eliminar asignación"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="#dc2626" strokeWidth="1.5"/></svg>
                                  </button>
                                </div>
                                {docentes.length === 0 ? (
                                  <button className="add-btn" onClick={() => abrirModal(asignacion.id!)}>+ Asignar docente</button>
                                ) : (
                                  <>
                                    {docentes.map((d) => {
                                      const docenteReal = docentesLookup.get(d.docenteId);
                                      const nombreReal = docenteReal?.nombre ?? d.docenteNombre ?? "Docente";
                                      const rolNombre = d.rolId != null ? (rolesMap.get(d.rolId) ?? "") : "";
                                      const color = getColorPorCarga(d.docenteId, d.rolId);
                                      const carga = calcularCargaDocente(d.docenteId);
                                      return (
                                        <div key={d.id} className="docente-chip" draggable onDragStart={(e) => handleDragStart(e, d.id!, d.docenteId, nombreReal, d.rolId ?? 0, asignacion.id!)} onDragEnd={handleDragEnd}>
                                          <div className="color-indicator" style={{ background: color }} />
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombreReal}</div>
                                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{rolNombre} · {carga} mat.</div>
                                          </div>
                                          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                                            <button onClick={(e) => { e.stopPropagation(); setSelectedAsignacionId(d.asignacionId); setSelectedDocenteId(String(d.docenteId)); setSelectedRolId(d.rolId ?? ""); setEditandoAsignacionDocenteId(d.id!); setShowModal(true); }} style={{ width: 22, height: 22, padding: 0, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar">
                                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9Z" stroke="#64748b" strokeWidth="1.5"/></svg>
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); borrarAsignacionDocente(d.id!); }} style={{ width: 22, height: 22, padding: 0, background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Eliminar">
                                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="#dc2626" strokeWidth="1.5"/></svg>
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {docentes.length < 3 && (
                                      <button className="add-btn" onClick={() => abrirModal(asignacion.id!)} style={{ marginTop: 4 }}>+ Agregar docente</button>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })
                        )}
                        {asigs.length > 0 && (
                          <button
                            onClick={() => abrirAddAsignacionModal(dia, turno)}
                            style={{ width: '100%', padding: 4, background: 'transparent', border: '1.5px dashed #e2e8f0', borderRadius: 6, fontSize: 14, color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.15s', marginTop: 4 }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = '#fef7f7'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
                            title="Agregar otra asignación"
                          >+</button>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        )}

        {/* Leyenda */}
        <div style={{ marginTop: 20, display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', padding: '14px 24px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Carga docente:</span>
          {[{ color: '#10b981', label: 'Límite correcto' }, { color: '#f59e0b', label: 'Por debajo del límite' }, { color: '#ef4444', label: 'Excede el límite' }, { color: '#94a3b8', label: 'Sin categoría' }].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
              <span style={{ fontSize: 12, color: '#475569' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ──── MODAL AGREGAR ASIGNACIÓN ──── */}
      {showAddAsignacionModal && (
        <Modal onClose={() => setShowAddAsignacionModal(false)}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)', marginTop: 0, marginBottom: 20 }}>
            Nueva Asignación
          </h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ padding: '8px 14px', background: '#f1f5f9', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#475569' }}>
              📅 {addAsignacionDia}
            </div>
            <div style={{ padding: '8px 14px', background: '#f1f5f9', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#475569' }}>
              {iconoTurno(addAsignacionTurno)} {mostrarTurno(addAsignacionTurno)}
            </div>
            <div style={{ padding: '8px 14px', background: '#f1f5f9', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#475569' }}>
              🎓 {selectedAnio}° Año
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Materia</label>
              <select style={{ width: '100%', height: 42, borderRadius: 8, border: '1px solid #e2e8f0', padding: '0 14px', background: '#fff', fontSize: 14, boxSizing: 'border-box' }} value={addAsignacionMateriaId} onChange={(e) => setAddAsignacionMateriaId(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">Seleccioná una materia…</option>
                {materiasParaAgregar.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
              {materiasParaAgregar.length === 0 && (
                <div style={{ marginTop: 6, fontSize: 12, color: '#f59e0b' }}>
                  ⚠️ No hay materias registradas para {selectedAnio}° Año
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Cuatrimestre</label>
              <select style={{ width: '100%', height: 42, borderRadius: 8, border: '1px solid #e2e8f0', padding: '0 14px', background: '#fff', fontSize: 14, boxSizing: 'border-box' }} value={addAsignacionCuatrimestreId} onChange={(e) => setAddAsignacionCuatrimestreId(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">Seleccioná cuatrimestre…</option>
                {Array.from(cuatrimestresMap.entries()).map(([id, num]) => (
                  <option key={id} value={id}>Cuatrimestre {num}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e9ed' }}>
              <button onClick={() => setShowAddAsignacionModal(false)} style={{ flex: 1, padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>Cancelar</button>
              <button onClick={confirmarAddAsignacion} disabled={addAsignacionMateriaId === "" || addAsignacionCuatrimestreId === ""} style={{ flex: 1, padding: '12px', background: 'var(--color-primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: (addAsignacionMateriaId === "" || addAsignacionCuatrimestreId === "") ? 'not-allowed' : 'pointer', color: '#fff', opacity: (addAsignacionMateriaId === "" || addAsignacionCuatrimestreId === "") ? 0.5 : 1 }}>
                Crear Asignación
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ──── MODAL ──── */}
      {showModal && (
        <Modal onClose={cerrarModal}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)', marginTop: 0, marginBottom: 20 }}>
            {editandoAsignacionDocenteId ? "Editar Asignación" : "Asignar Docente"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Docente</label>
              <input type="text" style={{ width: '100%', height: 42, borderRadius: 8, border: '1px solid #e2e8f0', padding: '0 14px', background: '#fff', fontSize: 14, marginBottom: 6, boxSizing: 'border-box' }} placeholder="Buscar docente..." value={busquedaDocente} onChange={(e) => setBusquedaDocente(e.target.value)} />
              <select style={{ width: '100%', height: 42, borderRadius: 8, border: '1px solid #e2e8f0', padding: '0 14px', background: '#fff', fontSize: 14, boxSizing: 'border-box' }} value={selectedDocenteId} onChange={(e) => setSelectedDocenteId(e.target.value)}>
                <option value="">Seleccioná un docente…</option>
                {docentesFiltrados.slice().sort((a, b) => a.nombre.localeCompare(b.nombre)).map((d) => {
                  const categoriaNombre = d.categoriaId ? categoriasMap.get(d.categoriaId)?.nombre ?? "" : "";
                  const carga = calcularCargaDocente(d.id!);
                  const cat = d.categoriaId ? categoriasMap.get(d.categoriaId) : undefined;
                  const max = cat ? cat.maxMaterias : '?';
                  return (<option key={d.id} value={String(d.id)}>{d.nombre}{categoriaNombre ? ` — ${categoriaNombre}` : ""} ({carga}/{max} mat.)</option>);
                })}
              </select>
              {selectedDocenteId && docentesLookup.get(Number(selectedDocenteId)) && (() => {
                const selDoc = docentesLookup.get(Number(selectedDocenteId))!;
                const selCat = selDoc.categoriaId ? categoriasMap.get(selDoc.categoriaId) : undefined;
                const selCarga = calcularCargaDocente(selDoc.id!);
                const selMax = selCat ? selCat.maxMaterias : 0;
                const selColor = getColorPorCarga(selDoc.id!);
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ width: 6, height: 32, borderRadius: 3, background: selColor }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{selCat?.nombre ?? 'Sin categoría'}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Carga: {selCarga} / {selMax} materias</div>
                    </div>
                    <div style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, background: selColor + '20', color: selColor }}>
                      {selCarga >= selMax ? 'LLENO' : `${selMax - selCarga} disponible(s)`}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Rol</label>
              <select style={{ width: '100%', height: 42, borderRadius: 8, border: '1px solid #e2e8f0', padding: '0 14px', background: '#fff', fontSize: 14, boxSizing: 'border-box' }} value={selectedRolId} onChange={(e) => setSelectedRolId(e.target.value === "" ? "" : Number(e.target.value))}>
                {rolesMap.size === 0 ? <option value="">Cargando roles…</option> : Array.from(rolesMap.entries()).map(([id, nombre]) => (<option key={id} value={id}>{nombre}</option>))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e9ed' }}>
              <button onClick={cerrarModal} style={{ flex: 1, padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>Cancelar</button>
              <button onClick={confirmarAsignacionDocente} disabled={selectedAsignacionId == null || selectedDocenteId === "" || selectedRolId === ""} style={{ flex: 1, padding: '12px', background: 'var(--color-primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: (selectedAsignacionId == null || selectedDocenteId === "" || selectedRolId === "") ? 'not-allowed' : 'pointer', color: '#fff', opacity: (selectedAsignacionId == null || selectedDocenteId === "" || selectedRolId === "") ? 0.5 : 1 }}>
                {editandoAsignacionDocenteId ? "Actualizar" : "Asignar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de exportar Excel */}
      {showExportModal && (
        <Modal onClose={() => setShowExportModal(false)}>
          <div style={{ padding: 28, minWidth: 360 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}>Exportar a Excel</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>Seleccioná el cuatrimestre que querés exportar</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Año</label>
              <div style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#1e293b' }}>
                {filtroAnioAsignacion === "" ? "Todos los años" : filtroAnioAsignacion}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Cuatrimestre *</label>
              <select
                style={{ width: '100%', height: 42, borderRadius: 8, border: '1px solid #e2e8f0', padding: '0 14px', background: '#fff', fontSize: 14, boxSizing: 'border-box' }}
                value={exportCuatrimestre}
                onChange={(e) => setExportCuatrimestre(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <option value="">Seleccioná un cuatrimestre…</option>
                {Array.from(cuatrimestresMap.entries()).sort((a, b) => a[1] - b[1]).map(([id, num]) => (
                  <option key={id} value={num}>Cuatrimestre {num}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, paddingTop: 16, borderTop: '1px solid #e5e9ed' }}>
              <button onClick={() => setShowExportModal(false)} style={{ flex: 1, padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>Cancelar</button>
              <button
                onClick={handleExportExcel}
                disabled={exportCuatrimestre === "" || exporting}
                style={{ flex: 1, padding: '12px', background: '#065f46', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: (exportCuatrimestre === "" || exporting) ? 'not-allowed' : 'pointer', color: '#fff', opacity: (exportCuatrimestre === "" || exporting) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                {exporting ? "Exportando…" : "Exportar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default Tablero;
