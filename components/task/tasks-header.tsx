import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export function TasksHeader() {
  const tintColor = useThemeColor({}, 'tint');
  const exitColor = useThemeColor({}, 'exit');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
      <View style={[styles.titlePill, { backgroundColor: surfaceColor }]}>
        <MaterialIcons name="assignment" size={24} color={tintColor} style={styles.titleIcon} />
        <Text style={[styles.titleText, { color: textColor }]}>Your Tasks</Text>
      </View>

      <Pressable
        onPress={openMenu}
        style={({ pressed, hovered }) => [
          styles.avatar,
          { backgroundColor: tintColor },
          (pressed || hovered) && styles.avatarHover,
        ]}
        accessibilityLabel="User menu"
        accessibilityRole="button"
      >
        <MaterialIcons name="person" size={28} color="#fff" />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.menuOverlay} onPress={closeMenu}>
          <View style={[styles.menuCard, { backgroundColor: cardBg }]}>
          <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => {
                closeMenu();
                // Here you would call your logout logic
              }}
            >
              <MaterialIcons name="person" size={22} color={textColor} />
              <Text style={[styles.menuItemText, { color: textColor }]}>My Profile</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => {
                closeMenu();
                // Here you would call your logout logic
              }}
            >
              <MaterialIcons name="logout" size={22} color={exitColor} />
              <Text style={[styles.menuItemText, { color: exitColor }]}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  titlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 10,
  },
  titleIcon: {
    marginLeft: 2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarHover: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  menuCard: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
