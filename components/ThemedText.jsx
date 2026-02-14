import { Text as RNText, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

/**
 * Custom Text component that applies Manrope font family by default
 * Usage: Import and use like regular Text component
 */
export function Text({ style, children, ...props }) {
  return (
    <RNText style={[styles.defaultText, style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: theme.typography.fontFamily.regular,
  },
});
