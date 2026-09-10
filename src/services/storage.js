import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USERS: '@pediapocket_users',
  BABIES: '@pediapocket_babies',
  LOGS: '@pediapocket_logs',
  VACCINES: '@pediapocket_vaccines',
  CURRENT_USER: '@pediapocket_current_user',
};

// Generic storage operations
export const storage = {
  async save(key, data) {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.error('Error saving data:', e);
      return false;
    }
  },

  async load(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error loading data:', e);
      return null;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing data:', e);
      return false;
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  },
};

export default STORAGE_KEYS;
