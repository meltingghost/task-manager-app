import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TASK_COLORS } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface SearchAndFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedColorFilter: string | null;
  onColorFilterChange: (color: string | null) => void;
}

export function SearchAndFilterBar({
  searchValue,
  onSearchChange,
  selectedColorFilter,
  onColorFilterChange,
}: SearchAndFilterBarProps) {
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  return (
    <>
      <View style={[styles.row, { borderColor }]}>
        <View style={[styles.searchWrap, { borderColor }]}>
          <MaterialIcons name="search" size={20} color={iconColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search tasks..."
            placeholderTextColor={iconColor}
            value={searchValue}
            onChangeText={onSearchChange}
            accessibilityLabel="Search tasks"
          />
        </View>
        <Pressable
          onPress={() => setColorModalVisible(true)}
          style={[styles.filterButton, { borderColor }]}
          accessibilityLabel="Filter by color"
          accessibilityRole="button"
        >
          <MaterialIcons name="palette" size={22} color={selectedColorFilter ?? iconColor} />
          {selectedColorFilter !== null && (
            <View
              style={[styles.filterDot, { backgroundColor: selectedColorFilter }]}
            />
          )}
        </Pressable>
      </View>

      <Modal
        visible={colorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setColorModalVisible(false)}
      >
        <Pressable
          style={styles.colorModalOverlay}
          onPress={() => setColorModalVisible(false)}
        >
          <View style={[styles.colorModalContent, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText style={styles.colorModalTitle}>Filter by color</ThemedText>
            <Pressable
              onPress={() => {
                onColorFilterChange(null);
                setColorModalVisible(false);
              }}
              style={[
                styles.colorOption,
                selectedColorFilter === null && { backgroundColor: tintColor },
              ]}
            >
              <ThemedText style={selectedColorFilter === null ? styles.colorOptionTextActive : undefined}>
                All colors
              </ThemedText>
            </Pressable>
            {TASK_COLORS.map(({ hex }) => (
              <Pressable
                key={hex}
                onPress={() => {
                  onColorFilterChange(hex);
                  setColorModalVisible(false);
                }}
                style={[
                  styles.colorOptionRow,
                  selectedColorFilter === hex && { backgroundColor: tintColor },
                ]}
              >
                <View style={[styles.colorOptionChip, { backgroundColor: hex }]} />
                <ThemedText style={selectedColorFilter === hex ? styles.colorOptionTextActive : undefined}>
                  {hex}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    minWidth: 0,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterDot: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  colorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  colorModalContent: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  colorModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  colorOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  colorOptionChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  colorOptionTextActive: {
    color: '#fff',
  },
});
