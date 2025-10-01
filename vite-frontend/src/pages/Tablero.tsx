import { useEffect, useMemo, useRef, useState } from "react";
import type { Asignacion, Materia, AsignacionDocente, Categoria, Docente } from "../types";
import { listarAsignaciones } from "../api/asignacionApi";
import { listarMaterias } from "../api/materiaApi";
import { listarAsignacionesDocentes, crearAsignacionDocente, eliminarAsignacionDocente, actualizarAsignacionDocente } from "../api/asignacionDocenteApi";
import { listarCategorias } from "../api/categoriaApi";
import { listarDocentes } from "../api/docenteApi";
import { listarCuatrimestres } from "../api/cuatrimestreApi";
import { listarRoles } from "../api/rolApi";
import type { Rol } from "../types";
import Modal from "src/components/Modal";

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const turnos = ["Maniana", "Tarde", "Noche"];
const anios = [1, 2, 3, 4, 5];

function Tablero() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [asignacionesDocentes, setAsignacionesDocentes] = useState<AsignacionDocente[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<Map<number, Categoria>>(new Map());
  const [docentesLookup, setDocentesLookup] = useState<Map<number, Docente>>(new Map());
  const [cuatrimestresMap, setCuatrimestresMap] = useState<Map<number, number>>(new Map()); // id -> numero_cuatri
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAsignacionId, setSelectedAsignacionId] = useState<number | null>(null);
  const [selectedDocenteId, setSelectedDocenteId] = useState<string>("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | "">("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | "">("");
  const [rolesMap, setRolesMap] = useState<Map<number, string>>(new Map());
  const [selectedRolId, setSelectedRolId] = useState<number | "">("");
  const [busquedaDocente, setBusquedaDocente] = useState<string>("");
  const [editandoAsignacionDocenteId, setEditandoAsignacionDocenteId] = useState<number | null>(null);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<number | "">("");
  const docentesFiltrados = Array.from(docentesLookup.values()).filter((d) =>
    d.nombre.toLowerCase().includes(busquedaDocente.toLowerCase())
  );
  // filtros
  const [filtroCuatrimestre, setFiltroCuatrimestre] = useState<number | "">(""); // número de cuatrimestre (1 o 2) o ""
  const [filtroAnioAsignacion, setFiltroAnioAsignacion] = useState<number | "">(2025);
  const [filtroMateria, setFiltroMateria] = useState<string>("");
  const [filtroDocente, setFiltroDocente] = useState<string>("");
  const [filtroTurno, setFiltroTurno] = useState<string | "">("");
  const [filtroCategoria, setFiltroCategoria] = useState<number | "">("");

  const [hoveredRowKey, setHoveredRowKey] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const HEADER_COLOR = "#7A1F1F";
  const HEADER_GRADIENT = `linear-gradient(180deg, ${HEADER_COLOR} 0%, #5a1414 100%)`;

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
    const cantidad = calcularCargaDocente(docenteId); // cuenta anual según filtro
    const docente = docentesLookup.get(docenteId);
    const categoriaId = docente?.categoriaId ?? fallbackRolId;
    const categoria = categoriaId != null ? categoriasMap.get(categoriaId) : undefined;

    if (!categoria) return "#f0ad4e"; // amarillo: categoría desconocida

    const max = Number(categoria.maxMaterias);

    // Verde si cantidad == max o cantidad == max+1
    if (cantidad === max || cantidad === max + 1) return "#5cb85c"; // verde

    // Amarillo si se pasa de max+1
    if (cantidad > max + 1) return "#f0ad4e"; // amarillo

    // Rojo en cualquier otro caso (por debajo de max)
    return "#d9534f"; // rojo                                 // rojo: exceso
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
        // filtro por número de cuatrimestre (1 o 2). Si filtro vacío -> todo
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
        if (filtroMateria && !materia.nombre.toLowerCase().includes(filtroMateria.trim().toLowerCase())) return false;
        return a.dia === dia && a.turno === turno;
      })
      .sort((a, b) => {
        const nombreA = getMateria(a.materiaId)?.nombre ?? "";
        const nombreB = getMateria(b.materiaId)?.nombre ?? "";
        return nombreA.localeCompare(nombreB);
      });

  const docentePasaFiltrosGlobales = (d: AsignacionDocente) => {
    const nombreFromLookup = docentesLookup.get(d.docenteId)?.nombre ?? d.docenteNombre ?? "";
    if (filtroDocente && !nombreFromLookup.toLowerCase().includes(filtroDocente.toLowerCase())) return false;
    const categoriaReal = docentesLookup.get(d.docenteId)?.categoriaId ?? d.rolId;
    if (filtroCategoria !== "" && categoriaReal !== filtroCategoria) return false;
    return true;
  };

  const docentesCargaMap = useMemo(() => {
    const m = new Map<number, number>();
    const anoFiltro = filtroAnioAsignacion === "" ? null : Number(filtroAnioAsignacion);

    asignaciones.forEach((a) => {
      // Solo limitamos por año seleccionado
      if (anoFiltro != null && a.anio !== anoFiltro) return;

      // NOTA: evito filtrar por cuatrimestre para el cálculo anual de color
      // Podés mantener filtros de turno/materia/docente si querés que el color
      // refleje la vista actual; si no, eliminá también esos filtros.

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
    filtroAnioAsignacion,
    // opcional: podés remover estos para que el color sea estrictamente anual
    filtroMateria,
    filtroDocente,
    filtroCategoria
  ]);

  // AHORA: calcularCargaDocente lee del mapa de apariciones visibles
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
    setFiltroMateria("");
    setFiltroDocente("");
    setFiltroTurno("");
    setFiltroCategoria("");
  };

  const filtrosActivos = useMemo(() => {
    let c = 0;
    if (filtroCuatrimestre !== "") c++;
    if (filtroAnioAsignacion !== "") c++;
    if (filtroMateria.trim() !== "") c++;
    if (filtroDocente.trim() !== "") c++;
    if (filtroTurno !== "") c++;
    if (filtroCategoria !== "") c++;
    return c;
  }, [filtroCuatrimestre, filtroAnioAsignacion, filtroMateria, filtroDocente, filtroTurno, filtroCategoria]);

  const noop = () => { };

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
    <div style={{ padding: "1.5rem", fontFamily: "Inter, Arial, sans-serif" }}>
      <style>{`
        .field { height: 38px; border-radius: 10px; border: 1px solid #dfe3e6; padding: 0 12px; background: #fff; transition: box-shadow .12s, border-color .12s; }
        .field:focus-visible { outline: none; border-color: ${HEADER_COLOR}; box-shadow: 0 0 0 4px rgba(122,31,31,0.12); }
        .select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #7a7a7a 50%), linear-gradient(135deg, #7a7a7a 50%, transparent 50%), linear-gradient(to right, #fff, #fff); background-position: calc(100% - 18px) 16px, calc(100% - 13px) 16px, 100% 0; background-size: 5px 5px, 5px 5px, 2.5em 100%; background-repeat: no-repeat; }
        .badge-empty { display:inline-flex; align-items:center; gap:6px; padding:6px 8px; border-radius:999px; background:#fdecea; color:#a83a2e; font-weight:700; font-size:12px; border:1px solid rgba(217,83,79,0.12); }
        .card-title { font-size:16px; font-weight:800; color:#111827; }
        .card-sub { font-size:13px; color:#666666; margin-top:4px; }
        .cell-scroll { max-height: 260px; overflow-y: auto; padding-right: 6px; display:flex; flex-direction:column; gap:12px; }
        .action-small { height:34px; width:34px; border-radius:8px; border:1px solid #e2e8f0; background:#fff; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; }
      `}</style>

      <h2 style={{ textAlign: "center", marginBottom: 10, fontSize: 22 }}>🗂️ Tablero Docente</h2>

      <div style={{
        background: "#fff", border: "1px solid #e6e9eb", borderRadius: 12, padding: 12, marginBottom: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 140 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a4a4a", textTransform: "uppercase" }}>Cuatrimestre</div>
            <select className="field select" value={filtroCuatrimestre} onChange={(e) => setFiltroCuatrimestre(e.target.value === "" ? "" : Number(e.target.value))}>
              <option value="">Todos</option>
              {cuatrimestresDisponibles.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 140 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a4a4a", textTransform: "uppercase" }}>Año asignación</div>
            <select className="field select" value={filtroAnioAsignacion} onChange={(e) => setFiltroAnioAsignacion(e.target.value === "" ? "" : Number(e.target.value))}>
              <option value="">Todos</option>
              {aniosAsignacionDisponibles.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 240, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a4a4a", textTransform: "uppercase" }}>Materia</div>
            <input className="field" placeholder="Buscar materia por nombre" value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)} list="materias-list" />
            <datalist id="materias-list">{materiasDisponibles.map((m) => <option key={m} value={m} />)}</datalist>
          </div>

          {/* filtro de docente con datalist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a4a4a", textTransform: "uppercase" }}>Docente</div>
            <input
              className="field"
              placeholder="Buscar nombre docente"
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
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 160 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a4a4a", textTransform: "uppercase" }}>
              Categoría
            </div>
            <select
              className="field select"
              value={filtroCategoria}
              onChange={(e) =>
                setFiltroCategoria(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">Todas</option>
              {Array.from(categoriasMap.entries()).map(([id, categoria]) => (
                <option key={id} value={id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 140 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a4a4a", textTransform: "uppercase" }}>Turno</div>
            <select className="field select" value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value === "" ? "" : e.target.value)}>
              <option value="">Todos</option>
              {turnos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            {filtrosActivos > 0 && <div style={{ height: 28, display: "inline-flex", alignItems: "center", padding: "0 10px", background: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: 999, fontWeight: 700, fontSize: 12 }}>{filtrosActivos} activo{filtrosActivos > 1 ? "s" : ""}</div>}
            <button onClick={resetFiltros} style={{ height: 38, borderRadius: 10, border: "1px solid #e0e0e0", background: "#f8f9fa", color: "#374151", padding: "0 12px", fontWeight: 700, cursor: "pointer" }}>Limpiar</button>

            <button
              onClick={() => { void fetchData(); }}
              disabled={refreshing}
              style={{
                height: 38,
                borderRadius: 10,
                border: "1px solid #d7a4a4",
                background: refreshing ? "#f4d6d6" : "#fff",
                color: "#7A1F1F",
                padding: "0 12px",
                fontWeight: 800,
                cursor: refreshing ? "default" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}
              title="Actualizar datos (manual)"
            >
              {refreshing ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>⏳ Cargando asignaciones...</p>
      ) : (
        <div ref={wrapperRef} style={{ overflow: "auto", maxHeight: "78vh", border: "1px solid #e6e9eb", borderRadius: 10, background: "#fff", position: "relative", isolation: "isolate" }}>
          <table style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 1800, width: "100%", background: "#fff" }}>
            <thead>
              <tr>
                <th style={{ background: HEADER_GRADIENT, border: "1px solid rgba(255,255,255,0.08)", width: 150, height: 58, position: "sticky", left: 0, top: 0, zIndex: 70, pointerEvents: "none" }} aria-hidden />
                {diasSemana.map((dia) => (
                  <th key={dia} style={{ background: HEADER_GRADIENT, color: "white", padding: "0.9rem", textAlign: "center", fontWeight: 800, border: "1px solid rgba(255,255,255,0.08)", fontSize: 15, letterSpacing: "0.5px", textTransform: "uppercase", position: "sticky", top: 0, zIndex: 50 }}>{dia}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {anios.map((anio) =>
                turnos.map((turno) => {
                  const rowKey = `${anio}-${turno}`;
                  const isHovered = hoveredRowKey === rowKey;

                  return (
                    <tr key={`anio${anio}-turno${turno}`} onMouseEnter={() => setHoveredRowKey(rowKey)} onMouseLeave={() => setHoveredRowKey(null)} style={{ minHeight: 120 }}>
                      <td style={{ position: "sticky", left: 0, zIndex: 60, background: HEADER_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, padding: "0.9rem 0.6rem", minWidth: 150, minHeight: 58, boxShadow: isHovered ? "3px 0 12px rgba(0,0,0,0.18)" : "2px 0 8px rgba(0,0,0,0.12)", borderRight: "1px solid rgba(255,255,255,0.1)", color: "#fff", whiteSpace: "nowrap", overflow: "visible" }}>
                        <div style={{ fontSize: 14, fontWeight: 900 }}>{anio}°</div>
                        <div style={{ fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: 999 }}>{turno}</div>
                      </td>

                      {diasSemana.map((dia) => {
                        const asignacionesDelDia = getAsignacionesPorDiaTurnoAnio(dia, turno, anio);
                        return (
                          <td key={`${dia}-${turno}-${anio}`} style={{ border: "1px solid #e6e6e8", padding: 14, verticalAlign: "top", background: "#fff" }}>
                            {asignacionesDelDia.length === 0 ? (
                              <div style={{ color: "#9aa0a6", fontStyle: "italic", textAlign: "center", padding: 8 }}>—</div>
                            ) : (
                              <div className="cell-scroll">
                                {asignacionesDelDia.map((a) => {
                                  const materia = getMateria(a.materiaId);
                                  const docentes = (a.id != null ? getAsignacionesDocentes(a.id) : []).filter(docentePasaFiltrosGlobales);

                                  return (
                                    <div key={a.id ?? Math.random()} style={{ borderRadius: 12, padding: 12, background: "#fff", border: "1px solid #e7e9ec", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                                        <div style={{ flex: 1 }}>
                                          <div className="card-title">{materia?.nombre ?? "Materia desconocida"}</div>
                                          <div className="card-sub">{materia?.anio ? `${materia.anio}° año` : "Año ?"}</div>
                                        </div>

                                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 12 }}>
                                          {docentes.length < 2 && (
                                            <button
                                              className="action-small"
                                              title={a.id ? "Asignar" : "Sin ID"}
                                              onClick={() => a.id && abrirModal(a.id)}
                                              disabled={!a.id}
                                            >
                                              ➕
                                            </button>
                                          )}


                                        </div>
                                      </div>

                                      <div>
                                        {docentes.length === 0 ? (
                                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                            <div className="badge-empty">Sin docente asignado</div>
                                          </div>
                                        ) : (
                                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {docentes.map((d) => {
                                              const docenteReal = docentesLookup.get(d.docenteId);
                                              const nombreReal = docenteReal?.nombre ?? d.docenteNombre ?? "Docente";
                                              const rolNombre = d.rolId != null ? (rolesMap.get(d.rolId) ?? "") : "";
                                              const color = getColorPorCarga(d.docenteId, d.rolId);
                                              const docentesOrdenados = docentes
                                                .slice()
                                                .sort((d1, d2) => {
                                                  const rolA = d1.rolId != null ? (rolesMap.get(d1.rolId) ?? "") : "";
                                                  const rolB = d2.rolId != null ? (rolesMap.get(d2.rolId) ?? "") : "";
                                                  const byRolDesc = rolB.localeCompare(rolA); // Z → A
                                                  if (byRolDesc !== 0) return byRolDesc;

                                                  const nombreA = (docentesLookup.get(d1.docenteId)?.nombre ?? d1.docenteNombre ?? "").toLowerCase();
                                                  const nombreB = (docentesLookup.get(d2.docenteId)?.nombre ?? d2.docenteNombre ?? "").toLowerCase();
                                                  return nombreA.localeCompare(nombreB);
                                                });

                                              return (
                                                <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 8, background: "#fbfcfd", border: "1px solid #eef0f2" }}>
                                                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                                    <div style={{ width: 12, height: 12, background: color, borderRadius: 3, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.03)" }} />
                                                    <div>
                                                      <div style={{ fontWeight: 800 }}>{nombreReal}</div>
                                                      <div style={{ fontSize: 13, color: "#444" }}>{rolNombre || "Rol"}</div>

                                                    </div>
                                                  </div>
                                                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                    <div style={{ fontSize: 13, color: "#333" }}>{calcularCargaDocente(d.docenteId)} asign.</div>
                                                    <button
                                                      className="action-small"
                                                      title="Editar docente"
                                                      onClick={() => {
                                                        setSelectedAsignacionId(d.asignacionId);           // asignación actual
                                                        setSelectedDocenteId(String(d.docenteId));         // docente actual
                                                        setSelectedRolId(d.rolId ?? "");                   // rol actual
                                                        setEditandoAsignacionDocenteId(d.id!);             // id asignación_docente
                                                        setShowModal(true);
                                                      }}
                                                    >
                                                      ✎
                                                    </button>


                                                    <button
                                                      className="action-small"
                                                      title="Eliminar asignación docente"
                                                      onClick={() => borrarAsignacionDocente(d.id!)}
                                                    >
                                                      🗑
                                                    </button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}

                              </div>
                            )
                            }

                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )
      }
      {
        showModal && (
          <Modal onClose={cerrarModal}>


            <h3 style={{ marginBottom: 12 }}>Asignar docente</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 700 }}>Docente</label>
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
                    gap: 8,
                    marginTop: 6,
                    fontSize: 13
                  }}
                >
                  <span style={{ color: "#374151", fontWeight: 700 }}>Categoría:</span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      color: "#0f172a",
                      fontWeight: 700
                    }}
                  >
                    {selectedDocenteCategoriaNombre || "Sin categoría"}
                  </span>
                </div>
              )}


              <label style={{ fontSize: 12, fontWeight: 700 }}>Rol</label>
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={cerrarModal}>Cancelar</button>
                <button
                  onClick={confirmarAsignacionDocente}
                  disabled={selectedAsignacionId == null || selectedDocenteId === "" || selectedRolId === ""}
                >
                  Confirmar
                </button>
              </div>
            </div>

          </Modal>
        )
      }
    </div >
  );
}

export default Tablero;