# Core UI Components - Usage Guide

Complete guide for using PediaPocket's UI component system.

---

## 📦 Import Components

All components are exported from a single location:

```javascript
import {
  AppIcon,
  LoadingSpinner,
  SkeletonLoader,
  DashboardSkeleton,
  ErrorBoundary,
  useToast,
  BottomSheet,
  ConfirmBottomSheet,
  FullScreenModal,
  QRModal,
} from '../components/common';
```

---

## 🎨 Theme System

Import theme constants for consistent styling:

```javascript
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
```

### Quick Reference

```javascript
// Colors
COLORS.primary          // #E8F2FF (baby blue)
COLORS.success          // #66BB6A (green)
COLORS.error            // #EF5350 (red)
COLORS.wetDiaper        // #4FC3F7 (light blue)
COLORS.feed             // #FF7043 (coral)

// Spacing (8px grid)
SPACING.xs              // 4px
SPACING.sm              // 8px
SPACING.md              // 16px
SPACING.lg              // 24px

// Typography
TYPOGRAPHY.fontSize.base    // 16
TYPOGRAPHY.fontWeight.bold  // '700'
```

---

## 🔷 AppIcon Component

Unified icon system with predefined mappings.

### Basic Usage

```javascript
<AppIcon name="wet_diaper" size={48} />
<AppIcon name="dashboard" size={24} />
<AppIcon name="success" size={32} color={COLORS.success} />
```

### Custom Icons

```javascript
// Use specific icon sets
<AppIcon 
  set="ionicons" 
  name="heart" 
  size={24} 
  color={COLORS.error} 
/>

<AppIcon 
  set="feather" 
  name="settings" 
  size={20} 
  color={COLORS.textLight} 
/>
```

### Predefined Icons

All activity types, navigation, and status indicators are pre-configured:
- `wet_diaper`, `dirty_diaper`, `feed`, `sleep`
- `dashboard`, `babyBook`, `profile`
- `success`, `error`, `warning`, `info`
- `add`, `edit`, `delete`, `close`, `check`, `refresh`, `logout`

---

## ⏳ Loading States

### Inline Spinner (Quick Actions)

```javascript
import { LoadingSpinner } from '../components/common';

// Inside a button or small area
<LoadingSpinner size="small" color={COLORS.info} />

// With message
<LoadingSpinner 
  size="large" 
  message="Saving..." 
  color={COLORS.primary} 
/>

// Full screen
<LoadingSpinner fullScreen message="Loading data..." />
```

### Skeleton Screens (Data Loading)

```javascript
import { DashboardSkeleton, BabyProfileSkeleton } from '../components/common';

// Full dashboard skeleton
{isLoading ? <DashboardSkeleton /> : <YourDashboard />}

// Baby book skeleton
{isLoading ? <BabyBookSkeleton /> : <YourBabyBook />}

// Individual timeline card
import { TimelineCardSkeleton } from '../components/common';
<TimelineCardSkeleton />

// Multiple skeleton items
import { ActivityGridSkeleton } from '../components/common';
<ActivityGridSkeleton count={5} />
```

---

## 🚨 Error Boundary

Already integrated in `App.js`. Wrap specific sections if needed:

```javascript
import { ErrorBoundary } from '../components/common';

<ErrorBoundary 
  boundaryName="DashboardSection"
  onError={(error, errorInfo) => {
    // Optional: custom error handler
    console.log('Dashboard error:', error);
  }}
>
  <DashboardContent />
</ErrorBoundary>
```

**Features:**
- Development: Shows full stack traces
- Production: User-friendly reset screen
- Automatically logs errors

---

## 🎉 Toast Notifications

### Hook Usage

```javascript
import { useToast } from '../components/common';

const MyScreen = () => {
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showToast('Saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save', 'error');
    }
  };

  return <Button onPress={handleSave} title="Save" />;
};
```

### Toast Types

```javascript
const { showToast } = useToast();

// Success (green)
showToast('Log added!', 'success', 3000);

// Error (red)
showToast('Something went wrong', 'error', 5000);

// Warning (orange)
showToast('Please check your input', 'warning');

// Info (blue)
showToast('Data synced', 'info');
```

### Toast with Action Button

```javascript
showToast(
  'Log deleted', 
  'info', 
  5000,
  {
    label: 'UNDO',
    onPress: () => restoreLog(),
  }
);
```

### Manual Control

```javascript
const { hideToast, hideAllToasts } = useToast();

// Hide specific toast by ID
const toastId = showToast('Processing...', 'info', 0); // 0 = no auto-dismiss
// Later:
hideToast(toastId);

// Hide all toasts
hideAllToasts();
```

---

## 📱 Bottom Sheet Modals

### Basic Bottom Sheet

```javascript
import { BottomSheet } from '../components/common';

const [isVisible, setIsVisible] = useState(false);

<BottomSheet
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  title="Add Notes"
  height="half"
>
  <TextInput placeholder="Enter notes..." />
  <Button title="Save" onPress={handleSave} />
</BottomSheet>
```

### Height Options

```javascript
height="auto"           // Based on content
height="half"           // 50% of screen
height="full"           // 90% of screen
height={400}            // Specific pixel height
```

### Confirmation Dialog

```javascript
import { ConfirmBottomSheet } from '../components/common';

<ConfirmBottomSheet
  visible={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Log?"
  message="This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  confirmColor={COLORS.error}
  icon="delete"
/>
```

### Option List

```javascript
import { ListBottomSheet } from '../components/common';

const options = [
  { 
    id: '1', 
    label: 'Edit', 
    icon: 'edit', 
    color: COLORS.info 
  },
  { 
    id: '2', 
    label: 'Delete', 
    icon: 'delete', 
    color: COLORS.error 
  },
];

<ListBottomSheet
  visible={showOptions}
  onClose={() => setShowOptions(false)}
  title="Actions"
  options={options}
  onSelectOption={(option) => {
    if (option.id === '1') handleEdit();
    if (option.id === '2') handleDelete();
  }}
/>
```

---

## 📺 Full-Screen Modals

### Basic Full-Screen Modal

```javascript
import { FullScreenModal } from '../components/common';

<FullScreenModal
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  title="Baby Profile"
  backgroundColor={COLORS.primary}
>
  <View>
    <Text>Full screen content</Text>
  </View>
</FullScreenModal>
```

### QR Code Modal

```javascript
import { QRModal } from '../components/common';

<QRModal
  visible={showQR}
  onClose={() => setShowQR(false)}
  title="Medical QR Code"
  qrValue="BABY_12345"
  instructions="Show this QR code to the clinic receptionist"
  backgroundColor={COLORS.primary}
/>
```

### Form Modal (with Save Button)

```javascript
import { FormModal } from '../components/common';

const [isSaving, setIsSaving] = useState(false);

<FormModal
  visible={showEditForm}
  onClose={() => setShowEditForm(false)}
  title="Edit Baby Profile"
  onSave={async () => {
    setIsSaving(true);
    await saveBabyData();
    setIsSaving(false);
    setShowEditForm(false);
  }}
  isSaving={isSaving}
  saveButtonText="Save"
>
  <TextInput placeholder="Baby name" />
  <TextInput placeholder="Birth date" />
</FormModal>
```

### Gallery Modal (Image Viewer)

```javascript
import { GalleryModal } from '../components/common';

const [currentIndex, setCurrentIndex] = useState(0);
const images = [{ uri: 'image1.jpg' }, { uri: 'image2.jpg' }];

<GalleryModal
  visible={showGallery}
  onClose={() => setShowGallery(false)}
  items={images}
  currentIndex={currentIndex}
  onIndexChange={setCurrentIndex}
/>
```

---

## 🔧 Error Logging

### Basic Logging

```javascript
import { logError, logWarning, logInfo } from '../utils/errorLogger';

// Log errors
try {
  await riskyOperation();
} catch (error) {
  logError(error, { 
    screen: 'DashboardScreen', 
    action: 'refreshData' 
  });
}

// Log warnings
logWarning('Data might be outdated', { 
  lastSync: timestamp 
});

// Log info (dev only)
logInfo('User viewed dashboard', { 
  userId: user.uid 
});
```

### Specialized Loggers

```javascript
import { 
  logApiError, 
  logStorageError, 
  logNavigationError 
} from '../utils/errorLogger';

// API errors
logApiError(error, { 
  url: '/api/logs', 
  method: 'POST' 
});

// Storage errors
logStorageError(error, { 
  action: 'save', 
  key: 'LOGS' 
});

// Navigation errors
logNavigationError(error, { 
  screen: 'ProfileScreen' 
});
```

### Async Function Wrapper

```javascript
import { withErrorLogging } from '../utils/errorLogger';

const saveData = async (data) => {
  // Your save logic
};

// Wrap with automatic error logging
const saveDataWithLogging = withErrorLogging(saveData, { 
  context: 'DataService' 
});

// Errors are automatically logged
await saveDataWithLogging(myData);
```

---

## 🎯 Quick Examples

### Caregiver Button with Feedback

```javascript
import { AppIcon, useToast } from '../components/common';
import { COLORS, SPACING } from '../theme';

const handleLogFeed = async () => {
  const { showToast } = useToast();
  
  try {
    await addLog('feed', currentUser.name);
    showToast('Feed logged!', 'success');
  } catch (error) {
    showToast('Failed to log', 'error');
  }
};

<TouchableOpacity 
  onPress={handleLogFeed}
  style={{ 
    backgroundColor: COLORS.feed, 
    padding: SPACING.lg 
  }}
>
  <AppIcon name="feed" size={48} />
  <Text>Feed</Text>
</TouchableOpacity>
```

### Loading State Pattern

```javascript
import { LoadingSpinner, DashboardSkeleton } from '../components/common';

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  loadData().finally(() => setIsLoading(false));
}, []);

if (isLoading) {
  return <DashboardSkeleton />;
}

return <YourContent />;
```

### Delete with Confirmation

```javascript
import { ConfirmBottomSheet, useToast } from '../components/common';

const [showConfirm, setShowConfirm] = useState(false);
const { showToast } = useToast();

const handleDeleteConfirmed = async () => {
  try {
    await deleteLog(logId);
    showToast('Deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete', 'error');
  }
};

<ConfirmBottomSheet
  visible={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDeleteConfirmed}
  title="Delete this log?"
  message="This cannot be undone."
  icon="delete"
/>
```

---

## 🚀 Next Steps

1. **Generate Assets**: Open `assets/generate-placeholders.html` in browser and download icon/splash images
2. **Update Screens**: Replace hardcoded styles with theme constants
3. **Add Loading States**: Replace blank screens with skeletons
4. **Implement Toasts**: Add feedback for all user actions
5. **Error Handling**: Wrap async operations with try-catch and logging

---

**Pro Tips:**
- Use skeletons for initial data loads (makes app feel faster)
- Use spinners for user-triggered actions (buttons, saves)
- Always show toast feedback for user actions
- Log errors with context for easier debugging
- Test error boundary by throwing an error in dev mode

