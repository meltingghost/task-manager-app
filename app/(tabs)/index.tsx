import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AddListModal } from '@/components/task/add-list-modal';
import { AddTaskModal } from '@/components/task/add-task-modal';
import { FloatingAddButton } from '@/components/task/floating-add-button';
import { SearchAndFilterBar } from '@/components/task/search-and-filter-bar';
import { TaskList } from '@/components/task/task-list';
import { TasksHeader } from '@/components/task/tasks-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';

export type TaskFilter = 'all' | 'active' | 'completed';

function filterByStatus(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}

export default function TasksScreen() {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [addListModalVisible, setAddListModalVisible] = useState(false);

  const filteredTasks = useMemo(() => {
    let result = filterByStatus(tasks, filter);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (colorFilter !== null) {
      result = result.filter((t) => (t.color ?? '') === colorFilter);
    }
    return result;
  }, [tasks, filter, searchQuery, colorFilter]);

  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const tabLabels: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'Everything' },
    { key: 'active', label: 'Undone' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <ThemedView style={styles.container}>
      <TasksHeader />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsScroll, { borderBottomColor: borderColor }]}
        contentContainerStyle={styles.tabsContent}
      >
        {tabLabels.map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setFilter(key)}
            style={[styles.tab, filter === key && { borderBottomColor: tintColor }]}
            accessibilityRole="button"
            accessibilityLabel={
              key === 'all' ? 'Show all tasks' : key === 'active' ? 'Show undone' : 'Show done'
            }
            accessibilityState={{ selected: filter === key }}
          >
            <ThemedText
              style={[styles.tabText, filter === key && styles.tabTextActive]}
            >
              {label}
            </ThemedText>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setAddListModalVisible(true)}
          style={styles.tab}
          accessibilityRole="button"
          accessibilityLabel="Add list"
        >
          <ThemedText style={styles.tabTextAdd}>+Add List</ThemedText>
        </Pressable>
      </ScrollView>

      <SearchAndFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColorFilter={colorFilter}
        onColorFilterChange={setColorFilter}
      />

      <View style={styles.listWrap}>
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </View>

      <FloatingAddButton onPress={() => setAddTaskModalVisible(true)} />

      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        onSubmit={(title, color) => addTask(title, color)}
      />

      <AddListModal
        visible={addListModalVisible}
        onClose={() => setAddListModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsScroll: {
    maxHeight: 48,
    borderBottomWidth: 1,
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    opacity: 0.85,
  },
  tabTextActive: {
    opacity: 1,
    fontWeight: '600',
  },
  tabTextAdd: {
    fontSize: 14,
    fontWeight: '600',
  },
  listWrap: {
    flex: 1,
  },
});
