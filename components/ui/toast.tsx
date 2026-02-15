/**
 * Toast notification (message and dismiss). Used for success and feedback messages.
 */
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

const AUTO_HIDE_MS = 2500;

export interface ToastProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export function Toast({ visible, message, onDismiss }: ToastProps) {
  const cardBg = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  useEffect(() => {
    if (!visible || !message) return;
    const timer = setTimeout(onDismiss, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [visible, message, onDismiss]);

  if (!visible || !message) return null;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        onPress={onDismiss}
        style={[styles.snack, { backgroundColor: cardBg, borderColor }]}
        accessibilityLabel={message}
        accessibilityRole="alert"
      >
        <MaterialIcons name="check-circle" size={22} color={tintColor} style={styles.icon} />
        <ThemedText style={styles.message} numberOfLines={2}>
          {message}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    alignItems: 'center',
  },
  snack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
