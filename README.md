# Task Manager App

Aplicación de gestión de tareas desarrollada con React Native (Expo). Permite añadir tareas, marcarlas como completadas, editarlas y eliminarlas, con filtros por estado y soporte para tema claro/oscuro.

## Requisitos

- Node.js (v18 o superior recomendado)
- npm o yarn
- [Expo Go](https://expo.dev/go) (opcional, para probar en dispositivo físico)

## Cómo ejecutar

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar el proyecto:

   ```bash
   npx expo start
   ```

3. Abrir la app:
   - **iOS**: pulsar `i` en la terminal o escanear el QR con la cámara.
   - **Android**: pulsar `a` en la terminal o escanear el QR con Expo Go.
   - **Web**: pulsar `w` en la terminal.

## Funcionalidades

- **Añadir tarea**: campo de texto y botón "Añadir"; se puede enviar también con Intro.
- **Marcar como completada**: tocar el icono circular junto a la tarea; las completadas se muestran tachadas y con check.
- **Eliminar tarea**: tocar el icono de papelera; se muestra confirmación antes de borrar.
- **Editar tarea**: mantener pulsado el texto de la tarea para entrar en modo edición; guardar o cancelar.
- **Filtros**: pestañas "Todas", "Pendientes" y "Hechas" para filtrar la lista.
- **Tema**: la app respeta el tema claro/oscuro del sistema.
- **Feedback háptico**: al marcar completada y al eliminar (en dispositivos compatibles).
- **Animaciones**: entrada suave al añadir una nueva tarea (Reanimated).

## Estructura del proyecto

- `types/task.ts`: tipo e interfaz de una tarea.
- `hooks/use-tasks.ts`: hook con el estado de las tareas y las acciones (añadir, completar, eliminar, actualizar).
- `components/task/`: componentes de la lista de tareas:
  - `add-task-input.tsx`: input y botón para añadir.
  - `task-item.tsx`: fila de una tarea (checkbox, título, edición, borrar).
  - `task-list.tsx`: lista con `FlatList` y estado vacío.
- `app/(tabs)/index.tsx`: pantalla principal (Tareas) con filtros y uso del hook.

## Dependencias destacadas

- **Expo (SDK 54)**: entorno y herramientas para React Native.
- **React Native**: framework de UI.
- **TypeScript**: tipado estático.
- **Expo Router**: enrutamiento basado en archivos (carpeta `app/`).
- **react-native-reanimated**: animaciones de entrada para las tareas.
- **expo-haptics**: feedback háptico al completar y eliminar.
- **@expo/vector-icons**: iconos (Material Icons) en la interfaz.

El estado de las tareas es solo en memoria (no hay persistencia). Para guardar entre sesiones se podría extender el hook con `expo-secure-store` o `AsyncStorage`.
