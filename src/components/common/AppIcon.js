import React from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';

/**
 * Unified icon component for PediaPocket
 * - Caregiver mode uses Ionicons (filled, rounded, large targets)
 * - Parent mode uses Feather (thin, outline, refined)
 */

const ICON_SETS = {
  ionicons: Ionicons,
  feather: Feather,
};

// Predefined icon mappings for common app actions
export const ICON_MAP = {
  // Activity types (Caregiver - Ionicons filled)
  wet_diaper: { set: 'ionicons', name: 'water', color: '#4FC3F7' },
  dirty_diaper: { set: 'ionicons', name: 'poo', color: '#A1887F' },
  feed: { set: 'ionicons', name: 'restaurant', color: '#FF7043' },
  sleep: { set: 'ionicons', name: 'moon', color: '#7E57C2' },
  
  // Navigation (Parent - Feather outline)
  dashboard: { set: 'feather', name: 'home', color: '#5C6BC0' },
  babyBook: { set: 'feather', name: 'book', color: '#66BB6A' },
  profile: { set: 'feather', name: 'user', color: '#42A5F5' },
  
  // Common actions (Feather)
  add: { set: 'feather', name: 'plus-circle', color: '#66BB6A' },
  edit: { set: 'feather', name: 'edit-2', color: '#5C6BC0' },
  delete: { set: 'feather', name: 'trash-2', color: '#EF5350' },
  close: { set: 'feather', name: 'x', color: '#757575' },
  check: { set: 'feather', name: 'check', color: '#66BB6A' },
  refresh: { set: 'feather', name: 'refresh-cw', color: '#5C6BC0' },
  logout: { set: 'feather', name: 'log-out', color: '#EF5350' },
  
  // Status indicators (Feather)
  success: { set: 'feather', name: 'check-circle', color: '#66BB6A' },
  error: { set: 'feather', name: 'alert-circle', color: '#EF5350' },
  warning: { set: 'feather', name: 'alert-triangle', color: '#FFA726' },
  info: { set: 'feather', name: 'info', color: '#42A5F5' },
  
  // Medical (Feather)
  vaccine: { set: 'feather', name: 'activity', color: '#EC407A' },
  calendar: { set: 'feather', name: 'calendar', color: '#5C6BC0' },
  clock: { set: 'feather', name: 'clock', color: '#757575' },
};

const AppIcon = ({ 
  name, 
  size = 24, 
  color, 
  set, 
  style,
  ...rest 
}) => {
  // If name matches a predefined icon, use that configuration
  const iconConfig = ICON_MAP[name];
  
  let IconComponent;
  let iconName;
  let iconColor;
  
  if (iconConfig) {
    // Use predefined configuration
    IconComponent = ICON_SETS[iconConfig.set];
    iconName = iconConfig.name;
    iconColor = color || iconConfig.color;
  } else {
    // Use explicit set and name
    IconComponent = ICON_SETS[set] || Feather;
    iconName = name;
    iconColor = color || '#000';
  }
  
  if (!IconComponent) {
    console.warn(`AppIcon: Invalid icon set "${set}"`);
    return null;
  }
  
  return (
    <IconComponent 
      name={iconName} 
      size={size} 
      color={iconColor} 
      style={style}
      {...rest}
    />
  );
};

export default AppIcon;
