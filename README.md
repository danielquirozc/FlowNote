# 📝 FlowNote

FlowNote es una aplicación full-stack de gestión de notas y conocimiento, inspirada en herramientas modernas de productividad, pero con una identidad visual propia.

Permite crear, organizar, editar y compartir notas mediante una experiencia rápida, limpia y enfocada en la escritura.

---

## ✨ Características

### 🖊️ Editor enriquecido

FlowNote utiliza un editor rich text basado en **Tiptap**, con soporte para:

- Texto enriquecido
- Títulos H1, H2 y H3
- Negrita
- Cursiva
- Tachado
- Código inline
- Listas
- Listas numeradas
- Checklists
- Citas
- Bloques de código
- Separadores
- Enlaces
- Imágenes

También incluye comandos rápidos mediante `/` para insertar bloques sin depender exclusivamente de la barra de herramientas.

---

### ⚡ Guardado automático

Las notas se guardan automáticamente mientras escribes.

El autosave utiliza debounce para evitar solicitudes innecesarias y mantiene estados claros como:

- Guardando...
- Guardado
- Error al guardar

FlowNote también intenta proteger los cambios pendientes cuando el usuario cambia rápidamente entre notas.

---

### 📁 Organización

Las notas pueden organizarse mediante:

- Carpetas
- Etiquetas
- Favoritos
- Archivadas
- Papelera

Esto permite mantener una estructura clara incluso cuando el número de notas comienza a crecer.

---

### 🔎 Búsqueda

FlowNote permite buscar notas utilizando:

- Título
- Contenido

La búsqueda funciona incluso cuando el contenido está almacenado como documentos JSON estructurados de Tiptap.

---

### 🌐 Compartir notas públicamente

Cada nota es privada por defecto.

El usuario puede generar un enlace público seguro para compartir una nota en modo solo lectura.

Las notas compartidas:

- No requieren autenticación
- No exponen información privada del propietario
- Utilizan un token público independiente del ID interno de la nota
- Pueden dejar de compartirse en cualquier momento

---

### 🔐 Autenticación y seguridad

FlowNote utiliza **Better Auth** para gestionar:

- Registro
- Inicio de sesión
- Cierre de sesión
- Sesiones persistentes
- Protección de rutas

Cada recurso pertenece exclusivamente al usuario autenticado.

Las operaciones del servidor validan la propiedad de:

- Notas
- Carpetas
- Etiquetas

El `userId` nunca se confía directamente desde el cliente.

---

### 🗑️ Papelera y recuperación

Eliminar una nota no la destruye inmediatamente.

FlowNote implementa soft delete mediante una papelera desde la cual puedes:

- Restaurar notas
- Eliminarlas permanentemente

---

### 🌎 Interfaz en español

Toda la experiencia principal de FlowNote está localizada al español, incluyendo:

- Navegación
- Editor
- Formularios
- Tooltips
- Estados vacíos
- Mensajes de error
- Autenticación
- Compartición pública

Las fechas utilizan formato localizado en español.

---

## 🎨 Diseño

FlowNote utiliza una interfaz minimalista y moderna orientada a productividad.

### Principios visuales

- Tema claro
- Superficies blancas
- Accent índigo
- Bordes suaves
- Controles ligeramente redondeados
- Espaciado compacto
- Jerarquía visual clara
- Diseño desktop-first

### Tipografías

- **Geist** para interfaz y navegación
- **Inter** para contenido de notas

---

## 🧰 Stack tecnológico

| Tecnología | Uso |
|---|---|
| Next.js | Framework principal |
| TypeScript | Tipado estático |
| React | Interfaz |
| Tailwind CSS | Estilos |
| shadcn/ui | Componentes UI |
| PostgreSQL | Base de datos |
| Prisma | ORM |
| Better Auth | Autenticación |
| Tiptap | Editor rich text |
| UploadThing | Subida de imágenes |
| Lucide Icons | Iconografía |

---

## 🏗️ Arquitectura

```text
Cliente
  │
  ▼
Next.js
  │
  ├── Server Components
  ├── Client Components
  └── Server Actions
          │
          ▼
     Better Auth
          │
          ▼
        Prisma
          │
          ▼
     PostgreSQL