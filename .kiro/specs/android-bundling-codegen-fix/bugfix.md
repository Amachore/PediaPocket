# Bugfix Requirements Document

## Introduction

The React Native application fails to bundle for Android due to a codegen error when processing deprecated Flow type definitions in React Native's internal component specifications. This prevents the app from starting on Android devices via Expo, blocking the entire Android development and testing workflow.

The error occurs during the Babel transformation phase when @react-native/babel-plugin-codegen attempts to parse Flow type definitions in `RCTModalHostViewNativeComponent.js`, specifically failing to recognize the `ReadonlyArray` type in component State definitions.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the app is bundled for Android via Expo THEN the bundling process crashes with error "Unknown property type for 'supportedOrientations': 'ReadonlyArray' in the State"

1.2 WHEN the bundling process reaches node_modules\expo\AppEntry.js during Metro bundling THEN the @react-native/babel-plugin-codegen fails to parse deprecated React Native component specs

1.3 WHEN a user scans the QR code to run the app on an Android device THEN the app cannot start because the bundle compilation fails

### Expected Behavior (Correct)

2.1 WHEN the app is bundled for Android via Expo THEN the bundling process SHALL complete successfully without codegen type parsing errors

2.2 WHEN the bundling process reaches node_modules\expo\AppEntry.js during Metro bundling THEN the Babel transformation SHALL handle Flow type definitions correctly or bypass deprecated component specs

2.3 WHEN a user scans the QR code to run the app on an Android device THEN the app SHALL bundle successfully and launch on the device

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the app is bundled for iOS or web platforms THEN the bundling process SHALL CONTINUE TO complete successfully as before

3.2 WHEN the app runs in development mode using Expo Go THEN all existing React Native components SHALL CONTINUE TO function correctly

3.3 WHEN the app uses React Native core components (Modal, View, Text, etc.) THEN these components SHALL CONTINUE TO render and behave as expected

3.4 WHEN the app uses navigation, async storage, and other installed dependencies THEN these libraries SHALL CONTINUE TO work without breaking changes
