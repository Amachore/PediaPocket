import React, { useState } from 'react';
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
import { LOG_TYPES, LOG_TYPE_ICONS } from '../services/mockData';

export default function CaregiverScreen() {
  const { currentUser, logout } = useAuth();
  const { baby, addLog, getDailyCount } = useData();
  const [lastLogType, setLastLogType] = useState(null);
  const dailyCount = getDailyCount();

  const handleLogActivity = async (type) => {
    if (!baby) {
      Alert.alert('Error', 'No baby profile found');
      return;
    }

    const result = await addLog(type, currentUser.name);
    
    if (result.success) {
      setLastLogType(type);
      // Clear the feedback after 2 seconds
      setTimeout(() => setLastLogType(null), 2000);
    } else {
      Alert.alert('Error', 'Failed to log activity');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getButtonColor = (type) => {
    const colors = {
      [LOG_TYPES.WET_DIAPER]: '#5AC8FA',
      [LOG_TYPES.DIRTY_DIAPER]: '#8E7C6A',
      [LOG_TYPES.FEED]: '#FF9500',
      [LOG_TYPES.SLEEP]: '#5856D6',
    };
    return colors[type] || '#007AFF';
  };

  const getButtonLabel = (type) => {
    const labels = {
      [LOG_TYPES.WET_DIAPER]: 'Wet Diaper',
      [LOG_TYPES.DIRTY_DIAPER]: 'Dirty Diaper',
      [LOG_TYPES.FEED]: 'Feed',
      [LOG_TYPES.SLEEP]: 'Sleep',
    };
    return labels[type] || type;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {currentUser.name}</Text>
          {baby && <Text style={styles.babyName}>Caring for {baby.name}</Text>}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Today's Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Activities</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💧</Text>
              <Text style={styles.summaryCount}>{dailyCount.wet_diaper}</Text>
              <Text style={styles.summaryLabel}>Wet</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💩</Text>
              <Text style={styles.summaryCount}>{dailyCount.dirty_diaper}</Text>
              <Text style={styles.summaryLabel}>Dirty</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>🍼</Text>
              <Text style={styles.summaryCount}>{dailyCount.feed}</Text>
              <Text style={styles.summaryLabel}>Feeds</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💤</Text>
              <Text style={styles.summaryCount}>{dailyCount.sleep}</Text>
              <Text style={styles.summaryLabel}>Sleeps</Text>
            </View>
          </View>
        </View>

        {/* Feedback Message */}
        {lastLogType && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              ✓ {getButtonLabel(lastLogType)} logged successfully!
            </Text>
          </View>
        )}

        {/* One-Tap Logging Buttons */}
        <View style={styles.buttonsGrid}>
          <TouchableOpacity
            style={[
              styles.logButton,
              { backgroundColor: getButtonColor(LOG_TYPES.WET_DIAPER) },
            ]}
            onPress={() => handleLogActivity(LOG_TYPES.WET_DIAPER)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>
              {LOG_TYPE_ICONS[LOG_TYPES.WET_DIAPER]}
            </Text>
            <Text style={styles.buttonLabel}>Wet Diaper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.logButton,
              { backgroundColor: getButtonColor(LOG_TYPES.DIRTY_DIAPER) },
            ]}
            onPress={() => handleLogActivity(LOG_TYPES.DIRTY_DIAPER)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>
              {LOG_TYPE_ICONS[LOG_TYPES.DIRTY_DIAPER]}
            </Text>
            <Text style={styles.buttonLabel}>Dirty Diaper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.logButton,
              { backgroundColor: getButtonColor(LOG_TYPES.FEED) },
            ]}
            onPress={() => handleLogActivity(LOG_TYPES.FEED)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>
              {LOG_TYPE_ICONS[LOG_TYPES.FEED]}
            </Text>
            <Text style={styles.buttonLabel}>Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.logButton,
              { backgroundColor: getButtonColor(LOG_TYPES.SLEEP) },
            ]}
            onPress={() => handleLogActivity(LOG_TYPES.SLEEP)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>
              {LOG_TYPE_ICONS[LOG_TYPES.SLEEP]}
            </Text>
            <Text style={styles.buttonLabel}>Sleep</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>
          Tap any button to log an activity instantly
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  babyName: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  feedbackContainer: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonsGrid: {
    gap: 16,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  buttonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  instruction: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 24,
  },
});
