import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useCallback, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { useThemeColor } from '@/hooks/use-theme-color';

const AVATAR_ICONS: ComponentProps<typeof MaterialIcons>['name'][] = [
  'person',
  'face',
  'account-circle',
  'badge',
  'psychology',
  'school',
];

export interface TasksHeaderProps {
  onProfileSaved?: () => void;
}

export function TasksHeader({ onProfileSaved }: TasksHeaderProps = {}) {
  const router = useRouter();
  const { signOut } = useAuth();
  const tintColor = useThemeColor({}, 'tint');
  const exitColor = useThemeColor({}, 'exit');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const [menuVisible, setMenuVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarIcon, setAvatarIcon] = useState<ComponentProps<typeof MaterialIcons>['name']>('person');
  const [profileNameDraft, setProfileNameDraft] = useState('');
  const [profileIconDraft, setProfileIconDraft] = useState<ComponentProps<typeof MaterialIcons>['name']>('person');

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const openProfileModal = useCallback(() => {
    setProfileNameDraft(userName);
    setProfileIconDraft(avatarIcon);
    setProfileModalVisible(true);
    closeMenu();
  }, [userName, avatarIcon, closeMenu]);

  const closeProfileModal = useCallback(() => {
    Keyboard.dismiss();
    setProfileModalVisible(false);
  }, []);

  const saveProfile = useCallback(() => {
    setUserName(profileNameDraft.trim());
    setAvatarIcon(profileIconDraft);
    closeProfileModal();
    onProfileSaved?.();
  }, [profileNameDraft, profileIconDraft, closeProfileModal, onProfileSaved]);

  const titleText = userName.trim() ? `${userName.trim()}'s Tasks` : 'Your Tasks';

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
      <View style={[styles.titlePill, { backgroundColor: surfaceColor }]}>
        <MaterialIcons name="assignment" size={24} color={tintColor} style={styles.titleIcon} />
        <Text style={[styles.titleText, { color: textColor }]} numberOfLines={1}>
          {titleText}
        </Text>
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
        <MaterialIcons name={avatarIcon} size={28} color="#fff" />
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
              onPress={openProfileModal}
            >
              <MaterialIcons name="person" size={22} color={textColor} />
              <Text style={[styles.menuItemText, { color: textColor }]}>My Profile</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => {
                closeMenu();
                signOut();
                router.replace('/login');
              }}
            >
              <MaterialIcons name="logout" size={22} color={exitColor} />
              <Text style={[styles.menuItemText, { color: exitColor }]}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeProfileModal}
      >
        <Pressable style={styles.profileOverlay} onPress={closeProfileModal}>
          <Pressable
            style={[styles.profileCard, { backgroundColor: cardBg, borderColor }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.profileTitle, { color: textColor }]}>My Profile</Text>
            <Text style={[styles.profileLabel, { color: iconColor }]}>Display name</Text>
            <TextInput
              style={[styles.profileInput, { color: textColor, borderColor, backgroundColor: surfaceColor }]}
              placeholder="Your name"
              placeholderTextColor={iconColor}
              value={profileNameDraft}
              onChangeText={setProfileNameDraft}
              accessibilityLabel="Display name"
            />
            <Text style={[styles.profileLabel, { color: iconColor, marginTop: 16 }]}>Avatar icon</Text>
            <View style={styles.iconRow}>
              {AVATAR_ICONS.map((name) => (
                <Pressable
                  key={name}
                  onPress={() => setProfileIconDraft(name)}
                  style={[
                    styles.iconOption,
                    { borderColor },
                    profileIconDraft === name && { backgroundColor: tintColor, borderColor: tintColor },
                  ]}
                  accessibilityLabel={`Select icon ${name}`}
                  accessibilityRole="button"
                >
                  <MaterialIcons
                    name={name}
                    size={28}
                    color={profileIconDraft === name ? '#fff' : textColor}
                  />
                </Pressable>
              ))}
            </View>
            <View style={styles.profileActions}>
              <Pressable
                onPress={closeProfileModal}
                style={({ pressed }) => [styles.profileButton, pressed && styles.menuItemPressed]}
              >
                <Text style={[styles.profileButtonText, { color: textColor }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={saveProfile}
                style={[styles.profileButton, styles.profileButtonPrimary, { backgroundColor: tintColor }]}
              >
                <Text style={styles.profileButtonPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
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
  profileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  profileCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileInput: {
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
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  profileButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  profileButtonPrimary: {},
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileButtonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
