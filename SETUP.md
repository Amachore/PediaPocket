# Quick Setup Guide

## First Time Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React Native & Expo
- React Navigation
- AsyncStorage
- Gesture Handler

### Step 2: Start the App
```bash
npm start
```

This will:
1. Start the Expo development server
2. Open Metro bundler in your terminal
3. Show a QR code

### Step 3: Run on Your Device

#### Option A: Physical Device (Recommended for testing)
1. Install **Expo Go** from App Store (iOS) or Google Play (Android)
2. Scan the QR code shown in terminal
3. App will load on your device

#### Option B: iOS Simulator (Mac only)
1. Press `i` in the terminal
2. Wait for simulator to launch

#### Option C: Android Emulator
1. Start Android emulator first
2. Press `a` in the terminal

#### Option D: Web Browser (Limited testing)
1. Press `w` in the terminal
2. Opens in your default browser (some features may not work)

## Testing the App

### Test Workflow 1: Caregiver Experience
1. On login screen, tap **"Caregiver - Maria Santos"**
2. You'll see 4 large colored buttons
3. Tap **"Feed"** button 3 times
4. Tap **"Wet Diaper"** 2 times
5. Notice the counter at top updates immediately
6. See green success message after each tap

### Test Workflow 2: Parent Dashboard
1. Tap the logout button
2. On login screen, tap **"Parent - Sarah Johnson"**
3. You'll land on the **Dashboard** tab
4. See the daily summary with counts (3 feeds, 2 wet diapers)
5. Scroll down to see the **Activity Timeline**
6. Each activity shows time, icon, and who logged it

### Test Workflow 3: Baby Book
1. While logged in as Parent
2. Tap the **"Baby Book"** tab at bottom
3. See baby profile (Emma Johnson)
4. See immunization records (Hepatitis B, BCG)

### Test Workflow 4: Data Persistence
1. Log some activities as caregiver
2. **Force close** the app completely
3. **Restart** the app
4. Login again
5. Verify all activities are still there ✓

## Troubleshooting

### "Module not found" errors
```bash
npm install
npx expo start --clear
```

### "Network response timed out"
- Check your firewall settings
- Try connecting device and computer to same WiFi
- Use tunnel mode: `npx expo start --tunnel`

### App won't start
1. Clear cache: `npx expo start --clear`
2. Delete node_modules: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version` (should be 14+)

### Can't scan QR code
- Make sure Expo Go is installed
- Try typing the URL manually from the terminal
- Use tunnel mode if on different networks

## Development Tips

### Hot Reload
- Changes to code automatically refresh the app
- Shake device or press Ctrl+M (Android) / Cmd+D (iOS) for dev menu
- Press `r` in terminal to reload manually

### Viewing Logs
- All console.log statements appear in the terminal
- Errors show in terminal and on device

### Debugging
- Press `j` in terminal to open Chrome DevTools
- Use React DevTools browser extension

## What's Next?

Once you've verified everything works:

1. **Customize the data**: Edit `src/services/mockData.js`
2. **Add more users**: Modify MOCK_USERS array
3. **Change baby name**: Update MOCK_BABY object
4. **Add features**: Build on the existing structure
5. **Deploy**: Use `expo build` when ready for production

## Project Structure at a Glance

```
src/
├── context/        # Global state (Auth & Data)
├── navigation/     # Screen routing
├── screens/        # All UI screens
└── services/       # Data layer & storage
```

## Need Help?

- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org/docs/getting-started
- **React Native**: https://reactnative.dev/docs/getting-started

---

Happy Hacking! 🚀
