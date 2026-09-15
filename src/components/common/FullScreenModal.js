import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, ANIMATION } from '../../theme';
import AppIcon from './AppIcon';

/**
 * FullScreenModal - Immersive full-screen experience for focused workflows
 * 
 * Use cases:
 *   - QR code display (clinic pass)
 *   - Baby profile form (add/edit)
 *   - Image galleries
 *   - Detailed views requiring full attention
 * 
 * Usage:
 *   <FullScreenModal
 *     visible={isVisible}
 *     onClose={() => setIsVisible(false)}
 *     title="QR Clinic Pass"
 *     backgroundColor={COLORS.primary}
 *   >
 *     <QRCodeComponent />
 *   </FullScreenModal>
 */

const FullScreenModal = ({
  visible,
  onClose,
  title,
  children,
  backgroundColor = COLORS.background,
  scrollable = true,
  showHeader = true,
  headerRight,
  animationType = 'slide', // 'slide', 'fade', 'none'
  statusBarStyle = 'dark-content',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && animationType === 'fade') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION.normal,
        useNativeDriver: true,
      }).start();
    } else if (!visible && animationType === 'fade') {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION.fast,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animationType]);

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <Modal
      visible={visible}
      animationType={animationType === 'fade' ? 'none' : animationType}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent
      />
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.content,
            animationType === 'fade' && { opacity: fadeAnim },
          ]}
        >
          {/* Header */}
          {showHeader && (
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <AppIcon name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
              
              {title && (
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
              )}
              
              {headerRight && (
                <View style={styles.headerRight}>{headerRight}</View>
              )}
              
              {!headerRight && <View style={styles.headerPlaceholder} />}
            </View>
          )}

          {/* Content */}
          <ContentWrapper
            style={styles.scrollContainer}
            contentContainerStyle={scrollable && styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            {children}
          </ContentWrapper>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

/**
 * QR Modal - Specialized full-screen modal for QR code display
 */
export const QRModal = ({
  visible,
  onClose,
  title = 'Medical QR Code',
  qrValue,
  instructions,
  backgroundColor = COLORS.background,
}) => {
  return (
    <FullScreenModal
      visible={visible}
      onClose={onClose}
      title={title}
      backgroundColor={backgroundColor}
      scrollable={false}
    >
      <View style={styles.qrContainer}>
        {/* QR Code Placeholder */}
        <View style={styles.qrCodeBox}>
          <Text style={styles.qrCodeText}>QR CODE</Text>
          <Text style={styles.qrValueText}>{qrValue}</Text>
        </View>

        {/* Instructions */}
        {instructions && (
          <View style={styles.instructionsContainer}>
            <AppIcon name="info" size={20} color={COLORS.info} />
            <Text style={styles.instructionsText}>{instructions}</Text>
          </View>
        )}
      </View>
    </FullScreenModal>
  );
};

/**
 * Form Modal - Full-screen modal optimized for forms
 */
export const FormModal = ({
  visible,
  onClose,
  title,
  children,
  onSave,
  saveButtonText = 'Save',
  isSaving = false,
  saveDisabled = false,
}) => {
  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
  };

  return (
    <FullScreenModal
      visible={visible}
      onClose={onClose}
      title={title}
      headerRight={
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving || saveDisabled}
          style={[
            styles.saveButton,
            (isSaving || saveDisabled) && styles.saveButtonDisabled,
          ]}
        >
          {isSaving ? (
            <AppIcon name="refresh" size={20} color={COLORS.background} />
          ) : (
            <Text style={styles.saveButtonText}>{saveButtonText}</Text>
          )}
        </TouchableOpacity>
      }
    >
      {children}
    </FullScreenModal>
  );
};

/**
 * Gallery Modal - Full-screen image/media viewer
 */
export const GalleryModal = ({
  visible,
  onClose,
  items = [],
  currentIndex = 0,
  onIndexChange,
}) => {
  return (
    <FullScreenModal
      visible={visible}
      onClose={onClose}
      backgroundColor={COLORS.text}
      scrollable={false}
      statusBarStyle="light-content"
      showHeader={false}
    >
      <View style={styles.galleryContainer}>
        {/* Close button (floating) */}
        <TouchableOpacity onPress={onClose} style={styles.galleryCloseButton}>
          <AppIcon name="close" size={32} color={COLORS.background} />
        </TouchableOpacity>

        {/* Gallery content */}
        <View style={styles.galleryContent}>
          <Text style={styles.galleryCounter}>
            {currentIndex + 1} / {items.length}
          </Text>
          {/* Image placeholder */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>
              Image {currentIndex + 1}
            </Text>
          </View>
        </View>

        {/* Navigation */}
        {items.length > 1 && (
          <View style={styles.galleryNav}>
            <TouchableOpacity
              onPress={() => onIndexChange?.(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              style={[
                styles.galleryNavButton,
                currentIndex === 0 && styles.galleryNavButtonDisabled,
              ]}
            >
              <AppIcon
                name="chevron-left"
                set="feather"
                size={32}
                color={currentIndex === 0 ? COLORS.textMuted : COLORS.background}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onIndexChange?.(Math.min(items.length - 1, currentIndex + 1))
              }
              disabled={currentIndex === items.length - 1}
              style={[
                styles.galleryNavButton,
                currentIndex === items.length - 1 && styles.galleryNavButtonDisabled,
              ]}
            >
              <AppIcon
                name="chevron-right"
                set="feather"
                size={32}
                color={
                  currentIndex === items.length - 1 ? COLORS.textMuted : COLORS.background
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </FullScreenModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.background,
    ...SHADOWS.sm,
  },

  closeButton: {
    padding: SPACING.xs,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },

  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },

  headerPlaceholder: {
    width: 44,
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    padding: SPACING.lg,
  },

  // Save button
  saveButton: {
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },

  saveButtonText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  // QR Modal Styles
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  qrCodeBox: {
    width: 280,
    height: 280,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
  },

  qrCodeText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },

  qrValueText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    fontFamily: 'Courier',
  },

  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xl,
    maxWidth: 320,
  },

  instructionsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.relaxed,
  },

  // Gallery Modal Styles
  galleryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: SPACING.lg,
    zIndex: 10,
    padding: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: RADIUS.full,
  },

  galleryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  galleryCounter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  imagePlaceholder: {
    width: '90%',
    aspectRatio: 1,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePlaceholderText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.textMuted,
  },

  galleryNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },

  galleryNavButton: {
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.full,
  },

  galleryNavButtonDisabled: {
    opacity: 0.3,
  },
});

export default FullScreenModal;
