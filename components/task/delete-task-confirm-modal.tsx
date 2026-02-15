/**
 * Confirmation before deleting a task.
 */
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface DeleteTaskConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTaskConfirmModal({
  visible,
  onClose,
  onConfirm,
}: DeleteTaskConfirmModalProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');
  const exitColor = useThemeColor({}, 'exit');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        accessibilityLabel="Close modal"
        accessibilityRole="button"
      >
        <Pressable
          style={[styles.card, { backgroundColor: cardBg, borderColor }]}
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          <ThemedText style={[styles.title, { color: textColor }]}>Delete task</ThemedText>
          <ThemedText style={[styles.message, { color: textColor }]}>
            Are you sure you want to delete this task?
            This action cannot be undone.
          </ThemedText>
          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: surfaceColor },
                pressed && styles.pressed,
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
                styles.buttonDanger,
                { backgroundColor: exitColor },
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Delete task"
              accessibilityRole="button"
            >
              <ThemedText style={styles.buttonDangerText}>Delete</ThemedText>
            </Pressable>
          </View>
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
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
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDanger: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDangerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  pressed: {
    opacity: 0.7,
  },
});
