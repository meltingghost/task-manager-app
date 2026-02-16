/**
 * Reusable modal shell (overlay, title, children). Tap overlay to close.
 */
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BaseModal({ visible, onClose, title, children }: BaseModalProps) {
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

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
        accessibilityRole="none"
      >
        <Pressable
          style={[styles.card, { backgroundColor: cardBg, borderColor }]}
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          <ThemedText style={[styles.title, { color: textColor }]}>{title}</ThemedText>
          <View style={styles.content}>{children}</View>
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  content: {},
});
