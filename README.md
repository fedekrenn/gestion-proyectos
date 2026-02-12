# Sistema de gestión de tareas

Sistema de gestión de proyectos para equipos de trabajo ágiles construido con Astro y React.

## 🚀 Características

- Gestión de tareas por roles (Jefe, Supervisor, Analista)
- Visualización de tareas personales y de equipo
- CRUD completo de tareas
- Estados de tareas (Pendiente, En progreso, Completada)
- Sistema de testing completo con Vitest

## 🛠️ Tecnologías

- [Astro](https://astro.build/) - Framework web
- [React](https://react.dev/) - Componentes interactivos
- [Vitest](https://vitest.dev/) - Framework de testing
- [React Testing Library](https://testing-library.com/react) - Testing de componentes

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install
```

## 🏃‍♂️ Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview
```

## 🧪 Testing

```bash
# Ejecutar tests en modo watch
pnpm test

# Ejecutar tests con UI
pnpm test:ui

# Ejecutar tests con cobertura
pnpm test:coverage
```

Para más información sobre testing, consulta [TESTING.md](./TESTING.md).

## 📁 Estructura del Proyecto

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Card.astro
│   │   ├── TaskList.jsx
│   │   └── ...
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── test/
│   │   ├── setup.ts
│   │   ├── TaskList.test.jsx
│   │   └── taskUtils.test.js
│   └── utils/
│       └── taskUtils.js
├── astro.config.mjs
├── vitest.config.ts
└── package.json
```

## 👥 Roles

- **Jefe**: Puede ver todas las tareas del equipo
- **Supervisor**: Puede ver tareas de los analistas
- **Analista**: Solo ve sus propias tareas

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Asegúrate de que todos los tests pasen (`pnpm test`)
2. Añade tests para nuevas funcionalidades
3. Sigue las convenciones de código del proyecto

## 📄 Licencia

Proyecto privado - © 2026 Federico Krenn
