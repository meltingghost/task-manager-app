/**
 * Confirmation before deleting a list. Tasks are removed from the list.
 */
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BaseModal } from '@/components/ui/base-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { List } from '@/types/list';

export interface DeleteListConfirmModalProps {
  visible: boolean;
  list: List | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteListConfirmModal({
  visible,
  list,
  onClose,
  onConfirm,
}: DeleteListConfirmModalProps) {
  const textColor = useThemeColor({}, 'text');
  const surfaceColor = useThemeColor({}, 'surface');
  const exitColor = useThemeColor({}, 'exit');

  return (
    <BaseModal visible={visible} onClose={onClose} title="Delete list">
      <ThemedText style={[styles.message, { color: textColor }]}>
        {list ? `Delete "${list.name}"? Tasks will be removed from this list.` : ''}
      </ThemedText>
      <View style={styles.actions}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: surfaceColor },
            pressed && styles.buttonPressed,
          ]}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <ThemedText style={[styles.buttonText, { color: textColor }]}>Cancel</ThemedText>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: exitColor },
            pressed && styles.buttonPressed,
          ]}
          accessibilityLabel="Delete list"
          accessibilityRole="button"
        >
          <ThemedText style={styles.buttonPrimaryText}>Delete</ThemedText>
        </Pressable>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
