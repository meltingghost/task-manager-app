/**
 * Header with title pill and avatar. Avatar opens menu (profile, logout); profile modal for display name and icon.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileModal } from '@/components/task/profile-modal';
import { useAuth } from '@/contexts/auth-context';
import { useThemePreference } from '@/contexts/theme-preference-context';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface TasksHeaderProps {
  onProfileSaved?: () => void;
}

export function TasksHeader({ onProfileSaved }: TasksHeaderProps = {}) {
  const router = useRouter();
  const { signOut } = useAuth();
  const { preference, setPreference } = useThemePreference();
  const tintColor = useThemeColor({}, 'tint');
  const exitColor = useThemeColor({}, 'exit');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');

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
            <View style={[styles.themeSection, { borderTopColor: borderColor }]}>
              <Text style={[styles.themeSectionLabel, { color: textColor }]}>Theme</Text>
              {(['light', 'dark', 'system'] as const).map((option) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.themeOption,
                    pressed && styles.menuItemPressed,
                    preference === option && { backgroundColor: surfaceColor },
                  ]}
                  onPress={() => setPreference(option)}
                >
                  <MaterialIcons
                    name={
                      option === 'light'
                        ? 'light-mode'
                        : option === 'dark'
                          ? 'dark-mode'
                          : 'settings-brightness'
                    }
                    size={20}
                    color={preference === option ? tintColor : textColor}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: preference === option ? tintColor : textColor },
                    ]}
                  >
                    {option === 'light' ? 'Light' : option === 'dark' ? 'Dark' : 'System'}
                  </Text>
                  {preference === option && (
                    <MaterialIcons name="check" size={20} color={tintColor} style={styles.themeCheck} />
                  )}
                </Pressable>
              ))}
            </View>
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

      <ProfileModal
        visible={profileModalVisible}
        nameDraft={profileNameDraft}
        iconDraft={profileIconDraft}
        onNameDraftChange={setProfileNameDraft}
        onIconDraftChange={setProfileIconDraft}
        onClose={closeProfileModal}
        onSave={saveProfile}
      />
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
  themeSection: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  themeSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginLeft: 4,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  themeOptionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  themeCheck: {
    marginLeft: 'auto',
  },
});
