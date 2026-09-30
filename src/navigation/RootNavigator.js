import React from 'react';
import { ActivityIndicator, Image, View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import ParentNavigator from './ParentNavigator';
import CaregiverScreen from '../screens/CaregiverScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('../../assets/PediaPocketLogo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="PediaPocket"
        />
        <ActivityIndicator size="small" color="#55C9A7" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : currentUser.role === 'parent' ? (
        <Stack.Screen name="ParentApp" component={ParentNavigator} />
      ) : (
        <Stack.Screen name="CaregiverApp" component={CaregiverScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F2FF',
  },
  logo: {
    width: 176,
    height: 176,
    marginBottom: 20,
  },
});
