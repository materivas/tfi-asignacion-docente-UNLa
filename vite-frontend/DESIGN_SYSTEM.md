# Sistema de Diseño - UNLa Gestión Docente

## 🎨 Paleta de Colores Institucional

### Colores Principales

- **Rojo UNLa (Principal)**: `#7A1F1F` - `var(--color-primary)`
  - Uso: Headers, botones primarios, títulos principales, navbar
  - Hover: `#5a1414` - `var(--color-primary-dark)`
  - Disabled: `#9a3333` - `var(--color-primary-light)`

- **Azul Académico (Secundario)**: `#1F5A7A` - `var(--color-secondary)`
  - Uso: Botones secundarios, badges, acentos
  - Hover: `#164558` - `var(--color-secondary-dark)`

### Colores de Fondo

- **Blanco**: `#FFFFFF` - `var(--color-white)`
- **Fondo Principal**: `#FFFFFF` - `var(--color-bg-primary)`
- **Fondo Secundario**: `#F9FAFB` - `var(--color-bg-secondary)`
- **Fondo Terciario**: `#F3F4F6` - `var(--color-bg-tertiary)`

### Escala de Grises

```css
--color-gray-50: #F9FAFB
--color-gray-100: #F3F4F6
--color-gray-200: #E5E7EB
--color-gray-300: #D1D5DB
--color-gray-400: #9CA3AF
--color-gray-500: #6B7280
--color-gray-600: #4B5563
--color-gray-700: #374151
--color-gray-800: #1F2937
--color-gray-900: #111827
```

### Colores de Estado

- **Éxito**: `#059669` - `var(--color-success)`
- **Advertencia**: `#D97706` - `var(--color-warning)`
- **Error**: `#DC2626` - `var(--color-error)`
- **Información**: `#2563EB` - `var(--color-info)`

---

## 📝 Tipografía

### Fuente Base
- **Familia**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Variable**: `var(--font-family-base)`

### Escalas de Tamaño

```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
--font-size-4xl: 2.25rem   /* 36px */
```

### Uso de Headings

- `<h1>`: Títulos de página principal - `var(--font-size-4xl)`
- `<h2>`: Subtítulos de sección - `var(--font-size-3xl)`
- `<h3>`: Encabezados de cards - `var(--font-size-2xl)`
- `<h4>`: Subsecciones - `var(--font-size-xl)`

---

## 📐 Espaciado

```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
```

---

## 🔲 Componentes

### Botones

#### Variantes

```html
<!-- Botón Primario -->
<button class="btn btn-primary">Guardar</button>

<!-- Botón Secundario -->
<button class="btn btn-secondary">Cancelar</button>

<!-- Botón Outline -->
<button class="btn btn-outline">Más opciones</button>

<!-- Botón Peligro -->
<button class="btn btn-danger">Eliminar</button>
```

#### Tamaños

```html
<button class="btn btn-primary btn-sm">Pequeño</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3>Título del Card</h3>
  </div>
  <div class="card-body">
    Contenido del card
  </div>
</div>
```

### Tablas

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Columna 1</th>
        <th>Columna 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dato 1</td>
        <td>Dato 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Formularios

```html
<div class="form-group">
  <label class="form-label">Nombre</label>
  <input type="text" class="form-input" placeholder="Ingrese nombre..." />
</div>

<div class="form-group">
  <label class="form-label">Categoría</label>
  <select class="form-select">
    <option>Seleccione...</option>
  </select>
</div>
```

### Alerts

```html
<div class="alert alert-success">✅ Operación exitosa</div>
<div class="alert alert-warning">⚠️ Advertencia importante</div>
<div class="alert alert-error">❌ Error detectado</div>
<div class="alert alert-info">ℹ️ Información relevante</div>
```

### Badges

```html
<span class="badge badge-primary">Activo</span>
<span class="badge badge-success">Confirmado</span>
<span class="badge badge-warning">Pendiente</span>
```

---

## 🎯 Bordes y Sombras

### Bordes Redondeados

```css
--border-radius-sm: 0.25rem   /* 4px */
--border-radius-md: 0.375rem  /* 6px */
--border-radius-lg: 0.5rem    /* 8px */
--border-radius-xl: 0.75rem   /* 12px */
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

---

## ⏱️ Transiciones

```css
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
--transition-slow: 300ms ease-in-out
```

---

## 🏗️ Layout Patterns

### Container Centrado

```tsx
<div className="container">
  {/* Contenido centrado con max-width */}
</div>
```

### Header de Página

```tsx
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
  }}>
    Título de la Página
  </h1>
  <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
    Descripción breve
  </p>
</div>
```

### Grid Responsive

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 'var(--spacing-xl)',
}}>
  {/* Cards o elementos */}
</div>
```

---

## ♿ Accesibilidad

### Contraste

- Textos principales: mínimo 4.5:1
- Textos grandes (18px+): mínimo 3:1
- Iconos y gráficos: mínimo 3:1

### Estados Interactivos

Todos los elementos interactivos deben tener:
- Estado `:hover` visible
- Estado `:focus` con outline o box-shadow
- Cursor pointer en elementos clickeables
- Transiciones suaves

### ARIA Labels

```tsx
<button aria-label="Cerrar modal">✕</button>
<div role="dialog" aria-modal="true">...</div>
```

---

## 📱 Responsive Design

### Breakpoints Sugeridos

```css
/* Mobile: 0-640px */
/* Tablet: 641-1024px */
/* Desktop: 1025px+ */
```

### Uso en Componentes

```tsx
<div style={{
  padding: 'var(--spacing-md)',
  '@media (min-width: 768px)': {
    padding: 'var(--spacing-xl)',
  }
}}>
```

---

## 🎨 Iconos

Utilizamos emojis para iconografía:

- 🏠 Inicio
- 📊 Tablero/Dashboard
- ⚙️ Configuración
- 👨‍🏫 Docentes
- 📖 Materias
- ✏️ Editar
- 🗑️ Eliminar
- ➕ Agregar
- 🔍 Buscar
- ✅ Éxito
- ❌ Error
- ⚠️ Advertencia
- ℹ️ Información

---

## 🚀 Buenas Prácticas

1. **Consistencia**: Usar siempre las variables CSS definidas
2. **Reutilización**: Aplicar clases CSS antes que estilos inline
3. **Semántica**: Usar etiquetas HTML apropiadas
4. **Feedback**: Proporcionar feedback visual en todas las interacciones
5. **Performance**: Optimizar animaciones y transiciones
6. **Accesibilidad**: Mantener contraste adecuado y navegación por teclado

---

## 📚 Ejemplos de Uso

### Página Completa

```tsx
<main style={{ flex: 1, backgroundColor: 'var(--color-bg-secondary)' }}>
  <div className="container" style={{ 
    paddingTop: 'var(--spacing-xl)', 
    paddingBottom: 'var(--spacing-2xl)' 
  }}>
    {/* Header */}
    <div style={{
      backgroundColor: 'var(--color-white)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--spacing-xl)',
      marginBottom: 'var(--spacing-xl)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h1>Título</h1>
      <p>Descripción</p>
    </div>

    {/* Contenido */}
    <div className="table-container">
      <table>
        {/* ... */}
      </table>
    </div>
  </div>
</main>
```

### Modal con Título

```tsx
<Modal onClose={handleClose} title="Nuevo Registro" size="lg">
  <form>
    <div class="form-group">
      <label class="form-label">Campo</label>
      <input class="form-input" type="text" />
    </div>
    <button class="btn btn-primary">Guardar</button>
  </form>
</Modal>
```

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0.0  
**Proyecto**: Sistema de Gestión Docente - Universidad Nacional de Lanús
