import { Text, View, type TextProps, type ViewProps, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // @ts-ignore - Colors is indexed by 'light' or 'dark'
    return Colors[theme][colorName];
  }
}

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'small' | 'caption' | 'label' | 'h1' | 'h2';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'element' | 'selected' | 'glass' | 'blur';
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'default',
  ...rest
}: ThemedViewProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  
  if (variant === 'blur') {
    return (
      <BlurView
        intensity={theme === 'dark' ? 40 : 60}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={[styles.blurView, style]}
        {...rest}
      />
    );
  }

  const backgroundColor = variant === 'glass' ? colors.glass : 
    variant === 'element' ? colors.backgroundElement : 
    variant === 'selected' ? colors.backgroundSelected : 
    colors.background;

  const borderColor = variant === 'glass' ? colors.glassBorder : colors.border;
  const borderWidth = variant === 'glass' ? 1 : 0;

  return (
    <View 
      style={[
        { backgroundColor, borderColor, borderWidth }, 
        variant === 'glass' && styles.glassEffect,
        style
      ]} 
      {...rest} 
    />
  );
}

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'success';
};

export function ThemedButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
  hapticFeedback = 'light',
}: ThemedButtonProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const handlePress = () => {
    if (!disabled) {
      if (hapticFeedback) haptic[hapticFeedback]();
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[
        styles.button,
        variant === 'primary' && { backgroundColor: colors.primary },
        variant === 'secondary' && { backgroundColor: colors.secondary },
        variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        disabled && { opacity: 0.5 },
        variant === 'primary' && Shadows.medium,
        style,
      ]} 
      disabled={disabled} 
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.buttonText,
          variant === 'outline' && { color: colors.primary },
          variant === 'ghost' && { color: colors.primary },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  h1: {
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 48,
    letterSpacing: -1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.5,
  },
  link: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.6,
  },
  glassEffect: {
    borderRadius: Radius.large,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
    }),
  },
  blurView: {
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
