import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TASK_COLORS } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, color: string) => void;
  onTaskAdded?: () => void;
}

export function AddTaskModal({ visible, onClose, onSubmit, onTaskAdded }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(TASK_COLORS[0].hex);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const handleSubmit = useCallback(() => {
    const trimmed = title.trim();
    if (trimmed) {
      onSubmit(trimmed, selectedColor);
      setTitle('');
      setSelectedColor(TASK_COLORS[0].hex);
      onClose();
      onTaskAdded?.();
    }
  }, [title, selectedColor, onSubmit, onClose, onTaskAdded]);

  const handleClose = useCallback(() => {
    setTitle('');
    setSelectedColor(TASK_COLORS[0].hex);
    onClose();
  }, [onClose]);

  const canSubmit = title.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={handleClose}
        accessibilityLabel="Close modal"
        accessibilityRole="button"
      >
        <Pressable
          style={[styles.content, { backgroundColor: cardBg, borderColor }]}
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          <ThemedText type="title" style={styles.title}>
            Add task
          </ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor }]}
            placeholder="Task title"
            placeholderTextColor={iconColor}
            value={title}
            onChangeText={setTitle}
            accessibilityLabel="Task title"
          />
          <View style={styles.colorSection}>
            <ThemedText style={styles.colorLabel}>Color</ThemedText>
            <View style={styles.colorRow}>
              {TASK_COLORS.map(({ hex }) => (
                <Pressable
                  key={hex}
                  onPress={() => setSelectedColor(hex)}
                  style={[
                    styles.colorChip,
                    { backgroundColor: hex },
                    selectedColor === hex && styles.colorChipSelected,
                    selectedColor === hex && { borderColor: tintColor },
                  ]}
                  accessibilityLabel={`Select color ${hex}`}
                  accessibilityRole="button"
                >
                  {selectedColor === hex && (
                    <MaterialIcons name="check" size={18} color="#333" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.pressed]}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <ThemedText type="defaultSemiBold">Cancel</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[
                styles.button,
                { backgroundColor: tintColor },
                !canSubmit && styles.buttonDisabled,
              ]}
              accessibilityLabel="Add task"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
            >
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
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
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  colorSection: {
    marginBottom: 24,
  },
  colorLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.9,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorChipSelected: {
    borderWidth: 3,
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
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
