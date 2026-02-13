import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
import { useTasks } from '@/hooks/use-tasks';
import { useThemeColor } from '@/hooks/use-theme-color';
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

  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const tabLabels: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'Everything' },
    { key: 'active', label: 'Undone' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <ThemedView>
      <TasksHeader />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsScroll, { backgroundColor: tintColor }]}
        contentContainerStyle={styles.tabsContent}
      >
        {tabLabels.map(({ key, label }) => {
          const isSelected = filter === key;
          return (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              style={[
                styles.tab,
                isSelected && styles.tabSelected,
                isSelected && {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                key === 'all' ? 'Show all tasks' : key === 'active' ? 'Show undone' : 'Show done'
              }
              accessibilityState={{ selected: isSelected }}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: isSelected ? tintColor : textColor },
                  isSelected && styles.tabTextActive,
                ]}
              >
                {label}
              </ThemedText>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => setAddListModalVisible(true)}
          style={styles.tabAdd}
          accessibilityRole="button"
          accessibilityLabel="Add list"
        >
          <MaterialIcons name="add" size={20} style={styles.tabAddIcon} />
          <ThemedText style={[styles.tabTextAdd]}>Add List</ThemedText>
        </Pressable>
      </ScrollView>

      <SearchAndFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColorFilter={colorFilter}
        onColorFilterChange={setColorFilter}
      />

      <View>
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
  tabsScroll: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tab: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabSelected: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  tabText: {
    fontSize: 14,
    opacity: 0.9,
  },
  tabTextActive: {
    fontWeight: '700',
    opacity: 1,
  },
  tabAdd: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    minHeight: 44,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabAddIcon: {
    marginLeft: 2,
  },
  tabTextAdd: {
    fontSize: 14,
    fontWeight: '500',
  },
});
