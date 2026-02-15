/**
 * Options for a list (rename, delete). Opened from long-press on a list tab.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BaseModal } from '@/components/ui/base-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { List } from '@/types/list';

export interface ListOptionsModalProps {
  visible: boolean;
  list: List | null;
  onClose: () => void;
  onRename: (list: List) => void;
  onDelete: (list: List) => void;
}

export function ListOptionsModal({
  visible,
  list,
  onClose,
  onRename,
  onDelete,
}: ListOptionsModalProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const exitColor = useThemeColor({}, 'exit');

  if (!list) return null;

  return (
    <BaseModal visible={visible} onClose={onClose} title={list.name}>
      <Pressable
        onPress={() => onRename(list)}
        style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
        accessibilityLabel="Rename list"
        accessibilityRole="button"
      >
        <MaterialIcons name="edit" size={22} color={iconColor} />
        <ThemedText style={[styles.optionText, { color: textColor }]}>Rename list</ThemedText>
      </Pressable>
      <Pressable
        onPress={() => onDelete(list)}
        style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
        accessibilityLabel="Delete list"
        accessibilityRole="button"
      >
        <MaterialIcons name="delete-outline" size={22} color={exitColor} />
        <ThemedText style={[styles.optionText, { color: exitColor }]}>Delete list</ThemedText>
      </Pressable>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
