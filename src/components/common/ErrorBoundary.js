import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, BUTTON_SIZES } from '../../theme';
import { logError } from '../../utils/errorLogger';
import AppIcon from './AppIcon';

/**
 * ErrorBoundary - Catches React errors and prevents app crashes
 * 
 * Development Mode:
 *   - Shows full error message and stack trace
 *   - Includes component stack
 *   - Displays in red for visibility
 * 
 * Production Mode:
 *   - User-friendly message
 *   - "Reset App" button to recover
 *   - Logs error details to console (upgradeable to Sentry)
 * 
 * Usage:
 *   Wrap your app root or specific sections:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    logError(error, {
      type: 'REACT_ERROR_BOUNDARY',
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.boundaryName || 'Root',
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  renderDevError() {
    const { error, errorInfo } = this.state;

    return (
      <ScrollView style={styles.devContainer}>
        <View style={styles.devHeader}>
          <AppIcon name="error" size={48} />
          <Text style={styles.devTitle}>Development Error</Text>
        </View>

        <View style={styles.devSection}>
          <Text style={styles.devLabel}>Error Message:</Text>
          <Text style={styles.devError}>{error?.toString()}</Text>
        </View>

        {error?.stack && (
          <View style={styles.devSection}>
            <Text style={styles.devLabel}>Stack Trace:</Text>
            <Text style={styles.devStack}>{error.stack}</Text>
          </View>
        )}

        {errorInfo?.componentStack && (
          <View style={styles.devSection}>
            <Text style={styles.devLabel}>Component Stack:</Text>
            <Text style={styles.devStack}>{errorInfo.componentStack}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.devResetButton} 
          onPress={this.handleReset}
        >
          <AppIcon name="refresh" size={20} color={COLORS.background} />
          <Text style={styles.devResetText}>Reset and Try Again</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  renderProdError() {
    const { errorCount } = this.state;

    return (
      <View style={styles.prodContainer}>
        <View style={styles.prodContent}>
          {/* Error Icon */}
          <View style={styles.iconContainer}>
            <AppIcon name="error" size={80} />
          </View>

          {/* Title */}
          <Text style={styles.prodTitle}>Oops! Something went wrong</Text>

          {/* Message */}
          <Text style={styles.prodMessage}>
            We're sorry, but something unexpected happened. 
            Don't worry - your data is safe.
          </Text>

          {/* Error count hint (for repeated errors) */}
          {errorCount > 1 && (
            <View style={styles.warningBox}>
              <AppIcon name="warning" size={20} />
              <Text style={styles.warningText}>
                This error has occurred {errorCount} times. 
                Try restarting the app if it persists.
              </Text>
            </View>
          )}

          {/* Reset Button */}
          <TouchableOpacity 
            style={styles.prodResetButton} 
            onPress={this.handleReset}
          >
            <AppIcon name="refresh" size={24} color={COLORS.background} />
            <Text style={styles.prodResetText}>Reset App</Text>
          </TouchableOpacity>

          {/* Help Text */}
          <Text style={styles.helpText}>
            If this problem continues, please contact support
          </Text>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.hasError) {
      // Show dev error in development, user-friendly error in production
      return __DEV__ ? this.renderDevError() : this.renderProdError();
    }

    // No error, render children normally
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  // Development Mode Styles (Detailed)
  devContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: SPACING.md,
  },

  devHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.error,
  },

  devTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error,
    marginTop: SPACING.md,
  },

  devSection: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: '#2a2a2a',
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },

  devLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.warning,
    marginBottom: SPACING.sm,
  },

  devError: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.error,
    fontFamily: 'Courier',
  },

  devStack: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: '#cccccc',
    fontFamily: 'Courier',
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.relaxed,
  },

  devResetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.info,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },

  devResetText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginLeft: SPACING.sm,
  },

  // Production Mode Styles (User-Friendly)
  prodContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  prodContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  prodTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },

  prodMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    marginBottom: SPACING.xl,
  },

  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: SPACING.lg,
  },

  warningText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },

  prodResetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    width: '100%',
    marginBottom: SPACING.lg,
    ...BUTTON_SIZES.large,
  },

  prodResetText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginLeft: SPACING.sm,
  },

  helpText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

export default ErrorBoundary;
