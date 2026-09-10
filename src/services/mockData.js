// Mock initial data for development
export const MOCK_USERS = [
  {
    uid: 'user_parent_1',
    role: 'parent',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  },
  {
    uid: 'user_caregiver_1',
    role: 'caregiver',
    name: 'Maria Santos',
    email: 'maria@example.com',
  },
];

export const MOCK_BABY = {
  babyId: 'baby_1',
  parentId: 'user_parent_1',
  name: 'Emma Johnson',
  birthdate: new Date('2026-01-15').toISOString(),
  photoUrl: null,
};

export const MOCK_VACCINES = [
  {
    vaccineId: 'vaccine_1',
    babyId: 'baby_1',
    vaccineName: 'Hepatitis B',
    dateAdministered: new Date('2026-01-16').toISOString(),
    notes: 'Birth dose',
  },
  {
    vaccineId: 'vaccine_2',
    babyId: 'baby_1',
    vaccineName: 'BCG',
    dateAdministered: new Date('2026-01-16').toISOString(),
    notes: 'Birth dose',
  },
];

// Log types
export const LOG_TYPES = {
  WET_DIAPER: 'wet_diaper',
  DIRTY_DIAPER: 'dirty_diaper',
  FEED: 'feed',
  SLEEP: 'sleep',
};

export const LOG_TYPE_LABELS = {
  [LOG_TYPES.WET_DIAPER]: '💧 Wet Diaper',
  [LOG_TYPES.DIRTY_DIAPER]: '💩 Dirty Diaper',
  [LOG_TYPES.FEED]: '🍼 Feed',
  [LOG_TYPES.SLEEP]: '💤 Sleep',
};

export const LOG_TYPE_ICONS = {
  [LOG_TYPES.WET_DIAPER]: '💧',
  [LOG_TYPES.DIRTY_DIAPER]: '💩',
  [LOG_TYPES.FEED]: '🍼',
  [LOG_TYPES.SLEEP]: '💤',
};
