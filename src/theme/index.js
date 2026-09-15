/**
 * PediaPocket Theme Configuration
 * Centralized design tokens for consistent UI across the app
 */

// Color Palette
export const COLORS = {
  // Primary Brand Colors (Soft Pastels)
  primary: '#E8F2FF',        // Baby blue - main background
  primaryDark: '#B3D9FF',    // Darker blue for emphasis
  secondary: '#EAF7F3',      // Soft mint - alternate background
  accent: '#FFE8F0',         // Soft pink - highlights
  
  // Activity Type Colors (Vibrant for caregiver buttons)
  wetDiaper: '#4FC3F7',      // Light blue
  dirtyDiaper: '#A1887F',    // Brown/tan
  feed: '#FF7043',           // Coral/orange
  sleep: '#7E57C2',          // Purple
  
  // Semantic Colors
  success: '#66BB6A',        // Green
  error: '#EF5350',          // Red
  warning: '#FFA726',        // Orange
  info: '#42A5F5',           // Blue
  
  // Neutral Grays
  text: '#212121',           // Primary text (dark gray, not pure black)
  textLight: '#757575',      // Secondary text
  textMuted: '#BDBDBD',      // Disabled/placeholder text
  
  border: '#E0E0E0',         // Light borders
  divider: '#F5F5F5',        // Subtle dividers
  
  background: '#FFFFFF',     // Pure white background
  backgroundLight: '#FAFAFA', // Off-white for cards
  backgroundDark: '#F5F5F5', // Slightly darker for contrast
  
  // Overlay & Shadow
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
};

// Spacing System (8px base grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Typography
export const TYPOGRAPHY = {
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Border Radius
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Button Sizes (especially for caregiver large tap targets)
export const BUTTON_SIZES = {
  // Caregiver mode - large tap targets
  caregiver: {
    width: '100%',
    height: 120,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    iconSize: 48,
    borderRadius: RADIUS.lg,
  },
  
  // Standard buttons
  large: {
    height: 56,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.lg,
    iconSize: 24,
    borderRadius: RADIUS.md,
  },
  
  medium: {
    height: 44,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    iconSize: 20,
    borderRadius: RADIUS.md,
  },
  
  small: {
    height: 32,
    paddingHorizontal: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    iconSize: 16,
    borderRadius: RADIUS.sm,
  },
};

// Icon Sizes
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
  huge: 64,
};

// Shadow Styles (iOS & Android compatible)
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: COLORS.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  
  md: {
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  
  lg: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  xl: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Common Layout Styles
export const LAYOUT = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  contentPadding: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  
  card: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Activity Type Configuration (for buttons and timeline)
export const ACTIVITY_TYPES = {
  wet_diaper: {
    label: 'Wet Diaper',
    emoji: '💧',
    color: COLORS.wetDiaper,
    icon: 'wet_diaper',
  },
  dirty_diaper: {
    label: 'Dirty Diaper',
    emoji: '💩',
    color: COLORS.dirtyDiaper,
    icon: 'dirty_diaper',
  },
  feed: {
    label: 'Feed',
    emoji: '🍼',
    color: COLORS.feed,
    icon: 'feed',
  },
  sleep: {
    label: 'Sleep',
    emoji: '💤',
    color: COLORS.sleep,
    icon: 'sleep',
  },
};

// Animation Durations (milliseconds)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Z-Index Layers
export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  modal: 100,
  overlay: 1000,
  toast: 2000,
  tooltip: 3000,
};

export default {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  RADIUS,
  BUTTON_SIZES,
  ICON_SIZES,
  SHADOWS,
  LAYOUT,
  ACTIVITY_TYPES,
  ANIMATION,
  Z_INDEX,
};
