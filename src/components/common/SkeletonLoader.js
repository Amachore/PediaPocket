import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../theme';

/**
 * SkeletonLoader - Placeholder UI while content loads
 * Use for: dashboard, timeline, baby book initial load
 */

// Single skeleton item with pulsing animation
const SkeletonItem = ({ width = '100%', height = 20, style, borderRadius = RADIUS.sm }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonItem,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Timeline Card Skeleton (for Parent Dashboard)
export const TimelineCardSkeleton = () => (
  <View style={styles.timelineCard}>
    <View style={styles.timelineHeader}>
      <SkeletonItem width={60} height={60} borderRadius={RADIUS.md} />
      <View style={styles.timelineContent}>
        <SkeletonItem width="70%" height={18} style={styles.skeletonMargin} />
        <SkeletonItem width="50%" height={14} />
      </View>
    </View>
  </View>
);

// Daily Counter Skeleton (for Caregiver Dashboard)
export const DailyCounterSkeleton = () => (
  <View style={styles.counterContainer}>
    <SkeletonItem width="100%" height={80} borderRadius={RADIUS.md} />
  </View>
);

// Activity Grid Skeleton (for multiple timeline items)
export const ActivityGridSkeleton = ({ count = 5 }) => (
  <View style={styles.gridContainer}>
    {Array.from({ length: count }).map((_, index) => (
      <TimelineCardSkeleton key={index} />
    ))}
  </View>
);

// Baby Profile Card Skeleton (for Baby Book)
export const BabyProfileSkeleton = () => (
  <View style={styles.profileCard}>
    <View style={styles.profileHeader}>
      <SkeletonItem width={100} height={100} borderRadius={RADIUS.full} />
      <View style={styles.profileInfo}>
        <SkeletonItem width="80%" height={24} style={styles.skeletonMargin} />
        <SkeletonItem width="60%" height={16} />
      </View>
    </View>
    <View style={styles.profileDetails}>
      <SkeletonItem width="100%" height={16} style={styles.skeletonMargin} />
      <SkeletonItem width="90%" height={16} style={styles.skeletonMargin} />
      <SkeletonItem width="70%" height={16} />
    </View>
  </View>
);

// Vaccine List Skeleton (for Baby Book)
export const VaccineListSkeleton = ({ count = 3 }) => (
  <View style={styles.vaccineList}>
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} style={styles.vaccineCard}>
        <SkeletonItem width={40} height={40} borderRadius={RADIUS.sm} />
        <View style={styles.vaccineInfo}>
          <SkeletonItem width="70%" height={16} style={styles.skeletonMargin} />
          <SkeletonItem width="50%" height={14} />
        </View>
      </View>
    ))}
  </View>
);

// Full Dashboard Skeleton (combined)
export const DashboardSkeleton = () => (
  <View style={styles.dashboardContainer}>
    <DailyCounterSkeleton />
    <View style={styles.sectionHeader}>
      <SkeletonItem width={150} height={20} />
    </View>
    <ActivityGridSkeleton count={4} />
  </View>
);

// Full Baby Book Skeleton (combined)
export const BabyBookSkeleton = () => (
  <View style={styles.babyBookContainer}>
    <BabyProfileSkeleton />
    <View style={styles.sectionHeader}>
      <SkeletonItem width={180} height={20} />
    </View>
    <VaccineListSkeleton count={3} />
  </View>
);

const styles = StyleSheet.create({
  skeletonItem: {
    backgroundColor: COLORS.backgroundDark,
  },
  
  skeletonMargin: {
    marginBottom: SPACING.xs,
  },
  
  // Timeline Card Styles
  timelineCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  timelineContent: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  
  // Counter Styles
  counterContainer: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  
  // Grid Styles
  gridContainer: {
    padding: SPACING.md,
  },
  
  // Profile Styles
  profileCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  profileInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  
  profileDetails: {
    marginTop: SPACING.md,
  },
  
  // Vaccine Styles
  vaccineList: {
    padding: SPACING.md,
  },
  
  vaccineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  
  vaccineInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  
  // Section Header
  sectionHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  
  // Full Page Containers
  dashboardContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  babyBookContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
});

// Main export
const SkeletonLoader = SkeletonItem;

export default SkeletonLoader;
