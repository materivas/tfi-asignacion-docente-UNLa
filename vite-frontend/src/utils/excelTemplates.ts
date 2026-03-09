import * as XLSX from 'xlsx';

const CATEGORIAS_PREDEFINIDAS = ['Exclusiva', 'Semiexclusiva', 'Simple'];

export const descargarTemplateDocentes = (categorias: Map<number, string>) => {
  // Obtener nombres de categorías únicos
  const categoriasArray = Array.from(new Set(categorias.values()));
  
  // Preparar datos de ejemplo
  const datosDocentes = [
    ['Nombre', 'DNI', 'Categoría'],
    ['Ej: Juan Pérez', '12345678', categoriasArray.length > 0 ? categoriasArray[0] : 'Profesor Titular']
  ];

  // Crear worksheet principal
  const wsDocentes = XLSX.utils.aoa_to_sheet(datosDocentes);
  
  // Establecer ancho de columnas
  wsDocentes['!cols'] = [
    { wch: 30 }, // Nombre
    { wch: 15 }, // DNI
    { wch: 20 }  // Categoría
  ];

  // Formatear como tabla
  const range = XLSX.utils.decode_range("A1:C1");
  wsDocentes['!ref'] = XLSX.utils.encode_range(range);

  // Aplicar estilos a encabezados
  const encabezado = ['A1', 'B1', 'C1'];
  encabezado.forEach(cell => {
    if (wsDocentes[cell]) {
      wsDocentes[cell].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '366092' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }
  });

  // Agregar data validation para categoría (columna C, filas 2-1000)
  wsDocentes['!dataValidation'] = [
    {
      type: 'list',
      allowBlank: false,
      sqref: 'C2:C1000',
      formula1: `"${CATEGORIAS_PREDEFINIDAS.join(',')}"`,
      showDropDown: true
    }
  ];

  // Crear worksheet con instrucciones y opciones
  const datosInstrucciones = [
    ['INSTRUCCIONES PARA IMPORTAR DOCENTES'],
    [],
    ['1. RELLENAR LA HOJA "Docentes"'],
    ['2. Columnas requeridas:'],
    ['   - Nombre: Nombre completo del docente'],
    ['   - DNI: Sin puntos ni espacios (ej: 12345678)'],
    ['   - Categoría: Selecciona de las opciones en el dropdown'],
    [],
    ['CATEGORÍAS VÁLIDAS:'],
    []
  ];
  
  // Agregar categorías predefinidas
  CATEGORIAS_PREDEFINIDAS.forEach(cat => {
    datosInstrucciones.push(['   ✓ ' + cat]);
  });
  
  datosInstrucciones.push([]);
  datosInstrucciones.push(['NOTAS:']);
  datosInstrucciones.push(['• Los DNI duplicados serán ignorados']);
  datosInstrucciones.push(['• La categoría debe ser una de las opciones del dropdown']);
  datosInstrucciones.push(['• No es necesario escribir manualmente, usa el dropdown (▼)']);

  const wsInstrucciones = XLSX.utils.aoa_to_sheet(datosInstrucciones);
  wsInstrucciones['!cols'] = [{ wch: 70 }];

  // Crear workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsDocentes, 'Docentes');
  XLSX.utils.book_append_sheet(wb, wsInstrucciones, 'Instrucciones');

  // Descargar
  XLSX.writeFile(wb, 'template_docentes.xlsx');
};

export const descargarTemplateMateria = (planes: Map<number, string>) => {
  // Obtener nombres de planes
  const planesArray = Array.from(new Set(planes.values()));
  
  // Preparar datos de ejemplo
  const datosMaterias = [
    ['Nombre', 'Plan', 'Año'],
    [
      'Ej: Matemática I',
      planesArray.length > 0 ? planesArray[0] : 'Plan 2023',
      '1'
    ]
  ];

  // Crear worksheet principal
  const wsMaterias = XLSX.utils.aoa_to_sheet(datosMaterias);
  
  // Establecer ancho de columnas
  wsMaterias['!cols'] = [
    { wch: 30 }, // Nombre
    { wch: 20 }, // Plan
    { wch: 10 }  // Año
  ];

  // Formatear como tabla
  const range = XLSX.utils.decode_range("A1:C1");
  wsMaterias['!ref'] = XLSX.utils.encode_range(range);

  // Aplicar estilos a encabezados
  const encabezado = ['A1', 'B1', 'C1'];
  encabezado.forEach(cell => {
    if (wsMaterias[cell]) {
      wsMaterias[cell].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '366092' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }
  });

  // Crear worksheet con instrucciones y opciones
  const datosInstrucciones = [
    ['INSTRUCCIONES PARA IMPORTAR MATERIAS'],
    [],
    ['1. RELLENAR LA HOJA "Materias"'],
    ['2. Columnas requeridas:'],
    ['   - Nombre: Nombre de la materia (debe ser único)'],
    ['   - Plan: Uno de los planes disponibles en tu sistema'],
    ['   - Año: Año de la carrera (1-5)'],
    [],
    ['PLANES VÁLIDOS:'],
    []
  ];
  
  // Agregar planes disponibles
  planesArray.forEach(plan => {
    datosInstrucciones.push(['   ✓ ' + plan]);
  });
  
  datosInstrucciones.push([]);
  datosInstrucciones.push(['NOTAS:']);
  datosInstrucciones.push(['• Los nombres duplicados serán ignorados']);
  datosInstrucciones.push(['• El plan debe coincidir exactamente con uno de los disponibles']);
  datosInstrucciones.push(['• El año debe ser un número entre 1 y 5']);

  const wsInstrucciones = XLSX.utils.aoa_to_sheet(datosInstrucciones);
  wsInstrucciones['!cols'] = [{ wch: 70 }];

  // Crear workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsMaterias, 'Materias');
  XLSX.utils.book_append_sheet(wb, wsInstrucciones, 'Instrucciones');

  // Descargar
  XLSX.writeFile(wb, 'template_materias.xlsx');
};
