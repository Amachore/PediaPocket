import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, Z_INDEX, ANIMATION } from '../../theme';
import AppIcon from './AppIcon';

/**
 * Toast Notification System
 * Auto-dismissing, non-blocking messages at the bottom of screen
 * 
 * Usage:
 *   const { showToast } = useToast();
 *   showToast('Success!', 'success');
 *   showToast('Error occurred', 'error', 5000);
 * 
 * Wrap app with ToastProvider:
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 */

const ToastContext = createContext();

// Toast type configurations
const TOAST_CONFIG = {
  success: {
    backgroundColor: COLORS.success,
    icon: 'success',
    iconColor: COLORS.background,
  },
  error: {
    backgroundColor: COLORS.error,
    icon: 'error',
    iconColor: COLORS.background,
  },
  warning: {
    backgroundColor: COLORS.warning,
    icon: 'warning',
    iconColor: COLORS.background,
  },
  info: {
    backgroundColor: COLORS.info,
    icon: 'info',
    iconColor: COLORS.background,
  },
};

const TOAST_DURATION = 3000; // 3 seconds default
const TOAST_POSITION = {
  top: 60,
  bottom: 80,
};

export const ToastProvider = ({ children, position = 'bottom' }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);

  const showToast = useCallback((message, type = 'info', duration = TOAST_DURATION, action) => {
    const id = toastIdCounter.current++;
    const newToast = {
      id,
      message,
      type,
      duration,
      action,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    showToast,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} position={position} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onHide, position }) => {
  if (toasts.length === 0) return null;

  return (
    <View 
      style={[
        styles.container, 
        position === 'top' ? styles.containerTop : styles.containerBottom
      ]}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onHide={() => onHide(toast.id)} 
        />
      ))}
    </View>
  );
};

const ToastItem = ({ toast, onHide }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: ANIMATION.normal,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: ANIMATION.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    // Slide out animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: ANIMATION.fast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.toastContent}>
        {/* Icon */}
        <AppIcon 
          name={config.icon} 
          size={24} 
          color={config.iconColor} 
        />

        {/* Message */}
        <Text style={styles.toastMessage} numberOfLines={3}>
          {toast.message}
        </Text>

        {/* Action Button (optional) */}
        {toast.action && (
          <TouchableOpacity
            onPress={() => {
              toast.action.onPress();
              handleDismiss();
            }}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>{toast.action.label}</Text>
          </TouchableOpacity>
        )}

        {/* Close Button */}
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <AppIcon name="close" size={20} color={config.iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    zIndex: Z_INDEX.toast,
    pointerEvents: 'box-none',
  },

  containerTop: {
    top: TOAST_POSITION.top,
  },

  containerBottom: {
    bottom: TOAST_POSITION.bottom,
  },

  toast: {
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.lg,
    // iOS specific shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },

  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    minHeight: 60,
  },

  toastMessage: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.background,
    marginLeft: SPACING.sm,
    marginRight: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  actionButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: SPACING.sm,
  },

  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  closeButton: {
    padding: SPACING.xs,
  },
});

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Convenience functions for common toast types
export const showSuccess = (message, duration) => {
  const { showToast } = useToast();
  return showToast(message, 'success', duration);
};

export const showError = (message, duration) => {
  const { showToast } = useToast();
  return showToast(message, 'error', duration);
};

export const showWarning = (message, duration) => {
  const { showToast } = useToast();
  return showToast(message, 'warning', duration);
};

export const showInfo = (message, duration) => {
  const { showToast } = useToast();
  return showToast(message, 'info', duration);
};

export default ToastProvider;
