import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Spacing, Colors, Radius, Typography } from '@/constants/theme';
import { nf, vs, ms } from '@/utils/responsive';
import { useColorScheme } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router  = useRouter();
  const theme    = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors   = Colors[theme];
  const { login } = useAuth();

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleLogin = async () => {
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password)     { setError('Please enter your password.'); return; }
    setLoading(true);
    setError('');
    try {
      await login({ email: email.trim().toLowerCase(), password });
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={nf(22)} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.header}>
              <ThemedText type="h1">Welcome Back</ThemedText>
              <ThemedText style={styles.subtitle}>Sign in to access your opportunities</ThemedText>
            </View>

            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <ThemedText type="label" style={styles.label}>EMAIL ADDRESS</ThemedText>
                <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                  <Ionicons name="mail-outline" size={nf(20)} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="name@university.edu"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    value={email}
                    onChangeText={v => { setEmail(v); setError(''); }}
                    allowFontScaling={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <ThemedText type="label" style={styles.label}>PASSWORD</ThemedText>
                <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                  <Ionicons name="lock-closed-outline" size={nf(20)} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    value={password}
                    onChangeText={v => { setPassword(v); setError(''); }}
                    allowFontScaling={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={nf(20)} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot */}
              <TouchableOpacity style={styles.forgotPassword}>
                <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
              </TouchableOpacity>

              {/* Error */}
              {!!error && (
                <View style={[styles.errorBox, { backgroundColor: colors.accent + '15', borderColor: colors.accent }]}>
                  <Ionicons name="alert-circle-outline" size={nf(15)} color={colors.accent} />
                  <ThemedText style={[styles.errorText, { color: colors.accent }]}>{error}</ThemedText>
                </View>
              )}

              <ThemedButton
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />

              <View style={styles.signupPrompt}>
                <ThemedText style={styles.promptText}>Don't have an account? </ThemedText>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingBottom: vs(40),
  },
  safeArea: {
    paddingHorizontal: Spacing.four,
  },
  backButton: {
    marginTop: vs(56),
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  header: {
    marginBottom: Spacing.five,
  },
  subtitle: {
    opacity: 0.6,
    marginTop: Spacing.one,
    fontSize: Typography.default,
  },
  form: {
    gap: Spacing.three,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: '700',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(56),
    borderRadius: Radius.large,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: Typography.default,
    height: '100%',
  },
  eyeIcon: {
    padding: Spacing.one,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: Typography.small,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: 1,
  },
  errorText: {
    fontSize: Typography.small,
    fontWeight: '600',
    flex: 1,
  },
  loginButton: {
    marginTop: Spacing.two,
    minHeight: vs(52),
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  promptText: {
    opacity: 0.6,
    fontSize: Typography.body,
  },
  signupLink: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: Typography.body,
  },
});
