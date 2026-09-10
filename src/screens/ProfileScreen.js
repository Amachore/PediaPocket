import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const { baby } = useData();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await logout();
          }, 
          style: 'destructive' 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>
            {currentUser?.role === 'parent' ? '👨‍👩‍👧' : '👵'}
          </Text>
          <Text style={styles.profileName}>{currentUser?.name}</Text>
          <Text style={styles.profileRole}>
            {currentUser?.role === 'parent' ? 'Parent' : 'Caregiver'}
          </Text>
          {currentUser?.email && (
            <Text style={styles.profileEmail}>{currentUser.email}</Text>
          )}
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0 (MVP)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Baby Tracked</Text>
              <Text style={styles.infoValue}>{baby?.name || 'None'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Storage</Text>
              <Text style={styles.infoValue}>Local (AsyncStorage)</Text>
            </View>
          </View>
        </View>

        {/* Features Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureCard}>
            <FeatureRow icon="✓" label="Activity Logging" status="Active" color="#34C759" />
            <FeatureRow icon="✓" label="Daily Dashboard" status="Active" color="#34C759" />
            <FeatureRow icon="✓" label="Baby Book" status="Active" color="#34C759" />
            <FeatureRow icon="○" label="QR Medical Passport" status="Coming Soon" color="#8E8E93" />
            <FeatureRow icon="○" label="Cloud Sync" status="Coming Soon" color="#8E8E93" />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              PediaPocket is an offline-first baby tracking app that helps parents 
              and caregivers stay connected through shared activity logs.
            </Text>
            <Text style={styles.aboutSubtext}>
              This is a Phase 1 MVP prototype with local data storage.
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const FeatureRow = ({ icon, label, status, color }) => (
  <View style={styles.featureRow}>
    <View style={styles.featureLeft}>
      <Text style={[styles.featureIcon, { color }]}>{icon}</Text>
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
    <Text style={[styles.featureStatus, { color }]}>{status}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#000',
  },
  infoValue: {
    fontSize: 15,
    color: '#8E8E93',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  featureLabel: {
    fontSize: 15,
    color: '#000',
  },
  featureStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aboutText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginBottom: 12,
  },
  aboutSubtext: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
