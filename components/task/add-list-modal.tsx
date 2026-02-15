/**
 * Modal to create a new list (name only).
 */
import { useCallback, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AddListModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateList: (name: string) => void;
  onListCreated?: () => void;
}

export function AddListModal({ visible, onClose, onCreateList, onListCreated }: AddListModalProps) {
  const [listName, setListName] = useState('');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const handleCreate = useCallback(() => {
    const trimmed = listName.trim();
    if (trimmed) {
      onCreateList(trimmed);
      setListName('');
      Keyboard.dismiss();
      onClose();
      onListCreated?.();
    }
  }, [listName, onCreateList, onClose, onListCreated]);

  const handleClose = useCallback(() => {
    setListName('');
    onClose();
  }, [onClose]);

  const canCreate = listName.trim().length > 0;

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
            Add List
          </ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor }]}
            placeholder="List name"
            placeholderTextColor={iconColor}
            value={listName}
            onChangeText={setListName}
            accessibilityLabel="List name"
          />
          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <ThemedText type="defaultSemiBold">Close</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              disabled={!canCreate}
              style={[
                styles.button,
                styles.createButton,
                { backgroundColor: tintColor },
                !canCreate && styles.buttonDisabled,
              ]}
              accessibilityLabel="Create list"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canCreate }}
            >
              <ThemedText style={styles.createButtonText}>Create</ThemedText>
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
    maxWidth: 360,
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
  createButton: {},
  buttonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
