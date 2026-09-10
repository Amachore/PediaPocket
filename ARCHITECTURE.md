# PediaPocket Architecture Documentation

## System Overview

PediaPocket is built as an offline-first React Native application using Expo. The architecture follows a clean separation of concerns with Context API for state management and AsyncStorage for persistence.

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│  (Screens: Login, Caregiver, Dashboard, etc.)       │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│              State Management Layer                  │
│      (Context: AuthContext, DataContext)             │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│               Business Logic Layer                   │
│  (Services: dataService, userService, logService)    │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│              Data Persistence Layer                  │
│           (AsyncStorage via storage.js)              │
└─────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.js (Root)
├── AuthProvider (Context)
│   └── DataProvider (Context)
│       └── NavigationContainer
│           └── RootNavigator
│               ├── LoginScreen (Unauthenticated)
│               │
│               ├── ParentNavigator (Parent Role)
│               │   ├── DashboardScreen (Tab 1)
│               │   ├── BabyBookScreen (Tab 2)
│               │   └── ProfileScreen (Tab 3)
│               │
│               └── CaregiverScreen (Caregiver Role)
```

## Data Flow Diagrams

### Authentication Flow
```
User taps role
    ↓
LoginScreen → useAuth().login(uid)
    ↓
AuthContext → userService.getById(uid)
    ↓
storage.load(USERS) → AsyncStorage
    ↓
Set currentUser state
    ↓
RootNavigator re-renders based on role
    ↓
Navigate to ParentNavigator or CaregiverScreen
```

### Activity Logging Flow
```
Caregiver taps button
    ↓
CaregiverScreen → useData().addLog(type, loggedBy)
    ↓
DataContext → logService.create({babyId, type, loggedBy})
    ↓
Generate unique ID + timestamp
    ↓
storage.save(LOGS, [...logs, newLog]) → AsyncStorage
    ↓
Update logs state
    ↓
UI re-renders with new count and feedback
```

### Dashboard Update Flow
```
Parent opens Dashboard
    ↓
DashboardScreen → useData().getTodayLogs()
    ↓
DataContext filters logs by today's date
    ↓
Returns sorted array
    ↓
Screen renders timeline + counter
    ↓
Pull-to-refresh → refreshLogs() → AsyncStorage
```

## State Management Strategy

### AuthContext Responsibilities
- User authentication state
- Login/logout operations
- Role detection (isParent, isCaregiver)
- User session persistence
- Initialize default data on first launch

### DataContext Responsibilities
- Baby profile data
- Activity logs array
- CRUD operations for logs
- Daily counter calculation
- Filtered views (getTodayLogs)
- Data refresh functionality

### Why Context API?
- Simple and lightweight for MVP scope
- No additional dependencies
- React-native friendly
- Easy to migrate to Redux/MobX later if needed

## Persistence Strategy

### Storage Keys
```javascript
@pediapocket_users      // Array of user objects
@pediapocket_babies     // Array of baby objects
@pediapocket_logs       // Array of log objects
@pediapocket_vaccines   // Array of vaccine objects
@pediapocket_current_user // Single user object (session)
```

### Data Initialization
On first app launch:
1. AuthContext checks for existing users
2. If none found, seeds mock data
3. Mock data includes 2 users, 1 baby, 2 vaccines
4. Logs start as empty array

### Offline-First Pattern
- All writes go to AsyncStorage immediately
- No network calls in Phase 1
- Reads are synchronous from local state
- State updates trigger React re-renders
- Data persists across app restarts

## Navigation Strategy

### Stack Navigator (Root)
- Controls authentication flow
- Shows LoginScreen when no user
- Routes to role-specific navigators when authenticated

### Tab Navigator (Parent Only)
- Bottom tabs for parent features
- Dashboard, Baby Book, Profile
- Each tab maintains its own state

### Single Screen (Caregiver)
- Simplified UI for quick access
- No complex navigation needed
- Focus on one-tap interactions

## Security Considerations (Phase 1)

### Current State (MVP)
- ⚠️ No real authentication (mock login)
- ⚠️ No data encryption
- ⚠️ All data stored in plain text
- ⚠️ No network security concerns (offline only)

### Production Requirements (Phase 2+)
- ✓ Firebase Authentication
- ✓ Firestore security rules
- ✓ Encrypted AsyncStorage for sensitive data
- ✓ HTTPS for all network calls
- ✓ JWT token management
- ✓ Role-based access control (RBAC)

## Performance Optimizations

### Current Optimizations
- Lazy initialization of default data
- Memoized daily count calculations
- Pull-to-refresh instead of auto-polling
- Efficient date filtering (client-side)

### Future Optimizations
- Pagination for large log lists
- Virtual scrolling for timeline
- Image caching for baby photos
- Background sync queue
- IndexedDB for web platform

## Testing Strategy

### Manual Testing (Phase 1)
- Role-based flows
- Data persistence verification
- UI responsiveness
- Offline functionality

### Automated Testing (Future)
- Unit tests for services
- Integration tests for contexts
- E2E tests with Detox
- Snapshot tests for UI components

## Migration Path to Production

### Phase 2: Firebase Integration
```
AsyncStorage → Cloud Firestore
Mock Auth → Firebase Auth
Local State → Real-time listeners
Manual refresh → Automatic sync
```

### Phase 3: Advanced Features
```
Single baby → Multi-baby support
Basic logs → Rich media (photos, videos)
Mock QR → Real QR code generation
Static data → Analytics integration
```

## File Organization Best Practices

### Folder Structure Logic
```
context/     # Global state (1-2 files per context)
navigation/  # Routing logic (1 file per navigator)
screens/     # UI components (1 file per screen)
services/    # Business logic (1 file per domain)
```

### Naming Conventions
- Screens: `[Feature]Screen.js` (e.g., DashboardScreen.js)
- Contexts: `[Domain]Context.js` (e.g., AuthContext.js)
- Services: `[domain]Service.js` (e.g., dataService.js)
- Navigators: `[Role]Navigator.js` (e.g., ParentNavigator.js)

## Scalability Considerations

### Current Limits
- Single baby per app instance
- No pagination on logs
- Client-side date filtering
- No image optimization

### Scaling Strategy
- Firebase handles multi-tenant data
- Firestore queries replace in-memory filtering
- Cloud Functions for complex operations
- CDN for media assets
- Push notifications via FCM

---

**Last Updated**: September 9, 2026  
**Architecture Version**: 1.0 (Phase 1 MVP)
