# Task Manager App

A task management app built with React Native (Expo). Add tasks, mark them complete, edit and delete them, with filters by status, custom lists, and light/dark theme support.

## Requirements

- Node.js (v18 or higher recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) (optional, for testing on a physical device)

## How to run the project

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
│   └── index.tsx        # Main Tasks screen (orchestrates layout + modals)
├── _layout.tsx          # Root layout, theme, auth guard
└── login.tsx            # Login screen

components/
├── task/                 # Task feature UI
│   ├── add-list-modal.tsx
│   ├── add-task-modal.tsx
│   ├── add-task-to-list-modal.tsx   # Assign task to lists (from task item)
│   ├── delete-list-confirm-modal.tsx
│   ├── delete-task-confirm-modal.tsx
│   ├── empty-state.tsx
│   ├── floating-add-button.tsx
│   ├── list-options-modal.tsx       # Rename / delete list actions
│   ├── profile-modal.tsx            # Display name + avatar (from header)
│   ├── rename-list-modal.tsx
│   ├── search-and-filter-bar.tsx
│   ├── task-item.tsx                # Task row + edit inline
│   ├── task-list.tsx
│   ├── tasks-header.tsx             # Title + user menu
│   └── tasks-tab-bar.tsx            # Filter tabs + list tabs + Add list
└── ui/                   # Shared UI primitives
    ├── base-modal.tsx    # Reusable modal (overlay + card + title)
    └── toast.tsx

contexts/
└── auth-context.tsx      # Auth state + AsyncStorage persistence

hooks/
├── use-color-scheme.ts
├── use-list-modals.ts    # List options / rename / delete modal flow
├── use-lists.ts          # List CRUD
├── use-tasks.ts          # Task CRUD + list assignment (useReducer)
├── use-tasks-filter.ts   # Filter state + filtered task list
├── use-theme-color.ts
└── use-toast.ts          # Toast visibility + message

types/
├── list.ts
└── task.ts

utils/
└── task-filters.ts       # Filter logic (status, list, search, color)

constants/
└── theme.ts              # Light/dark colors, task color palette
```

### Component separation

UI is split so that **logic stays at the top** of each file and **large JSX blocks are moved into dedicated components**:

- **Tasks screen** (`app/(tabs)/index.tsx`): Uses `useToast`, `useTasksFilter`, and `useListModals` for toast, filter, and list-modal state; renders `TasksTabBar`, `TaskList`, and list modals (`ListOptionsModal`, `RenameListModal`, `DeleteListConfirmModal`) instead of inline tabs and modal content.
- **Task item** (`task-item.tsx`): Renders the task row and uses `AddTaskToListModal` and `DeleteTaskConfirmModal` for list assignment and delete confirmation instead of inline modals.
- **Tasks header** (`tasks-header.tsx`): Renders the title, avatar, and user menu; profile form lives in `ProfileModal`.

This keeps screens and feature components easier to read and test, with one clear place for state and handlers and smaller, reusable modal and tab components.

### Accessibility

The app uses React Native’s accessibility APIs so it works well with screen readers and other assistive technologies:

- **Labels and roles**: Interactive elements (buttons, links, inputs) have `accessibilityLabel` and `accessibilityRole` so their purpose is announced clearly (e.g. “Mark as complete”, “Delete task”, “Add task”).
- **State**: Where relevant, `accessibilityState` is used for `selected` and `disabled`, so filter tabs, color options, and disabled submit buttons are announced correctly.
- **Modals**: Modal overlays that close on tap have a “Close modal” label; content that only stops propagation uses `accessibilityRole="none"` to avoid duplicate focus targets.
- **Empty state**: The empty list view uses a single labelled container with `accessibilityRole="summary"` and hides decorative children from the accessibility tree to avoid redundant announcements.

This was done so that users who rely on screen readers or other accessibility tools can navigate the app, understand controls, and complete the same actions as everyone else, without depending on visual layout or icon recognition alone.

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

## Technical decisions

### Why useReducer (in use-tasks.ts)

Task state is managed with `useReducer` instead of `useState` plus multiple `useCallback` updaters for these reasons:

- **Single source of transitions**: All task updates (add, toggle completion, delete, update title, add/remove from list, remove list from all tasks) live in one pure reducer. That makes it easier to reason about how state can change and to extend behaviour (e.g. persistence, undo, or logging) in one place.
- **Pure reducer**: The reducer is a pure function `(state, action) => newState` with no side effects. Same inputs always produce the same output, which simplifies unit testing and debugging.
- **Explicit actions**: Actions use clear names (e.g. `TOGGLE_TASK_COMPLETION`, `UPDATE_TASK_TITLE`) so the intent of each update is obvious and the codebase stays consistent.

### Why this structure

The project is organised so that the main screen stays thin and logic lives in testable places:

- **Folder layout**: `app/` for routes, `components/` for UI (task-specific vs shared `ui/`), `hooks/` for state and side effects, `utils/` for pure helpers, `types/` and `constants/` for shared definitions. That keeps responsibilities clear and makes it easy to find code.
- **Component separation**: Logic and handlers stay at the top of each file; large JSX blocks (tabs, modals) are extracted into dedicated components so screens compose small pieces instead of one huge tree.
- **Custom hooks**: Toast, filter, and list-modals state are in hooks (`useToast`, `useTasksFilter`, `useListModals`) so the Tasks screen only wires props and the same behaviour can be reused or unit-tested without the UI.

### Why useToast, useListModals, and useTasksFilter

The main Tasks screen uses three custom hooks so that the screen component stays focused on layout and wiring instead of holding all state and callbacks:

- **`useToast()`**: Toast state (visible + message) and show/dismiss handlers live in one place. The same pattern can be reused on other screens (e.g. settings or profile) without duplicating logic. The screen only passes `visible`, `message`, `showToast`, and `dismissToast` into the `Toast` component.
- **`useTasksFilter(tasks)`**: Filter state (tab filter, search query, color) and the derived `filteredTasks` and `currentListId` are encapsulated here. The screen no longer mixes filter state with modal or toast logic, and the filtering behaviour can be tested or changed in one hook. The screen just passes the returned values into `TasksTabBar`, `SearchAndFilterBar`, and `TaskList`.
- **`useListModals({ ... })`**: The list-options → rename and list-options → delete flow involves several pieces of state (selected list, rename draft, delete confirmation) and many callbacks (open/close/save/confirm). Putting them in `useListModals` keeps the screen’s return statement short and makes the flow reusable or testable in isolation. The hook receives the list CRUD and toast functions plus the current filter so it can reset the active tab when the user deletes the list they’re viewing.

## What would you improve with more time

- **Tests**: Add unit tests for the pure logic (e.g. `tasksReducer` in `use-tasks.ts`, `filterTasks` in `task-filters.ts`) and integration or component tests for critical flows (add task, toggle completion, filter by list). The current structure (hooks + utils) makes it straightforward to test behaviour without the UI.
