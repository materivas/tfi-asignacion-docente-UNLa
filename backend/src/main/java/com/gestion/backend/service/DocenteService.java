package com.gestion.backend.service;

import com.gestion.backend.dto.DocenteDto;
import com.gestion.backend.dto.CategoriaDto;
import com.gestion.backend.model.Categoria;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.repository.DocenteRepository;
import com.gestion.backend.repository.CategoriaRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class DocenteService {




    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<DocenteDto> listarTodos() {
        return docenteRepository.findAll().stream().map(DocenteDto::fromEntity).toList();
    }

    public Optional<DocenteDto> obtenerPorId(Long id) {
        return docenteRepository.findById(id).map(DocenteDto::fromEntity);
    }

    @Transactional
    public DocenteDto crear(DocenteDto dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
        var docente = DocenteDto.toEntity(dto, categoria);
        return DocenteDto.fromEntity(docenteRepository.save(docente));
    }

    public DocenteDto actualizar(Long id, DocenteDto dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
        return docenteRepository.findById(id).map(docente -> {
            docente.setNombre(dto.getNombre());
            docente.setDni(dto.getDni());
            docente.setCategoria(categoria);
            return DocenteDto.fromEntity(docenteRepository.save(docente));
        }).orElseThrow(() -> new RuntimeException("Docente no encontrado"));
    }

    public void eliminar(Long id) {
        docenteRepository.deleteById(id);

    }


    public Map<String, Object> importarDocentesDesdeExcel(MultipartFile archivo) throws IOException {
        List<String> errores = new ArrayList<>();
        List<String> filasIgnoradas = new ArrayList<>();
        int creados = 0;
        int ignorados = 0;

        // Categorías predefinidas válidas
        Set<String> categoriasValidas = new HashSet<>(Arrays.asList("Exclusiva", "Semiexclusiva", "Simple"));

        // Cache categorías en memoria para evitar consultas repetidas
        Map<String, Categoria> categoriasPorNombre = new HashMap<>();
        for (Categoria cat : categoriaRepository.findAll()) {
            categoriasPorNombre.put(cat.getNombre().trim().toLowerCase(), cat);
        }

        // Cache DNIs existentes para evitar consultas repetidas
        Set<String> dnisExistentes = new HashSet<>();
        for (Docente d : docenteRepository.findAll()) {
            dnisExistentes.add(d.getDni());
        }

        List<Docente> nuevosDocentes = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet hoja = workbook.getSheetAt(0);
            int lastRow = hoja.getLastRowNum();
            for (int i = 1; i <= lastRow; i++) {
                Row fila = hoja.getRow(i);
                if (fila == null) continue;
                try {
                    String nombre = obtenerTexto(fila.getCell(0));
                    String dni = obtenerTexto(fila.getCell(1));
                    String nombreCategoria = obtenerTexto(fila.getCell(2));
                    
                    // Ignorar filas completamente vacías
                    if (nombre.isEmpty() && dni.isEmpty() && nombreCategoria.isEmpty()) {
                        continue;
                    }
                    
                    // Ignorar filas con datos parciales (sin reportar error)
                    if (nombre.isEmpty() || dni.isEmpty() || nombreCategoria.isEmpty()) {
                        filasIgnoradas.add("Fila " + (i + 1) + ": datos incompletos");
                        ignorados++;
                        continue;
                    }
                    
                    // Validar que la categoría sea una de las 3 válidas
                    if (!categoriasValidas.contains(nombreCategoria)) {
                        errores.add("Fila " + (i + 1) + ": Categoría inválida '" + nombreCategoria + "'. Debe ser: Exclusiva, Semiexclusiva o Simple");
                        continue;
                    }
                    
                    if (dnisExistentes.contains(dni)) {
                        filasIgnoradas.add("Fila " + (i + 1) + ": DNI " + dni + " ya existe");
                        ignorados++;
                        continue;
                    }
                    
                    Categoria categoria = categoriasPorNombre.get(nombreCategoria.trim().toLowerCase());
                    if (categoria == null) {
                        errores.add("Fila " + (i + 1) + ": Error interno - Categoría " + nombreCategoria + " no encontrada en el sistema");
                        continue;
                    }
                    
                    Docente nuevo = new Docente();
                    nuevo.setNombre(nombre);
                    nuevo.setDni(dni);
                    nuevo.setCategoria(categoria);
                    nuevosDocentes.add(nuevo);
                    dnisExistentes.add(dni);
                    creados++;
                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": " + e.getMessage());
                }
            }
            // Guardar todos los nuevos docentes en lote
            if (!nuevosDocentes.isEmpty()) {
                docenteRepository.saveAll(nuevosDocentes);
            }
        }
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("creados", creados);
        resultado.put("ignorados", ignorados);
        resultado.put("filasIgnoradas", filasIgnoradas);
        resultado.put("errores", errores);
        return resultado;
    }

    private String obtenerTexto(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                double val = cell.getNumericCellValue();
                if (val == (long) val) yield String.valueOf((long) val).trim();
                else yield String.valueOf(val).trim();
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }
}
