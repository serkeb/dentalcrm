# DentalCRM - Dashboard de Gestión

Un dashboard moderno y profesional para la gestión de clínicas dentales, desarrollado con React y Tailwind CSS.

![Dashboard Preview](./preview.png)

## 🎯 Características Principales

### Dashboard Interactivo
- **Métricas en tiempo real**: Visualización de citas, pacientes y operaciones
- **Gráficos dinámicos**: Mini gráficos de tendencias en las tarjetas de métricas
- **Encuesta hospitalaria**: Gráfico de barras interactivo con filtros por período
- **Gráfico circular**: Visualización del total de citas completadas vs próximas

### Gestión de Citas
- **Tabla completa de citas** con información detallada
- **Búsqueda en tiempo real** por paciente, doctor o estado
- **Filtros avanzados** para organizar la información
- **Acciones rápidas**: Ver, contactar, editar y eliminar citas
- **Estados visuales** con badges de colores

### Gestión de Doctores
- **Panel lateral** con estado en tiempo real de doctores
- **Modal de detalles** con información completa
- **Estados de disponibilidad**: En línea, Disponible, Ausente
- **Información profesional**: Experiencia, pacientes, calificaciones

### Funcionalidades Interactivas
- **Búsqueda global** en tiempo real
- **Filtros dinámicos** por período (Mes, Semana, Año)
- **Modales informativos** para detalles de doctores
- **Efectos hover** y transiciones suaves
- **Botones de acción** con iconos intuitivos

## 🛠 Tecnologías Utilizadas

- **React 18** - Framework principal
- **Tailwind CSS** - Estilos y diseño responsive
- **Shadcn/UI** - Componentes UI modernos
- **Lucide React** - Iconografía profesional
- **Vite** - Herramienta de desarrollo rápida

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd dental-crm-dashboard

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```

### Scripts Disponibles
```bash
# Desarrollo
pnpm run dev

# Construcción para producción
pnpm run build

# Vista previa de producción
pnpm run preview

# Linting
pnpm run lint
```

## 📱 Diseño Responsive

El dashboard está completamente optimizado para:
- **Desktop**: Experiencia completa con sidebar y todas las funcionalidades
- **Tablet**: Adaptación fluida con reorganización de elementos
- **Mobile**: Interfaz optimizada para dispositivos móviles

## 🎨 Diseño y UX

### Paleta de Colores
- **Azul primario**: `#3B82F6` - Elementos principales y navegación
- **Verde**: `#10B981` - Estados positivos y disponibilidad
- **Rojo**: `#EF4444` - Alertas y estados críticos
- **Gris**: `#6B7280` - Texto secundario y elementos neutros

### Tipografía
- **Font principal**: Inter (sistema por defecto)
- **Jerarquía clara**: H1-H6 bien definidos
- **Legibilidad optimizada**: Contraste y espaciado adecuados

## 📊 Estructura de Datos

### Citas (Appointments)
```javascript
{
  id: number,
  patient: string,
  doctor: string,
  date: string,
  time: string,
  status: string,
  statusColor: string,
  phone: string,
  email: string
}
```

### Doctores (Doctors)
```javascript
{
  id: number,
  name: string,
  specialty: string,
  status: 'online' | 'available' | 'absent',
  description: string,
  experience: string,
  patients: string,
  rating: number,
  nextAvailable: string
}
```

### Métricas (Stats)
```javascript
{
  title: string,
  value: string,
  change: string,
  subtitle: string,
  icon: LucideIcon,
  color: string,
  trend: number[]
}
```

## 🔧 Funcionalidades Implementadas

### ✅ Completadas
- [x] Dashboard principal con métricas
- [x] Gráficos interactivos (barras y circular)
- [x] Tabla de citas con búsqueda y filtros
- [x] Panel de doctores con estados
- [x] Modal de detalles de doctores
- [x] Búsqueda en tiempo real
- [x] Efectos hover y transiciones
- [x] Diseño responsive completo
- [x] Navegación funcional
- [x] Estados visuales con badges

### 🚧 Próximas Funcionalidades
- [ ] Integración con backend (Supabase)
- [ ] Autenticación de usuarios
- [ ] CRUD completo de citas
- [ ] Calendario interactivo
- [ ] Notificaciones push
- [ ] Exportación de datos
- [ ] Reportes avanzados
- [ ] Integración con WhatsApp
- [ ] Campos personalizables

## 📁 Estructura del Proyecto

```
dental-crm-dashboard/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/
│   │   └── ui/            # Componentes UI de Shadcn
│   ├── assets/            # Imágenes y recursos
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilidades
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos principales
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada
├── components.json        # Configuración Shadcn
├── tailwind.config.js     # Configuración Tailwind
├── vite.config.js         # Configuración Vite
└── package.json           # Dependencias
```

## 🎯 Casos de Uso

### Para Administradores
- Monitoreo general de la clínica
- Gestión de doctores y personal
- Análisis de métricas y rendimiento
- Configuración del sistema

### Para Recepcionistas
- Gestión de citas diarias
- Contacto con pacientes
- Consulta de disponibilidad de doctores
- Registro de nuevos pacientes

### Para Doctores
- Consulta de citas asignadas
- Revisión de historial de pacientes
- Actualización de estados
- Comunicación con el equipo

## 🔒 Seguridad y Mejores Prácticas

- **Validación de datos** en el frontend
- **Sanitización** de inputs de usuario
- **Estados de carga** para mejor UX
- **Manejo de errores** robusto
- **Código limpio** y mantenible
- **Componentes reutilizables**

## 🚀 Despliegue

### Desarrollo Local
```bash
pnpm run dev --host
# Accesible en http://localhost:5173
```

### Producción
```bash
pnpm run build
# Los archivos se generan en /dist
```

### Opciones de Hosting
- **Vercel** (recomendado para React)
- **Netlify** 
- **GitHub Pages**
- **Firebase Hosting**

## 📞 Soporte y Contacto

Para soporte técnico o consultas sobre el proyecto:
- Documentación completa en el código
- Comentarios detallados en componentes complejos
- Estructura modular para fácil mantenimiento

## 📄 Licencia

Este proyecto está desarrollado como una demostración de capacidades de desarrollo frontend moderno.

---

**Desarrollado con ❤️ usando React + Tailwind CSS**

