/**
 * Common Components Barrel Export
 * Import all shared UI components from a single location
 * 
 * Usage:
 *   import { AppIcon, LoadingSpinner, useToast } from '../components/common';
 */

// Icons
export { default as AppIcon } from './AppIcon';
export { ICON_MAP } from './AppIcon';

// Loading States
export { default as LoadingSpinner } from './LoadingSpinner';
export {
  default as SkeletonLoader,
  TimelineCardSkeleton,
  DailyCounterSkeleton,
  ActivityGridSkeleton,
  BabyProfileSkeleton,
  VaccineListSkeleton,
  DashboardSkeleton,
  BabyBookSkeleton,
} from './SkeletonLoader';

// Error Handling
export { default as ErrorBoundary } from './ErrorBoundary';

// Toast Notifications
export {
  default as ToastProvider,
  useToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from './Toast';

// Modals
export {
  default as BottomSheet,
  ConfirmBottomSheet,
  ListBottomSheet,
} from './BottomSheet';

export {
  default as FullScreenModal,
  QRModal,
  FormModal,
  GalleryModal,
} from './FullScreenModal';
