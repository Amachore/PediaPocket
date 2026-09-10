import { storage } from './storage';
import STORAGE_KEYS from './storage';
import { MOCK_USERS, MOCK_BABY, MOCK_VACCINES } from './mockData';

// Generate unique IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Initialize default data if not exists
export const initializeDefaultData = async () => {
  const existingUsers = await storage.load(STORAGE_KEYS.USERS);
  if (!existingUsers) {
    await storage.save(STORAGE_KEYS.USERS, MOCK_USERS);
  }

  const existingBaby = await storage.load(STORAGE_KEYS.BABIES);
  if (!existingBaby) {
    await storage.save(STORAGE_KEYS.BABIES, [MOCK_BABY]);
  }

  const existingVaccines = await storage.load(STORAGE_KEYS.VACCINES);
  if (!existingVaccines) {
    await storage.save(STORAGE_KEYS.VACCINES, MOCK_VACCINES);
  }

  const existingLogs = await storage.load(STORAGE_KEYS.LOGS);
  if (!existingLogs) {
    await storage.save(STORAGE_KEYS.LOGS, []);
  }
};

// User operations
export const userService = {
  async getAll() {
    return await storage.load(STORAGE_KEYS.USERS) || [];
  },

  async getById(uid) {
    const users = await this.getAll();
    return users.find(user => user.uid === uid);
  },

  async getByRole(role) {
    const users = await this.getAll();
    return users.filter(user => user.role === role);
  },
};

// Baby operations
export const babyService = {
  async getAll() {
    return await storage.load(STORAGE_KEYS.BABIES) || [];
  },

  async getById(babyId) {
    const babies = await this.getAll();
    return babies.find(baby => baby.babyId === babyId);
  },

  async getByParentId(parentId) {
    const babies = await this.getAll();
    return babies.filter(baby => baby.parentId === parentId);
  },

  async getFirstBaby() {
    const babies = await this.getAll();
    return babies.length > 0 ? babies[0] : null;
  },
};

// Log operations (core feature)
export const logService = {
  async getAll() {
    return await storage.load(STORAGE_KEYS.LOGS) || [];
  },

  async getByBabyId(babyId) {
    const logs = await this.getAll();
    return logs.filter(log => log.babyId === babyId);
  },

  async getTodayLogs(babyId) {
    const logs = await this.getByBabyId(babyId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
  },

  async getDailyCount(babyId) {
    const todayLogs = await this.getTodayLogs(babyId);
    return {
      wet_diaper: todayLogs.filter(log => log.type === 'wet_diaper').length,
      dirty_diaper: todayLogs.filter(log => log.type === 'dirty_diaper').length,
      feed: todayLogs.filter(log => log.type === 'feed').length,
      sleep: todayLogs.filter(log => log.type === 'sleep').length,
      total: todayLogs.length,
    };
  },

  async create(logData) {
    const logs = await this.getAll();
    const newLog = {
      logId: generateId(),
      timestamp: new Date().toISOString(),
      ...logData,
    };
    logs.push(newLog);
    await storage.save(STORAGE_KEYS.LOGS, logs);
    return newLog;
  },

  async delete(logId) {
    const logs = await this.getAll();
    const filteredLogs = logs.filter(log => log.logId !== logId);
    await storage.save(STORAGE_KEYS.LOGS, filteredLogs);
    return true;
  },
};

// Vaccine operations
export const vaccineService = {
  async getAll() {
    return await storage.load(STORAGE_KEYS.VACCINES) || [];
  },

  async getByBabyId(babyId) {
    const vaccines = await this.getAll();
    return vaccines.filter(vaccine => vaccine.babyId === babyId);
  },

  async create(vaccineData) {
    const vaccines = await this.getAll();
    const newVaccine = {
      vaccineId: generateId(),
      ...vaccineData,
    };
    vaccines.push(newVaccine);
    await storage.save(STORAGE_KEYS.VACCINES, vaccines);
    return newVaccine;
  },
};
