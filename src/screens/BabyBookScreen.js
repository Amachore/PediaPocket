import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useData } from '../context/DataContext';
import { vaccineService } from '../services/dataService';
import AppIcon from '../components/common/AppIcon';

const MILESTONE_PREVIEW = [
  { id: 'firstSmile', title: 'First Smile', age: 'Around 2 months' },
  { id: 'holdsHeadUp', title: 'Holds Head Up', age: 'Around 3 months' },
  { id: 'firstRoll', title: 'First Roll', age: 'Around 4 months' },
  { id: 'sitsWithoutSupport', title: 'Sits Without Support', age: 'Around 6 months' },
];

export default function BabyBookScreen() {
  const { baby, updateBaby } = useData();
  const [vaccines, setVaccines] = React.useState([]);
  const [visitQuestions, setVisitQuestions] = React.useState('');
  const [isVaccineModalVisible, setIsVaccineModalVisible] = React.useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = React.useState(false);
  const [vaccineForm, setVaccineForm] = React.useState({
    vaccineName: '',
    dueAgeMonths: '',
    dateAdministered: '',
    notes: '',
  });
  const [profileForm, setProfileForm] = React.useState({
    name: '',
    birthdate: '',
    photoPlaceholder: '',
    weightKg: '',
    lengthCm: '',
  });
  const saveTimer = React.useRef(null);

  React.useEffect(() => {
    loadVaccines();
    setVisitQuestions(baby?.visitQuestions || '');
  }, [baby?.babyId]);

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

  const getVaccineStatus = (vaccine) => {
    const isCompleted = vaccine.status
      ? vaccine.status === 'completed'
      : Boolean(vaccine.dateAdministered);
    return isCompleted
      ? { label: 'Completed', color: '#248A3D', backgroundColor: '#E4F5E8', icon: '✓' }
      : { label: 'Pending', color: '#636366', backgroundColor: '#E5E5EA', icon: '•' };
  };

  const toggleVaccineStatus = async (vaccine) => {
    const nextStatus = getVaccineStatus(vaccine).label === 'Completed' ? 'pending' : 'completed';
    try {
      const updatedVaccine = await vaccineService.update(vaccine.vaccineId, { status: nextStatus });
      if (updatedVaccine) {
        setVaccines(current => current.map(item =>
          item.vaccineId === updatedVaccine.vaccineId ? updatedVaccine : item
        ));
      }
    } catch (error) {
      Alert.alert('Unable to update record', 'Please try changing the vaccine status again.');
    }
  };

  const openVaccineForm = () => {
    setVaccineForm({ vaccineName: '', dueAgeMonths: '', dateAdministered: '', notes: '' });
    setIsVaccineModalVisible(true);
  };

  const saveVaccine = async () => {
    const vaccineName = vaccineForm.vaccineName.trim();
    if (!vaccineName) {
      Alert.alert('Vaccine name required', 'Enter a name for this vaccine or booster.');
      return;
    }

    const ageText = vaccineForm.dueAgeMonths.trim();
    const dueAgeMonths = ageText ? Number(ageText) : null;
    if (ageText && (!Number.isFinite(dueAgeMonths) || dueAgeMonths < 0)) {
      Alert.alert('Check target age', 'Enter the target age in months using a number.');
      return;
    }

    const administeredText = vaccineForm.dateAdministered.trim();
    const administeredDate = administeredText
      ? new Date(`${administeredText}T12:00:00`)
      : null;
    if (administeredText && Number.isNaN(administeredDate.getTime())) {
      Alert.alert('Check administered date', 'Enter a valid date, such as 2026-10-01.');
      return;
    }

    try {
      const newVaccine = await vaccineService.create({
        babyId: baby.babyId,
        vaccineName,
        dueAgeMonths,
        dateAdministered: administeredDate ? administeredDate.toISOString() : null,
        notes: vaccineForm.notes.trim(),
        status: administeredDate ? 'completed' : 'pending',
      });
      setVaccines(current => [...current, newVaccine]);
      setIsVaccineModalVisible(false);
    } catch (error) {
      Alert.alert('Unable to save record', 'Please try adding the vaccine again.');
    }
  };

  const openProfileForm = () => {
    const birthdate = new Date(baby.birthdate);
    setProfileForm({
      name: baby.name || '',
      birthdate: Number.isNaN(birthdate.getTime()) ? '' : birthdate.toISOString().slice(0, 10),
      photoPlaceholder: baby.photoPlaceholder || '👶',
      weightKg: baby.currentWeightKg == null ? '' : String(baby.currentWeightKg),
      lengthCm: baby.currentLengthCm == null ? '' : String(baby.currentLengthCm),
    });
    setIsProfileModalVisible(true);
  };

  const saveProfile = async () => {
    const name = profileForm.name.trim();
    const birthdateText = profileForm.birthdate.trim();
    const birthdate = new Date(`${birthdateText}T12:00:00`);
    if (!name || !birthdateText || Number.isNaN(birthdate.getTime())) {
      Alert.alert('Check baby details', 'Enter a name and a valid birthdate in YYYY-MM-DD format.');
      return;
    }

    const weightText = profileForm.weightKg.trim();
    const lengthText = profileForm.lengthCm.trim();
    const weightKg = weightText ? Number(weightText) : null;
    const lengthCm = lengthText ? Number(lengthText) : null;
    if (
      (weightText && (!Number.isFinite(weightKg) || weightKg <= 0)) ||
      (lengthText && (!Number.isFinite(lengthCm) || lengthCm <= 0))
    ) {
      Alert.alert('Check measurements', 'Weight and length must be positive numbers, or left blank.');
      return;
    }

    await updateBaby({
      name,
      birthdate: birthdate.toISOString(),
      photoPlaceholder: profileForm.photoPlaceholder.trim() || '👶',
      currentWeightKg: weightKg,
      currentLengthCm: lengthCm,
    });
    setIsProfileModalVisible(false);
  };

  const toggleMilestone = (milestoneId) => {
    const milestones = baby.milestones || {};
    updateBaby({ milestones: { ...milestones, [milestoneId]: !milestones[milestoneId] } });
  };

  const handleVisitQuestionsChange = (value) => {
    setVisitQuestions(value);
    clearTimeout(saveTimer.current);
    const babyId = baby.babyId;
    saveTimer.current = setTimeout(() => {
      if (baby.babyId === babyId) updateBaby({ visitQuestions: value });
    }, 500);
  };

  const saveVisitQuestions = () => {
    clearTimeout(saveTimer.current);
    updateBaby({ visitQuestions });
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
            <Text style={styles.profileEmoji}>{baby.photoPlaceholder || '👶'}</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{baby.name}</Text>
              <Text style={styles.profileAge}>
                {calculateAge(baby.birthdate)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={openProfileForm}
              accessibilityRole="button"
              accessibilityLabel="Edit baby profile"
            >
              <AppIcon name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
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
            <View style={styles.vitalsPreview}>
              <View style={styles.vitalPreviewItem}>
                <Text style={styles.detailLabel}>Last Weight</Text>
                <Text style={styles.vitalPreviewValue}>
                  {baby.currentWeightKg == null ? 'Not recorded' : `${baby.currentWeightKg} kg`}
                </Text>
              </View>
              <View style={styles.vitalPreviewItem}>
                <Text style={styles.detailLabel}>Last Length</Text>
                <Text style={styles.vitalPreviewValue}>
                  {baby.currentLengthCm == null ? 'Not recorded' : `${baby.currentLengthCm} cm`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.healthCard}>
          <Text style={styles.sectionTitle}>Emergency & Vitals</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Blood Type</Text>
              <Text style={styles.healthValue}>{baby.bloodType || 'None recorded'}</Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Known Allergies</Text>
              <Text style={styles.healthValue}>
                {baby.allergies?.length ? baby.allergies.join(', ') : 'None recorded'}
              </Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Pediatrician</Text>
              <Text style={styles.healthValue}>{baby.pediatricianName || 'None recorded'}</Text>
              <Text style={styles.healthSubvalue}>{baby.pediatricianPhone || 'No contact recorded'}</Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Clinic</Text>
              <Text style={styles.healthValue}>{baby.clinicName || 'None recorded'}</Text>
            </View>
          </View>
        </View>

        {/* Immunization Records */}
        <View style={styles.vaccineCard}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, styles.sectionHeaderTitle]}>Immunization Records</Text>
            <TouchableOpacity style={styles.addButton} onPress={openVaccineForm}>
              <AppIcon name="add" size={18} color="#007AFF" />
              <Text style={styles.addButtonText}>Add Custom Record</Text>
            </TouchableOpacity>
          </View>
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
                <TouchableOpacity
                  key={vaccine.vaccineId}
                  style={styles.vaccineItem}
                  onPress={() => toggleVaccineStatus(vaccine)}
                  accessibilityRole="button"
                  accessibilityLabel={`${vaccine.vaccineName}, ${getVaccineStatus(vaccine).label}. Tap to change status.`}
                >
                  <View style={styles.vaccineInfo}>
                    <Text style={styles.vaccineName}>{vaccine.vaccineName}</Text>
                    {vaccine.dateAdministered ? (
                      <Text style={styles.vaccineDate}>
                        Administered {new Date(vaccine.dateAdministered).toLocaleDateString()}
                      </Text>
                    ) : Number.isFinite(Number(vaccine.dueAgeMonths)) ? (
                      <Text style={styles.vaccineDate}>Recommended at {vaccine.dueAgeMonths} months</Text>
                    ) : null}
                    {vaccine.notes && (
                      <Text style={styles.vaccineNotes}>{vaccine.notes}</Text>
                    )}
                  </View>
                  {(() => {
                    const status = getVaccineStatus(vaccine);
                    return (
                      <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
                        <Text style={[styles.statusIcon, { color: status.color }]}>{status.icon}</Text>
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                      </View>
                    );
                  })()}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Milestone preview */}
        <View style={styles.milestonesCard}>
          <Text style={styles.sectionTitle}>Growth & Milestones</Text>
          <View style={styles.milestoneList}>
            {MILESTONE_PREVIEW.map((milestone) => {
              const isCompleted = Boolean(baby.milestones?.[milestone.id]);
              return (
                <TouchableOpacity
                  key={milestone.id}
                  style={styles.milestoneItem}
                  onPress={() => toggleMilestone(milestone.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isCompleted }}
                  accessibilityLabel={`${milestone.title}, ${milestone.age}`}
                >
                  <View style={[styles.milestoneCheckbox, isCompleted && styles.milestoneCheckboxChecked]}>
                    {isCompleted && <Text style={styles.milestoneCheckmark}>✓</Text>}
                  </View>
                  <View style={styles.milestoneInfo}>
                    <Text style={[styles.milestoneTitle, isCompleted && styles.milestoneTitleCompleted]}>
                      {milestone.title}
                    </Text>
                    <Text style={styles.milestoneAge}>{milestone.age}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.questionsCard}>
          <Text style={styles.sectionTitle}>Questions for Next Pedia Visit</Text>
          <TextInput
            style={styles.questionsInput}
            value={visitQuestions}
            onChangeText={handleVisitQuestionsChange}
            onEndEditing={saveVisitQuestions}
            placeholder={'Ask about sleep regression...\nSafe formula transition age...'}
            placeholderTextColor="#8E8E93"
            multiline
            textAlignVertical="top"
            accessibilityLabel="Questions for next pediatrician visit"
          />
        </View>
      </ScrollView>

      <FormModal
        visible={isVaccineModalVisible}
        title="Add Immunization"
        onClose={() => setIsVaccineModalVisible(false)}
        onSave={saveVaccine}
        saveLabel="Add"
      >
        <FormField
          label="Name"
          value={vaccineForm.vaccineName}
          onChangeText={value => setVaccineForm(current => ({ ...current, vaccineName: value }))}
          placeholder="Vaccine or booster"
        />
        <FormField
          label="Target Age (months)"
          value={vaccineForm.dueAgeMonths}
          onChangeText={value => setVaccineForm(current => ({ ...current, dueAgeMonths: value }))}
          placeholder="For example, 2"
          keyboardType="numeric"
        />
        <FormField
          label="Date Administered"
          value={vaccineForm.dateAdministered}
          onChangeText={value => setVaccineForm(current => ({ ...current, dateAdministered: value }))}
          placeholder="YYYY-MM-DD"
        />
        <FormField
          label="Notes"
          value={vaccineForm.notes}
          onChangeText={value => setVaccineForm(current => ({ ...current, notes: value }))}
          placeholder="Optional details"
          multiline
        />
      </FormModal>

      <FormModal
        visible={isProfileModalVisible}
        title="Edit Baby Profile"
        onClose={() => setIsProfileModalVisible(false)}
        onSave={saveProfile}
        saveLabel="Save"
      >
        <FormField
          label="Name"
          value={profileForm.name}
          onChangeText={value => setProfileForm(current => ({ ...current, name: value }))}
          placeholder="Baby's name"
        />
        <FormField
          label="Birthdate"
          value={profileForm.birthdate}
          onChangeText={value => setProfileForm(current => ({ ...current, birthdate: value }))}
          placeholder="YYYY-MM-DD"
        />
        <FormField
          label="Photo Placeholder"
          value={profileForm.photoPlaceholder}
          onChangeText={value => setProfileForm(current => ({ ...current, photoPlaceholder: value }))}
          placeholder="👶"
          accessibilityLabel="Baby photo placeholder"
        />
        <FormField
          label="Last Weight (kg)"
          value={profileForm.weightKg}
          onChangeText={value => setProfileForm(current => ({ ...current, weightKg: value }))}
          placeholder="For example, 6.4"
          keyboardType="decimal-pad"
        />
        <FormField
          label="Last Length (cm)"
          value={profileForm.lengthCm}
          onChangeText={value => setProfileForm(current => ({ ...current, lengthCm: value }))}
          placeholder="For example, 62.5"
          keyboardType="decimal-pad"
        />
      </FormModal>
    </SafeAreaView>
  );
}

function FormField({ label, multiline, ...inputProps }) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[styles.formInput, multiline && styles.formMultilineInput]}
        placeholderTextColor="#8E8E93"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

function FormModal({ visible, title, onClose, onSave, saveLabel, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
              <AppIcon name="close" size={22} color="#636366" />
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          <TouchableOpacity style={styles.modalSaveButton} onPress={onSave}>
            <Text style={styles.modalSaveText}>{saveLabel}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
  healthCard: {
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
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  healthItem: {
    width: '50%',
    paddingRight: 12,
  },
  healthLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  healthSubvalue: {
    fontSize: 13,
    color: '#636366',
    marginTop: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#EAF3FF',
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
  vitalsPreview: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 14,
    gap: 24,
  },
  vitalPreviewItem: {
    flex: 1,
  },
  vitalPreviewValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionHeaderTitle: {
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#EAF3FF',
  },
  addButtonText: {
    marginLeft: 4,
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  vaccineList: {
    gap: 12,
  },
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  vaccineInfo: {
    flex: 1,
    marginRight: 8,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  statusIcon: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionsCard: {
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
  questionsInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 21,
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
  milestoneList: {
    gap: 4,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  milestoneCheckbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#8E8E93',
    borderRadius: 6,
    marginRight: 12,
  },
  milestoneCheckboxChecked: {
    backgroundColor: '#248A3D',
    borderColor: '#248A3D',
  },
  milestoneCheckmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  milestoneTitleCompleted: {
    color: '#636366',
  },
  milestoneAge: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 3,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalContent: {
    maxHeight: '90%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: {
    color: '#1C1C1E',
    fontSize: 20,
    fontWeight: '700',
  },
  formField: {
    marginBottom: 14,
  },
  formLabel: {
    marginBottom: 6,
    color: '#3A3A3C',
    fontSize: 14,
    fontWeight: '600',
  },
  formInput: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    color: '#1C1C1E',
    fontSize: 15,
  },
  formMultilineInput: {
    minHeight: 80,
    paddingTop: 10,
  },
  modalSaveButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
