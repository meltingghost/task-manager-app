import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export function EmptyState() {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.container}>
      <MaterialIcons name="assignment" size={72} color={iconColor} style={styles.icon} />
      <ThemedText style={styles.text}>No tasks yet</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    opacity: 0.9,
    fontFamily: 'Trebuchet MS',
  },
});
