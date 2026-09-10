import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useData } from '../context/DataContext';
import { LOG_TYPE_ICONS } from '../services/mockData';

export default function DashboardScreen() {
  const { baby, getTodayLogs, getDailyCount, refreshLogs, isLoading } = useData();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const todayLogs = getTodayLogs();
  const dailyCount = getDailyCount();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshLogs();
    setRefreshing(false);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatLogType = (type) => {
    const labels = {
      wet_diaper: 'Wet Diaper',
      dirty_diaper: 'Dirty Diaper',
      feed: 'Feed',
      sleep: 'Sleep',
    };
    return labels[type] || type;
  };

  const getLogColor = (type) => {
    const colors = {
      wet_diaper: '#5AC8FA',
      dirty_diaper: '#8E7C6A',
      feed: '#FF9500',
      sleep: '#5856D6',
    };
    return colors[type] || '#007AFF';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Baby Info Card */}
        {baby && (
          <View style={styles.babyCard}>
            <Text style={styles.babyEmoji}>👶</Text>
            <Text style={styles.babyName}>{baby.name}</Text>
            <Text style={styles.babyAge}>
              Born {new Date(baby.birthdate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Daily Tally Card */}
        <View style={styles.tallyCard}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.tallyGrid}>
            <View style={styles.tallyItem}>
              <View style={[styles.tallyIconContainer, { backgroundColor: '#5AC8FA20' }]}>
                <Text style={styles.tallyIcon}>💧</Text>
              </View>
              <Text style={styles.tallyCount}>{dailyCount.wet_diaper}</Text>
              <Text style={styles.tallyLabel}>Wet Diapers</Text>
            </View>
            <View style={styles.tallyItem}>
              <View style={[styles.tallyIconContainer, { backgroundColor: '#8E7C6A20' }]}>
                <Text style={styles.tallyIcon}>💩</Text>
              </View>
              <Text style={styles.tallyCount}>{dailyCount.dirty_diaper}</Text>
              <Text style={styles.tallyLabel}>Dirty Diapers</Text>
            </View>
            <View style={styles.tallyItem}>
              <View style={[styles.tallyIconContainer, { backgroundColor: '#FF950020' }]}>
                <Text style={styles.tallyIcon}>🍼</Text>
              </View>
              <Text style={styles.tallyCount}>{dailyCount.feed}</Text>
              <Text style={styles.tallyLabel}>Feedings</Text>
            </View>
            <View style={styles.tallyItem}>
              <View style={[styles.tallyIconContainer, { backgroundColor: '#5856D620' }]}>
                <Text style={styles.tallyIcon}>💤</Text>
              </View>
              <Text style={styles.tallyCount}>{dailyCount.sleep}</Text>
              <Text style={styles.tallyLabel}>Sleep Times</Text>
            </View>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Activities: {dailyCount.total}</Text>
          </View>
        </View>

        {/* Activity Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Activity Timeline</Text>
          {todayLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No activities logged yet today</Text>
              <Text style={styles.emptySubtext}>
                Activities will appear here as they're logged
              </Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {todayLogs.map((log, index) => (
                <View key={log.logId} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View 
                      style={[
                        styles.timelineDot, 
                        { backgroundColor: getLogColor(log.type) }
                      ]} 
                    />
                    {index < todayLogs.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineIcon}>
                        {LOG_TYPE_ICONS[log.type]}
                      </Text>
                      <View style={styles.timelineInfo}>
                        <Text style={styles.timelineTitle}>
                          {formatLogType(log.type)}
                        </Text>
                        <Text style={styles.timelineTime}>
                          {formatTime(log.timestamp)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.timelineLogger}>
                      Logged by {log.loggedBy}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  babyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  babyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  babyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  babyAge: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tallyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  tallyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tallyItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  tallyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tallyIcon: {
    fontSize: 32,
  },
  tallyCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  tallyLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  totalContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E5EA',
    marginTop: 4,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  timelineLogger: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
