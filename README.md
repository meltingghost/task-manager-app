# Task Manager App

A task management app built with React Native (Expo). Add tasks, mark them complete, edit and delete them, with filters by status, custom lists, and light/dark theme support.

## Requirements

- Node.js (v18 or higher recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) (optional, for testing on a physical device)

## How to run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the project:

   ```bash
   npx expo start
   ```

3. Open the app:
   - **iOS**: press `i` in the terminal or scan the QR code with the camera.
   - **Android**: press `a` in the terminal or scan the QR code with Expo Go.
   - **Web**: press `w` in the terminal.

## Features

- **Add task**: FAB opens a modal with title and color picker; new tasks can be assigned to a list.
- **Mark as complete**: tap the circle icon next to the task; completed tasks show with a check and strikethrough.
- **Delete task**: tap the trash icon; a confirmation modal appears before deleting.
- **Edit task**: tap the edit icon next to the title or long-press the title to enter edit mode; save or cancel.
- **Add to list**: assign a task to one or more user-created lists via the list icon; tasks can belong to multiple lists.
- **Filters**: "Everything", "Undone", and "Done" tabs, plus one tab per custom list.
- **Custom lists**: create lists from the "Add List" tab; long-press a list tab to rename or delete it.
- **Search and color filter**: search by task title and filter by task color.
- **Theme**: app follows the system light/dark theme.
- **Login**: simple login screen; session is persisted so reloads do not log you out (logout only when you tap Logout).
- **Profile**: set display name and avatar icon from the header menu; title shows "[Name]'s Tasks" when set.
- **Haptic feedback**: when toggling tasks, deleting, and on supported devices.
- **Animations**: smooth entry when adding a new task (Reanimated).
- **Toasts**: success messages when creating/editing/deleting tasks, lists, and profile.

## Project structure

```
app/
├── (tabs)/
│   ├── _layout.tsx      # Tabs layout (single screen)
│   └── index.tsx        # Main Tasks screen (tabs, filters, list modals)
├── _layout.tsx          # Root layout, theme, auth guard
└── login.tsx             # Login screen

components/
├── task/                 # Task feature UI
│   ├── add-list-modal.tsx
│   ├── add-task-modal.tsx
│   ├── empty-state.tsx
│   ├── floating-add-button.tsx
│   ├── search-and-filter-bar.tsx
│   ├── task-item.tsx
│   ├── task-list.tsx
│   └── tasks-header.tsx
└── ui/                   # Shared UI primitives
    ├── base-modal.tsx    # Reusable modal (overlay + card + title)
    └── toast.tsx

contexts/
└── auth-context.tsx      # Auth state + AsyncStorage persistence

hooks/
├── use-color-scheme.ts
├── use-lists.ts          # List CRUD
├── use-tasks.ts          # Task CRUD + list assignment
└── use-theme-color.ts

types/
├── list.ts
└── task.ts

utils/
└── task-filters.ts       # Filter logic (status, list, search, color)

constants/
└── theme.ts              # Light/dark colors, task color palette
```

## Key dependencies

- **Expo (SDK 54)**: tooling and runtime for React Native.
- **React Native**: UI framework.
- **TypeScript**: static typing.
- **Expo Router**: file-based routing (`app/` directory).
- **react-native-reanimated**: entry animations for tasks.
- **expo-haptics**: haptic feedback on complete and delete.
- **@expo/vector-icons**: icons (Material Icons) in the UI.
- **@react-native-async-storage/async-storage**: session persistence for login.

Task and list data are kept in memory only (no persistence). To persist tasks across sessions you could extend the hooks with AsyncStorage or another storage layer.
