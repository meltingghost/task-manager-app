/**
 * Theme: white + blue combination.
 * Light: white backgrounds with light blue bands and blue accents.
 * TASK_COLORS are used for task color picker in Add task modal.
 */

import { Platform } from 'react-native';

const bluePrimary = '#2563EB';
const blueLight = '#3B82F6';
const blueMuted = '#93C5FD';
const blueBg = '#EFF6FF';
const blueBorder = '#BFDBFE';
const redPrimary = '#FF0000';

export const Colors = {
  light: {
    text: '#1E3A5F',
    background: '#FFFFFF',
    tint: bluePrimary,
    icon: blueLight,
    tabIconDefault: blueMuted,
    tabIconSelected: bluePrimary,
    card: '#FFFFFF',
    border: blueBorder,
    surface: blueBg,
    exit: redPrimary,
  },
  dark: {
    text: '#E0F4FF',
    background: '#0F172A',
    tint: blueMuted,
    icon: '#93C5FD',
    tabIconDefault: '#64748B',
    tabIconSelected: blueMuted,
    card: '#1E293B',
    border: '#334155',
    surface: '#1E293B',
    exit: redPrimary,
  },
};

export type TaskColorId = string;

export const TASK_COLORS: { id: string; name: string; hex: string }[] = [
  { id: 'sky', name: 'Sky', hex: '#87CEEB' },
  { id: 'coral', name: 'Coral', hex: '#FF7F50' },
  { id: 'mint', name: 'Mint', hex: '#98D8AA' },
  { id: 'lavender', name: 'Lavender', hex: '#E6E6FA' },
  { id: 'gold', name: 'Gold', hex: '#FFD700' },
  { id: 'salmon', name: 'Salmon', hex: '#FA8072' },
  { id: 'teal', name: 'Teal', hex: '#20B2AA' },
  { id: 'violet', name: 'Violet', hex: '#EE82EE' },
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
