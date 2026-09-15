/**
 * Error Logger Utility
 * Console-only logging that can be upgraded to Sentry/Bugsnag later
 * 
 * Usage:
 *   import { logError, logWarning, logInfo } from './utils/errorLogger';
 *   logError(error, { context: 'LoginScreen', action: 'login' });
 * 
 * Post-Hackathon Migration:
 *   Replace console calls with Sentry.captureException(error, scope)
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'debug',
};

/**
 * Format error for logging
 */
const formatError = (error, context = {}) => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    message: error.message || 'Unknown error',
    stack: error.stack || 'No stack trace',
    ...context,
  };
  
  return errorInfo;
};

/**
 * Log error to console (upgradeable to Sentry)
 */
export const logError = (error, context = {}) => {
  const formattedError = formatError(error, context);
  
  console.error('❌ [ERROR]', formattedError.message);
  console.error('Context:', formattedError);
  
  if (__DEV__) {
    console.error('Stack:', formattedError.stack);
  }
  
  // TODO: Post-hackathon - Add Sentry integration
  // if (Sentry) {
  //   Sentry.captureException(error, {
  //     contexts: { custom: context },
  //   });
  // }
  
  return formattedError;
};

/**
 * Log warning
 */
export const logWarning = (message, context = {}) => {
  const timestamp = new Date().toISOString();
  const warningInfo = {
    timestamp,
    message,
    ...context,
  };
  
  console.warn('⚠️ [WARNING]', message);
  console.warn('Context:', warningInfo);
  
  // TODO: Post-hackathon - Add Sentry breadcrumb
  // if (Sentry) {
  //   Sentry.addBreadcrumb({
  //     category: 'warning',
  //     message,
  //     level: 'warning',
  //     data: context,
  //   });
  // }
  
  return warningInfo;
};

/**
 * Log info (for debugging flows)
 */
export const logInfo = (message, context = {}) => {
  const timestamp = new Date().toISOString();
  const infoData = {
    timestamp,
    message,
    ...context,
  };
  
  if (__DEV__) {
    console.log('ℹ️ [INFO]', message);
    console.log('Context:', infoData);
  }
  
  // TODO: Post-hackathon - Add Sentry breadcrumb
  // if (Sentry) {
  //   Sentry.addBreadcrumb({
  //     category: 'info',
  //     message,
  //     level: 'info',
  //     data: context,
  //   });
  // }
  
  return infoData;
};

/**
 * Log debug (development only)
 */
export const logDebug = (message, data = {}) => {
  if (__DEV__) {
    console.log('🐛 [DEBUG]', message, data);
  }
};

/**
 * Wrap async functions with error logging
 */
export const withErrorLogging = (fn, context = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, {
        ...context,
        functionName: fn.name,
        arguments: args,
      });
      throw error; // Re-throw to allow caller to handle
    }
  };
};

/**
 * Log API errors with request details
 */
export const logApiError = (error, request = {}) => {
  return logError(error, {
    type: 'API_ERROR',
    url: request.url,
    method: request.method,
    statusCode: error.response?.status,
    responseData: error.response?.data,
  });
};

/**
 * Log storage errors
 */
export const logStorageError = (error, operation = {}) => {
  return logError(error, {
    type: 'STORAGE_ERROR',
    operation: operation.action,
    key: operation.key,
  });
};

/**
 * Log navigation errors
 */
export const logNavigationError = (error, navigation = {}) => {
  return logError(error, {
    type: 'NAVIGATION_ERROR',
    screen: navigation.screen,
    params: navigation.params,
  });
};

/**
 * Initialize error tracking (for future Sentry setup)
 */
export const initializeErrorTracking = (config = {}) => {
  if (__DEV__) {
    console.log('🔍 Error tracking initialized (console-only mode)');
    console.log('Config:', config);
  }
  
  // TODO: Post-hackathon - Initialize Sentry
  // if (!__DEV__ && config.sentryDsn) {
  //   Sentry.init({
  //     dsn: config.sentryDsn,
  //     enableInExpoDevelopment: false,
  //     debug: __DEV__,
  //   });
  // }
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (user = {}) => {
  if (__DEV__) {
    console.log('👤 User context set:', user);
  }
  
  // TODO: Post-hackathon - Set Sentry user
  // if (Sentry) {
  //   Sentry.setUser({
  //     id: user.uid,
  //     email: user.email,
  //     username: user.name,
  //   });
  // }
};

/**
 * Clear user context (on logout)
 */
export const clearUserContext = () => {
  if (__DEV__) {
    console.log('🚪 User context cleared');
  }
  
  // TODO: Post-hackathon - Clear Sentry user
  // if (Sentry) {
  //   Sentry.setUser(null);
  // }
};

export default {
  logError,
  logWarning,
  logInfo,
  logDebug,
  logApiError,
  logStorageError,
  logNavigationError,
  withErrorLogging,
  initializeErrorTracking,
  setUserContext,
  clearUserContext,
};
