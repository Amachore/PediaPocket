import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import RootNavigator from './src/navigation/RootNavigator';
import { ErrorBoundary, ToastProvider } from './src/components/common';
import { initializeErrorTracking } from './src/utils/errorLogger';

// Initialize error tracking on app start
initializeErrorTracking({
  appName: 'PediaPocket',
  version: '1.0.0',
});

export default function App() {
  return (
    <ErrorBoundary boundaryName="Root">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider position="bottom">
          <AuthProvider>
            <DataProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </DataProvider>
          </AuthProvider>
        </ToastProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
