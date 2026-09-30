import React, { createContext, useState, useContext, useEffect } from 'react';
import { logService, babyService } from '../services/dataService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [baby, setBaby] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load the first baby (for MVP, we assume single baby)
      const babyData = await babyService.getFirstBaby();
      setBaby(babyData);

      if (babyData) {
        // Load all logs for this baby
        const babyLogs = await logService.getByBabyId(babyData.babyId);
        setLogs(babyLogs);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLogs = async () => {
    if (baby) {
      const babyLogs = await logService.getByBabyId(baby.babyId);
      setLogs(babyLogs);
    }
  };

  const updateBaby = async (updates) => {
    if (!baby) return;
    const updatedBaby = await babyService.update(baby.babyId, updates);
    if (updatedBaby) setBaby(updatedBaby);
  };

  const addLog = async (type, loggedBy) => {
    if (!baby) return { success: false, error: 'No baby data' };

    try {
      const newLog = await logService.create({
        babyId: baby.babyId,
        type,
        loggedBy,
      });
      setLogs(prevLogs => [...prevLogs, newLog]);
      return { success: true, log: newLog };
    } catch (error) {
      console.error('Error adding log:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteLog = async (logId) => {
    try {
      await logService.delete(logId);
      setLogs(prevLogs => prevLogs.filter(log => log.logId !== logId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting log:', error);
      return { success: false, error: error.message };
    }
  };

  const getTodayLogs = () => {
    if (!baby) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getDailyCount = () => {
    const todayLogs = getTodayLogs();
    return {
      wet_diaper: todayLogs.filter(log => log.type === 'wet_diaper').length,
      dirty_diaper: todayLogs.filter(log => log.type === 'dirty_diaper').length,
      feed: todayLogs.filter(log => log.type === 'feed').length,
      sleep: todayLogs.filter(log => log.type === 'sleep').length,
      total: todayLogs.length,
    };
  };

  const value = {
    logs,
    baby,
    isLoading,
    addLog,
    deleteLog,
    refreshLogs,
    updateBaby,
    getTodayLogs,
    getDailyCount,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
