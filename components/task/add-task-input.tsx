import { useCallback, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AddTaskInputProps {
  onAddTask: (title: string) => void;
}

export function AddTaskInput({ onAddTask }: AddTaskInputProps) {
  const [value, setValue] = useState('');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) {
      onAddTask(trimmed);
      setValue('');
      Keyboard.dismiss();
    }
  }, [value, onAddTask]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Nueva tarea..."
        placeholderTextColor={iconColor}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        accessibilityLabel="Campo para escribir una nueva tarea"
        accessibilityHint="Escribe y pulsa el botón Añadir o Intro para agregar"
      />
      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: tintColor },
          pressed && styles.pressed,
        ]}
        accessibilityLabel="Añadir tarea"
        accessibilityRole="button"
      >
        <ThemedText style={styles.buttonText}>Añadir</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 8,
    minWidth: 0,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
