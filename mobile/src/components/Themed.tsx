import { Text, View, type TextProps, type ViewProps, StyleSheet, TouchableOpacity, useColorScheme, Platform, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, Shadows, Typography } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';
import { ms, vs } from '@/utils/responsive';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colorFromProps = props[theme];
  if (colorFromProps) {
    return colorFromProps;
  } else {
    // @ts-ignore
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
      style={[{ color }, styles[type], style]}
      allowFontScaling={false}
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

  const backgroundColor =
    variant === 'glass'    ? colors.glass :
    variant === 'element'  ? colors.backgroundElement :
    variant === 'selected' ? colors.backgroundSelected :
    colors.background;

  const borderColor = variant === 'glass' ? colors.glassBorder : colors.border;
  const borderWidth = variant === 'glass' ? 1 : 0;

  return (
    <View
      style={[
        { backgroundColor, borderColor, borderWidth },
        variant === 'glass' && styles.glassEffect,
        style,
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
  loading?: boolean;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'success';
  children?: React.ReactNode;
};

export function ThemedButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
  loading = false,
  hapticFeedback = 'light',
  children,
}: ThemedButtonProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const handlePress = () => {
    if (!disabled && !loading) {
      if (hapticFeedback) haptic[hapticFeedback]();
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        variant === 'primary'   && { backgroundColor: colors.primary },
        variant === 'secondary' && { backgroundColor: colors.secondary },
        variant === 'outline'   && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
        variant === 'ghost'     && { backgroundColor: 'transparent' },
        (disabled || loading)   && { opacity: 0.5 },
        variant === 'primary'   && Shadows.medium,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'} />
      ) : children ? (
        children
      ) : (
        <Text
          style={[styles.buttonText, variant === 'outline' && { color: colors.primary }, variant === 'ghost' && { color: colors.primary }, textStyle]}
          allowFontScaling={false}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.default,
    lineHeight: Typography.default * 1.5,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
  },
  defaultSemiBold: {
    fontSize: Typography.default,
    lineHeight: Typography.default * 1.5,
    fontWeight: '600',
  },
  h1: {
    fontSize: Typography.display,
    fontWeight: '900',
    lineHeight: Typography.display * 1.2,
    letterSpacing: -1,
  },
  title: {
    fontSize: Typography.title,
    fontWeight: '800',
    lineHeight: Typography.title * 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: Typography.h2,
    fontWeight: '700',
    lineHeight: Typography.h2 * 1.25,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: Typography.subtitle,
    fontWeight: '700',
    lineHeight: Typography.subtitle * 1.3,
  },
  label: {
    fontSize: Typography.label,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.5,
  },
  link: {
    fontSize: Typography.default,
    color: '#6366f1',
    fontWeight: '600',
  },
  small: {
    fontSize: Typography.small,
    lineHeight: Typography.small * 1.5,
    opacity: 0.8,
  },
  caption: {
    fontSize: Typography.caption,
    lineHeight: Typography.caption * 1.35,
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
    paddingVertical: vs(14),
    paddingHorizontal: ms(32),
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: vs(52),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Typography.default,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
