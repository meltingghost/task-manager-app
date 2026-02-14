import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

import { AddListModal } from '@/components/task/add-list-modal';
import { AddTaskModal } from '@/components/task/add-task-modal';
import { FloatingAddButton } from '@/components/task/floating-add-button';
import { SearchAndFilterBar } from '@/components/task/search-and-filter-bar';
import { TaskList } from '@/components/task/task-list';
import { TasksHeader } from '@/components/task/tasks-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLists } from '@/hooks/use-lists';
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

function filterByList(tasks: Task[], listId: string): Task[] {
  return tasks.filter((t) => t.listId === listId);
}

export type TabFilter = TaskFilter | string;

function isTaskFilter(value: TabFilter): value is TaskFilter {
  return value === 'all' || value === 'active' || value === 'completed';
}

export default function TasksScreen() {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const { lists, addList } = useLists();
  const [filter, setFilter] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [addListModalVisible, setAddListModalVisible] = useState(false);

  const filteredTasks = useMemo(() => {
    let result: Task[];
    if (isTaskFilter(filter)) {
      result = filterByStatus(tasks, filter);
    } else {
      result = filterByList(tasks, filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (colorFilter !== null) {
      result = result.filter((t) => (t.color ?? '') === colorFilter);
    }
    return result;
  }, [tasks, filter, searchQuery, colorFilter]);

  const currentListId = isTaskFilter(filter) ? undefined : filter;

  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({}, 'card');
  const tabBarBg = colorScheme === 'dark' ? '#8ea8bd' : '#b5daf7';
  const tabInactiveBg = colorScheme === 'dark' ? '#93999e' : '#e8f4fc';

  const mainTabs: { key: TaskFilter; label: string }[] = [
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
        style={[styles.tabsScroll, { backgroundColor: tabBarBg }]}
        contentContainerStyle={styles.tabsContent}
      >
        {mainTabs.map(({ key, label }) => {
          const isSelected = filter === key;
          return (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              style={[
                styles.tab,
                isSelected && [styles.tabSelected, { backgroundColor: cardBg }],
                !isSelected && { backgroundColor: tabInactiveBg },
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
                  { color: textColor },
                  isSelected && styles.tabTextActive,
                ]}
              >
                {label}
              </ThemedText>
            </Pressable>
          );
        })}
        {lists.map((list) => {
          const isSelected = filter === list.id;
          return (
            <Pressable
              key={list.id}
              onPress={() => setFilter(list.id)}
              style={[
                styles.tab,
                isSelected && [styles.tabSelected, { backgroundColor: cardBg }],
                !isSelected && { backgroundColor: tabInactiveBg },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Show list ${list.name}`}
              accessibilityState={{ selected: isSelected }}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: textColor },
                  isSelected && styles.tabTextActive,
                ]}
                numberOfLines={1}
              >
                {list.name}
              </ThemedText>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => setAddListModalVisible(true)}
          style={[styles.tab, { backgroundColor: tabInactiveBg }]}
          accessibilityRole="button"
          accessibilityLabel="Add list"
        >
          <MaterialIcons name="add" size={18} color={textColor} style={styles.tabAddIcon} />
          <ThemedText style={[styles.tabTextAdd, { color: textColor }]}>Add List</ThemedText>
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
        onSubmit={(title, color) => addTask(title, color, currentListId)}
      />

      <AddListModal
        visible={addListModalVisible}
        onClose={() => setAddListModalVisible(false)}
        onCreateList={addList}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabsScroll: {
    paddingTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 40,
    justifyContent: 'center',
    marginBottom: -1,
  },
  tabSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    opacity: 0.95,
  },
  tabTextActive: {
    fontWeight: '600',
    opacity: 1,
  },
  tabAddIcon: {
    marginRight: 4,
  },
  tabTextAdd: {
    fontSize: 13,
    fontWeight: '500',
  },
});
