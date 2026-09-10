import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/dataService';

export default function LoginScreen() {
  const { login } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getAll();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (uid) => {
    const result = await login(uid);
    if (!result.success) {
      console.error('Login failed:', result.error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>👶</Text>
        <Text style={styles.title}>PediaPocket</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>

        <View style={styles.buttonContainer}>
          {users.map((user) => (
            <TouchableOpacity
              key={user.uid}
              style={[
                styles.roleButton,
                user.role === 'parent' ? styles.parentButton : styles.caregiverButton,
              ]}
              onPress={() => handleLogin(user.uid)}
            >
              <Text style={styles.roleIcon}>
                {user.role === 'parent' ? '👨‍👩‍👧' : '👵'}
              </Text>
              <Text style={styles.roleTitle}>
                {user.role === 'parent' ? 'Parent' : 'Caregiver'}
              </Text>
              <Text style={styles.roleName}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>Mock Login • Development Only</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  roleButton: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  parentButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  caregiverButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  roleName: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    color: '#8E8E93',
  },
});
