/**
 * Theme colors: light/dark with a light-blue (celeste) palette.
 * TASK_COLORS are used for task color picker in Add task modal.
 */

import { Platform } from 'react-native';

const tintColorLight = '#2E9FD4';
const tintColorDark = '#87CEEB';

export const Colors = {
  light: {
    text: '#0F2D42',
    background: '#F0F9FF',
    tint: tintColorLight,
    icon: '#5EB8E0',
    tabIconDefault: '#87CEEB',
    tabIconSelected: tintColorLight,
    card: '#fff',
    border: '#B8E0F0',
  },
  dark: {
    text: '#E0F4FF',
    background: '#0D2137',
    tint: tintColorDark,
    icon: '#87CEEB',
    tabIconDefault: '#5EB8E0',
    tabIconSelected: tintColorDark,
    card: '#152D47',
    border: '#2E5A7A',
  },
};

export type TaskColorId = string;

export const TASK_COLORS: { id: string; hex: string }[] = [
  { id: 'sky', hex: '#87CEEB' },
  { id: 'aqua', hex: '#5EB8E0' },
  { id: 'teal', hex: '#2E9FD4' },
  { id: 'mint', hex: '#7FDBDA' },
  { id: 'powder', hex: '#B8E0F0' },
  { id: 'steel', hex: '#4682B4' },
  { id: 'cyan', hex: '#00BCD4' },
  { id: 'light', hex: '#E0F4FF' },
];

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
