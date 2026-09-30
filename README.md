# PediaPocket MVP

An offline-first mobile application that acts as a shared digital baby book and daily activity tracker, bridging the information gap between working parents and at-home caregivers.

> **⚠️ AI Assistance Disclosure**: This project was developed with significant assistance from AI pair programming tools (Claude/Kiro AI IDE). AI was used for:
> - Component architecture and code generation
> - UI component library implementation
> - Documentation generation
> - Code structure and best practices guidance
> 
> The project concept, feature design, user flows, and technical decisions were human-driven.

## 🎯 Phase 1 MVP Features

### ✅ Implemented
- **Role-Based Authentication**: Mock login system for Parent and Caregiver roles
- **Caregiver Mode**: One-tap logging interface with 4 large buttons
  - 💧 Wet Diaper
  - 💩 Dirty Diaper
  - 🍼 Feed
  - 💤 Sleep
- **Parent Dashboard**: 
  - Daily activity counter (resets at midnight)
  - Chronological activity timeline
  - Real-time updates
- **Baby Book**: Baby profile and immunization records
- **Local Persistence**: AsyncStorage for offline-first functionality
- **Clean UI**: Production-ready React Native components

### 🚧 Future Features (Out of Scope for Hackathon)
- QR Code Medical Passport
- Firebase Cloud Sync
- Growth Charts
- Video Calls with Pediatricians
- AI Symptom Checker

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Context API
- **Local Storage**: AsyncStorage
- **Platform**: Cross-platform (iOS & Android)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, will be installed via npx)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   Or use Expo CLI directly:
   ```bash
   npx expo start
   ```

3. **Run on Device/Emulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal (for testing only)

## 📱 User Roles & Workflows

### Parent Role
1. Login as "Sarah Johnson" (Parent)
2. Access 3 tabs:
   - **Dashboard**: View daily activity summary and timeline
   - **Baby Book**: View baby profile and immunization records
   - **Profile**: Manage settings and logout

### Caregiver Role
1. Login as "Maria Santos" (Caregiver)
2. Access simplified one-tap logging interface
3. Tap large buttons to log activities instantly
4. View today's activity summary at the top

## 🗂 Project Structure

```
PediaPocket/
├── App.js                          # Root component with providers
├── src/
│   ├── context/
│   │   ├── AuthContext.js          # User authentication & session
│   │   └── DataContext.js          # Baby data & activity logs
│   ├── navigation/
│   │   ├── RootNavigator.js        # Role-based routing
│   │   └── ParentNavigator.js      # Parent tab navigation
│   ├── screens/
│   │   ├── LoginScreen.js          # Mock role selector
│   │   ├── CaregiverScreen.js      # One-tap logging UI
│   │   ├── DashboardScreen.js      # Parent dashboard
│   │   ├── BabyBookScreen.js       # Baby profile & vaccines
│   │   └── ProfileScreen.js        # User profile & settings
│   └── services/
│       ├── storage.js              # AsyncStorage wrapper
│       ├── mockData.js             # Seed data
│       └── dataService.js          # CRUD operations
├── package.json
├── app.json
└── README.md
```

## 💾 Data Architecture

### Mock Collections (Simulating Firestore)

#### Users
```javascript
{
  uid: "user_parent_1",
  role: "parent" | "caregiver",
  name: "Sarah Johnson",
  email: "sarah@example.com"
}
```

#### Babies
```javascript
{
  babyId: "baby_1",
  parentId: "user_parent_1",
  name: "Emma Johnson",
  birthdate: "2026-01-15T00:00:00.000Z"
}
```

#### Logs (Activity Tracking)
```javascript
{
  logId: "1234567890_abc123",
  babyId: "baby_1",
  type: "wet_diaper" | "dirty_diaper" | "feed" | "sleep",
  timestamp: "2026-09-09T10:30:00.000Z",
  loggedBy: "Maria Santos"
}
```

#### Vaccines
```javascript
{
  vaccineId: "vaccine_1",
  babyId: "baby_1",
  vaccineName: "Hepatitis B",
  dateAdministered: "2026-01-16T00:00:00.000Z",
  notes: "Birth dose"
}
```

## 🔄 Data Flow

1. **App Initialization**
   - AuthContext loads default data and checks for saved user session
   - DataContext loads baby data and activity logs from AsyncStorage

2. **Caregiver Logs Activity**
   - Tap button → DataContext.addLog()
   - New log saved to AsyncStorage
   - State updates trigger UI refresh
   - Daily counter increments automatically

3. **Parent Views Dashboard**
   - DataContext provides getTodayLogs() and getDailyCount()
   - Timeline shows chronological activities
   - Counter resets at midnight (client-side logic)

## 🧪 Testing the App

### Test Scenario 1: Caregiver Logging
1. Login as "Maria Santos" (Caregiver)
2. Tap "Feed" button 3 times
3. Tap "Wet Diaper" button 2 times
4. Observe immediate feedback and counter updates

### Test Scenario 2: Parent Dashboard
1. Logout from caregiver
2. Login as "Sarah Johnson" (Parent)
3. Navigate to Dashboard tab
4. Verify timeline shows all logged activities
5. Verify daily counter matches logged activities

### Test Scenario 3: Data Persistence
1. Log several activities
2. Force close the app
3. Restart the app
4. Verify all logs persist across app restarts

## 🚀 Next Steps for Production

### ⚠️ Current Status (Phase 1 MVP)
**Completion: 95%** - Fully functional, minor assets needed

**Remaining Tasks:**
- [ ] Generate app icon and splash screen (5 minutes)
  - Open `assets/generate-placeholders.html` in browser
  - Download icon.png, adaptive-icon.png, splash.png, favicon.png
  - Place files in `assets/` folder
- [ ] Run `npx expo start --clear` to test with new assets

**Known Limitations:**
- Mock authentication (no real login system)
- Single baby per app instance
- No image uploads
- No push notifications
- Client-side date filtering (no pagination)

### Phase 2: Cloud Integration
- [ ] Setup Firebase project
- [ ] Implement Firebase Authentication
- [ ] Replace AsyncStorage with Firestore
- [ ] Add real-time sync capabilities
- [ ] Implement offline queue for failed syncs

### Phase 3: Advanced Features
- [ ] QR Code generation for medical visits
- [ ] Push notifications for caregivers
- [ ] Photo uploads for baby book
- [ ] Multi-baby support
- [ ] Caregiver invitation system

### Phase 4: Polish
- [ ] Onboarding flow
- [ ] Dark mode support
- [ ] Localization (i18n)
- [ ] Analytics integration
- [ ] App store submission

## 📝 Development Notes

### Budget Constraints
This MVP was built with a strict 50-credit budget, prioritizing:
- Clean, production-ready component structure
- Core functionality over extensive testing
- Mock state over live backend setup
- Efficient code generation to minimize iterations

### Design Decisions
- **Expo over bare React Native**: Faster setup, no native build needed for prototype
- **Context API over Redux**: Simpler state management for MVP scope
- **AsyncStorage over Firebase**: Demonstrates offline-first without cloud credentials
- **Mock login over real auth**: Focus on UI/UX flow rather than security for prototype

## 🤝 Contributing

This is a hackathon MVP prototype. For production deployment:
1. Replace mock authentication with Firebase Auth
2. Migrate AsyncStorage to Cloud Firestore
3. Add proper error handling and validation
4. Implement comprehensive testing
5. Add security rules and data encryption

## 📄 License

This is a prototype project for demonstration purposes.

---

## 🤖 AI Assistance & Attribution

### Development Approach
This project was developed with **significant AI pair programming assistance** using Claude (Anthropic) via the Kiro AI IDE. The collaboration model was:

**Human Contributions:**
- Product vision and feature requirements
- User experience design decisions
- Architecture and technical strategy
- Code review and acceptance
- Testing and validation
- Problem definition and context

**AI Contributions:**
- Code generation and implementation
- Component library architecture
- Documentation generation
- Best practices guidance
- Bug identification and fixes
- Boilerplate and repetitive code

### Transparency Statement
This disclosure is made in the spirit of transparency for hackathon evaluation. The use of AI tools represents a modern development workflow where:
- The human remains the architect and decision-maker
- AI serves as an intelligent code assistant
- All code is reviewed, understood, and owned by the developer
- The combination enables rapid prototyping while maintaining quality

### Technology Stack
- **Framework**: React Native with Expo 57
- **AI Tools**: Claude (Anthropic), Kiro AI IDE
- **Development**: Human-guided, AI-assisted pair programming

---

**Built for FirstCommit Hackathon** 🏆
