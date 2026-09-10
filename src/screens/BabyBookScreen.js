import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useData } from '../context/DataContext';
import { vaccineService } from '../services/dataService';

export default function BabyBookScreen() {
  const { baby } = useData();
  const [vaccines, setVaccines] = React.useState([]);

  React.useEffect(() => {
    loadVaccines();
  }, [baby]);

  const loadVaccines = async () => {
    if (baby) {
      const babyVaccines = await vaccineService.getByBabyId(baby.babyId);
      setVaccines(babyVaccines);
    }
  };

  const calculateAge = (birthdate) => {
    const birth = new Date(birthdate);
    const today = new Date();
    const ageInMonths = Math.floor(
      (today - birth) / (1000 * 60 * 60 * 24 * 30.44)
    );
    
    if (ageInMonths < 1) {
      const ageInDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      return `${ageInDays} days old`;
    } else if (ageInMonths < 12) {
      return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'} old`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return `${years} ${years === 1 ? 'year' : 'years'}${
        months > 0 ? ` and ${months} ${months === 1 ? 'month' : 'months'}` : ''
      } old`;
    }
  };

  if (!baby) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👶</Text>
          <Text style={styles.emptyText}>No baby profile found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Baby Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileEmoji}>👶</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{baby.name}</Text>
              <Text style={styles.profileAge}>
                {calculateAge(baby.birthdate)}
              </Text>
            </View>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Birthday</Text>
              <Text style={styles.detailValue}>
                {new Date(baby.birthdate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Immunization Records */}
        <View style={styles.vaccineCard}>
          <Text style={styles.sectionTitle}>Immunization Records</Text>
          {vaccines.length === 0 ? (
            <View style={styles.emptyVaccines}>
              <Text style={styles.emptyVaccinesIcon}>💉</Text>
              <Text style={styles.emptyVaccinesText}>
                No immunization records yet
              </Text>
            </View>
          ) : (
            <View style={styles.vaccineList}>
              {vaccines.map((vaccine) => (
                <View key={vaccine.vaccineId} style={styles.vaccineItem}>
                  <View style={styles.vaccineIcon}>
                    <Text style={styles.vaccineIconText}>✓</Text>
                  </View>
                  <View style={styles.vaccineInfo}>
                    <Text style={styles.vaccineName}>{vaccine.vaccineName}</Text>
                    <Text style={styles.vaccineDate}>
                      {new Date(vaccine.dateAdministered).toLocaleDateString()}
                    </Text>
                    {vaccine.notes && (
                      <Text style={styles.vaccineNotes}>{vaccine.notes}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Growth Milestones (Placeholder) */}
        <View style={styles.milestonesCard}>
          <Text style={styles.sectionTitle}>Growth & Milestones</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📊</Text>
            <Text style={styles.placeholderText}>
              Growth charts and milestones coming soon
            </Text>
          </View>
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
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileEmoji: {
    fontSize: 64,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileAge: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  vaccineCard: {
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
  vaccineList: {
    gap: 12,
  },
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  vaccineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vaccineIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  vaccineDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  vaccineNotes: {
    fontSize: 13,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  emptyVaccines: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyVaccinesIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyVaccinesText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  milestonesCard: {
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
  placeholder: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
