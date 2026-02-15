/**
 * Horizontal tabs for status (all/undone/done), one tab per list, and "Add list". Long-press on list tab opens options.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { List } from '@/types/list';
import type { TaskFilter } from '@/utils/task-filters';

const MAIN_TABS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'Everything' },
  { key: 'active', label: 'Undone' },
  { key: 'completed', label: 'Done' },
];

export interface TasksTabBarProps {
  filter: string;
  lists: List[];
  onFilterChange: (filter: string) => void;
  onListOptions: (list: List) => void;
  onAddList: () => void;
}

export function TasksTabBar({
  filter,
  lists,
  onFilterChange,
  onListOptions,
  onAddList,
}: TasksTabBarProps) {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({}, 'card');
  const tabBarBg = colorScheme === 'dark' ? '#8ea8bd' : '#b5daf7';
  const tabInactiveBg = colorScheme === 'dark' ? '#93999e' : '#e8f4fc';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.tabsScroll, { backgroundColor: tabBarBg }]}
      contentContainerStyle={styles.tabsContent}
    >
      {MAIN_TABS.map(({ key, label }) => {
        const isSelected = filter === key;
        return (
          <Pressable
            key={key}
            onPress={() => onFilterChange(key)}
            style={({ pressed, hovered }) => [
              styles.tab,
              isSelected && [styles.tabSelected, { backgroundColor: cardBg }],
              !isSelected && { backgroundColor: tabInactiveBg },
              (pressed || hovered) && styles.tabPressed,
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
            onPress={() => onFilterChange(list.id)}
            onLongPress={() => onListOptions(list)}
            style={({ pressed, hovered }) => [
              styles.tab,
              isSelected && [styles.tabSelected, { backgroundColor: cardBg }],
              !isSelected && { backgroundColor: tabInactiveBg },
              (pressed || hovered) && styles.tabPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Show list ${list.name}. Long press to edit or delete.`}
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
        onPress={onAddList}
        style={({ pressed, hovered }) => [
          styles.tab,
          { backgroundColor: tabInactiveBg },
          (pressed || hovered) && styles.tabPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add list"
      >
        <MaterialIcons name="add" size={18} color={textColor} style={styles.tabAddIcon} />
        <ThemedText style={[styles.tabTextAdd, { color: textColor }]}>Add List</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabsScroll: {
    flexGrow: 0,
    flexShrink: 0,
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
  tabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
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
