import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, Z_INDEX, ANIMATION } from '../../theme';
import AppIcon from './AppIcon';

/**
 * BottomSheet - Mobile-friendly modal that slides up from bottom
 * 
 * Use cases:
 *   - Add notes/quantities to logs
 *   - View log details
 *   - Quick action menus
 *   - Form inputs that don't need full screen
 * 
 * Usage:
 *   <BottomSheet
 *     visible={isVisible}
 *     onClose={() => setIsVisible(false)}
 *     title="Add Notes"
 *   >
 *     <Text>Content goes here</Text>
 *   </BottomSheet>
 */

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheet = ({
  visible,
  onClose,
  title,
  children,
  height = 'auto', // 'auto', 'half', 'full', or number
  showHandle = true,
  closeOnBackdropPress = true,
  scrollable = true,
  footer,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: ANIMATION.normal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  // Calculate sheet height
  let sheetHeight;
  if (typeof height === 'number') {
    sheetHeight = height;
  } else if (height === 'half') {
    sheetHeight = SCREEN_HEIGHT * 0.5;
  } else if (height === 'full') {
    sheetHeight = SCREEN_HEIGHT * 0.9;
  } else {
    sheetHeight = 'auto'; // Will expand based on content
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            sheetHeight !== 'auto' && { height: sheetHeight },
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Handle (drag indicator) */}
          {showHandle && (
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          )}

          {/* Header */}
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <AppIcon name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <ContentWrapper
            style={styles.content}
            contentContainerStyle={scrollable && styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            {children}
          </ContentWrapper>

          {/* Footer (optional) */}
          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
};

/**
 * Confirmation Bottom Sheet - Quick yes/no dialogs
 */
export const ConfirmBottomSheet = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = COLORS.error,
  icon,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      scrollable={false}
      footer={
        <View style={styles.confirmFooter}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.button, styles.confirmButton, { backgroundColor: confirmColor }]}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.confirmContent}>
        {icon && (
          <View style={styles.iconContainer}>
            <AppIcon name={icon} size={48} color={confirmColor} />
          </View>
        )}
        <Text style={styles.confirmMessage}>{message}</Text>
      </View>
    </BottomSheet>
  );
};

/**
 * List Bottom Sheet - Show a list of options
 */
export const ListBottomSheet = ({
  visible,
  onClose,
  title,
  options = [],
  onSelectOption,
}) => {
  const handleSelect = (option) => {
    onSelectOption(option);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.listContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.id || index}
            onPress={() => handleSelect(option)}
            style={[
              styles.listItem,
              index === options.length - 1 && styles.listItemLast,
            ]}
          >
            {option.icon && (
              <AppIcon
                name={option.icon}
                size={24}
                color={option.color || COLORS.text}
                style={styles.listItemIcon}
              />
            )}
            <View style={styles.listItemContent}>
              <Text style={styles.listItemText}>{option.label}</Text>
              {option.description && (
                <Text style={styles.listItemDescription}>{option.description}</Text>
              )}
            </View>
            {option.showChevron !== false && (
              <AppIcon name="chevron-right" set="feather" size={20} color={COLORS.textMuted} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    zIndex: Z_INDEX.overlay,
  },

  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: SCREEN_HEIGHT * 0.9,
    ...SHADOWS.xl,
    // iOS specific shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
    }),
  },

  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    flex: 1,
  },

  closeButton: {
    padding: SPACING.xs,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    padding: SPACING.lg,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    padding: SPACING.lg,
  },

  // Confirm Bottom Sheet Styles
  confirmContent: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  confirmMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    paddingHorizontal: SPACING.lg,
  },

  confirmFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
  },

  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: COLORS.backgroundLight,
  },

  confirmButton: {
    backgroundColor: COLORS.error,
  },

  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },

  confirmButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.background,
  },

  // List Bottom Sheet Styles
  listContainer: {
    paddingVertical: SPACING.sm,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  listItemLast: {
    borderBottomWidth: 0,
  },

  listItemIcon: {
    marginRight: SPACING.md,
  },

  listItemContent: {
    flex: 1,
  },

  listItemText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  listItemDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

export default BottomSheet;
