# PediaPocket Components

Production-ready UI component library built for the PediaPocket MVP.

## 📂 Structure

```
components/
└── common/              # Shared, reusable components
    ├── AppIcon.js       # Unified icon system
    ├── LoadingSpinner.js
    ├── SkeletonLoader.js
    ├── ErrorBoundary.js
    ├── Toast.js
    ├── BottomSheet.js
    ├── FullScreenModal.js
    ├── index.js         # Barrel exports
    └── USAGE_GUIDE.md   # Comprehensive usage docs
```

## 🚀 Quick Start

```javascript
// Import components
import { 
  AppIcon, 
  LoadingSpinner, 
  useToast 
} from './components/common';

// Use in your screen
const MyScreen = () => {
  const { showToast } = useToast();
  
  return (
    <View>
      <AppIcon name="dashboard" size={24} />
      <Button 
        onPress={() => showToast('Success!', 'success')}
        title="Show Toast"
      />
    </View>
  );
};
```

## 📚 Documentation

See [USAGE_GUIDE.md](./common/USAGE_GUIDE.md) for complete documentation with examples.

## ✅ Available Components

- **AppIcon** - Ionicons (caregiver) + Feather (parent) icons
- **LoadingSpinner** - Inline and full-screen loading indicators
- **SkeletonLoader** - Pulsing placeholder screens
- **ErrorBoundary** - Dev/prod error handling
- **Toast** - Auto-dismiss notifications with animations
- **BottomSheet** - Mobile-friendly slide-up modals
- **FullScreenModal** - Immersive full-screen experiences

## 🎨 Theme Integration

All components use centralized theme from `src/theme/index.js`:

```javascript
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
```

## 🔗 Already Integrated

- ✅ ErrorBoundary wraps entire app in `App.js`
- ✅ ToastProvider available throughout app
- ✅ Error logging initialized on app start

## 📝 Next Steps

1. Open `assets/generate-placeholders.html` to create app icons
2. Update existing screens to use new components
3. Replace hardcoded colors with theme constants
4. Add loading states to async operations
5. Implement toast feedback for user actions
