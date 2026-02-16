/**
 * Modal to set display name and avatar icon. Used from header menu.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

const AVATAR_ICONS: ComponentProps<typeof MaterialIcons>['name'][] = [
  'person',
  'face',
  'account-circle',
  'badge',
  'psychology',
  'school',
];

export interface ProfileModalProps {
  visible: boolean;
  nameDraft: string;
  iconDraft: ComponentProps<typeof MaterialIcons>['name'];
  onNameDraftChange: (value: string) => void;
  onIconDraftChange: (icon: ComponentProps<typeof MaterialIcons>['name']) => void;
  onClose: () => void;
  onSave: () => void;
}

export function ProfileModal({
  visible,
  nameDraft,
  iconDraft,
  onNameDraftChange,
  onIconDraftChange,
  onClose,
  onSave,
}: ProfileModalProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');
  const tintColor = useThemeColor({}, 'tint');

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

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
        accessibilityRole="none"
      >
        <Pressable
          style={[styles.card, { backgroundColor: cardBg, borderColor }]}
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          <Text style={[styles.title, { color: textColor }]}>My Profile</Text>
          <Text style={[styles.label, { color: iconColor }]}>Display name</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor, backgroundColor: surfaceColor }]}
            placeholder="Your name"
            placeholderTextColor={iconColor}
            value={nameDraft}
            onChangeText={onNameDraftChange}
            accessibilityLabel="Display name"
          />
          <Text style={[styles.label, { color: iconColor, marginTop: 16 }]}>Avatar icon</Text>
          <View style={styles.iconRow}>
            {AVATAR_ICONS.map((name) => (
              <Pressable
                key={name}
                onPress={() => onIconDraftChange(name)}
                style={[
                  styles.iconOption,
                  { borderColor },
                  iconDraft === name && { backgroundColor: tintColor, borderColor: tintColor },
                ]}
                accessibilityLabel={`Select icon ${name}`}
                accessibilityRole="button"
              >
                <MaterialIcons
                  name={name}
                  size={28}
                  color={iconDraft === name ? '#fff' : textColor}
                />
              </Pressable>
            ))}
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, { color: textColor }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onSave}
              style={[styles.button, styles.buttonPrimary, { backgroundColor: tintColor }]}
              accessibilityLabel="Save profile"
              accessibilityRole="button"
            >
              <Text style={styles.buttonPrimaryText}>Save</Text>
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
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  iconOption: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonPrimary: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
