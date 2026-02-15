/**
 * Modal to rename the selected list.
 */
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BaseModal } from '@/components/ui/base-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface RenameListModalProps {
  visible: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function RenameListModal({
  visible,
  draft,
  onDraftChange,
  onClose,
  onSave,
}: RenameListModalProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const surfaceColor = useThemeColor({}, 'surface');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={handleClose} title="Rename list">
      <TextInput
        style={[styles.input, { color: textColor, borderColor, backgroundColor: surfaceColor }]}
        placeholder="List name"
        placeholderTextColor={iconColor}
        value={draft}
        onChangeText={onDraftChange}
        accessibilityLabel="List name"
      />
      <View style={styles.actions}>
        <Pressable
          onPress={handleClose}
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
          onPress={onSave}
          disabled={!draft.trim()}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: tintColor },
            !draft.trim() && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          accessibilityLabel="Save list name"
          accessibilityRole="button"
          accessibilityState={{ disabled: !draft.trim() }}
        >
          <ThemedText style={styles.buttonPrimaryText}>Save</ThemedText>
        </Pressable>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
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
    minWidth: 90,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
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
