import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { List } from '@/types/list';

export interface AddTaskToListModalProps {
  visible: boolean;
  lists: List[];
  taskListIds: string[];
  onToggleList: (listId: string) => void;
  onClose: () => void;
}

export function AddTaskToListModal({
  visible,
  lists,
  taskListIds,
  onToggleList,
  onClose,
}: AddTaskToListModalProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: cardBg, borderColor }]}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedText style={[styles.title, { color: textColor }]}>Add to list</ThemedText>
          {lists.length === 0 ? (
            <ThemedText style={[styles.empty, { color: iconColor }]}>
              No lists yet. Create one from the tabs.
            </ThemedText>
          ) : (
            <ScrollView
              style={styles.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {lists.map((list) => {
                const isInList = taskListIds.includes(list.id);
                return (
                  <Pressable
                    key={list.id}
                    onPress={() => onToggleList(list.id)}
                    style={({ pressed }) => [
                      styles.row,
                      { borderBottomColor: borderColor },
                      pressed && styles.pressed,
                    ]}
                    accessibilityLabel={`${list.name}. ${isInList ? 'In list. Tap to remove.' : 'Not in list. Tap to add.'}`}
                    accessibilityRole="button"
                  >
                    <ThemedText
                      style={[styles.rowText, { color: textColor }]}
                      numberOfLines={1}
                    >
                      {list.name}
                    </ThemedText>
                    <MaterialIcons
                      name={isInList ? 'check-circle' : 'radio-button-unchecked'}
                      size={24}
                      color={isInList ? tintColor : iconColor}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
          <Pressable
            onPress={onClose}
            style={[styles.doneButton, { backgroundColor: surfaceColor }]}
          >
            <ThemedText style={[styles.doneText, { color: textColor }]}>Done</ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    marginBottom: 16,
  },
  scroll: {
    maxHeight: 240,
    marginHorizontal: -4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  doneButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
