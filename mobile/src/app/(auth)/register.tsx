import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Spacing, Colors, Radius, Typography } from '@/constants/theme';
import { nf, vs, ms } from '@/utils/responsive';
import { useAuth } from '@/context/AuthContext';

// ─── Universities (same list as welcome.tsx) ──────────────────────────────────
const UNIVERSITIES = [
  'Adama Science and Technology University',
  'Addis Ababa Science and Technology University',
  'Addis Ababa University',
  'Adigrat University',
  'Aksum University',
  'Ambo University',
  'Arba Minch University',
  'Arsi University',
  'Assosa University',
  'Bahir Dar University',
  'Bonga University',
  'Borena University',
  'Bule Hora University',
  'Debark University',
  'Debre Berhan University',
  'Debre Markos University',
  'Debre Tabor University',
  'Dembi Dolo University',
  'Dilla University',
  'Dire Dawa University',
  'Ethiopian Civil Service University',
  'Ethiopian Police University',
  'Gambella University',
  'Haramaya University',
  'Hawassa University',
  'Injibara University',
  'Jijiga University',
  'Jimma University',
  'Jinka University',
  'Kebri Dehar University',
  'Kotebe Education University',
  'Madda Walabu University',
  'Mekdela Amba University',
  'Mekelle University',
  'Mettu University',
  'Mizan-Tepi University',
  'Oromia State University',
  'Raya University',
  'Samara University',
  'Selale University',
  'University of Gondar',
  'Wachemo University',
  'Werabe University',
  'Woldia University',
  'Wolaita Sodo University',
  'Wollega University',
  'Wolkite University',
  'Wollo University',
];

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Economics',
  'Accounting',
  'Law',
  'Medicine',
  'Pharmacy',
  'Nursing',
  'Agriculture',
  'Natural Sciences',
  'Social Sciences',
  'Journalism',
  'Architecture',
  'Other',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];

// ─── Reusable Picker Modal ────────────────────────────────────────────────────
function PickerModal({
  visible,
  title,
  items,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
  onClose: () => void;
}) {
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const [query, setQuery] = useState('');
  const filtered = items.filter(i => i.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={pickerStyles.overlay}>
        <ThemedView variant="element" style={pickerStyles.sheet}>
          <View style={pickerStyles.handle} />
          <View style={pickerStyles.header}>
            <ThemedText type="subtitle">{title}</ThemedText>
            <TouchableOpacity onPress={() => { setQuery(''); onClose(); }} style={pickerStyles.closeBtn}>
              <Ionicons name="close" size={nf(20)} color={colors.text} />
            </TouchableOpacity>
          </View>
          {items.length > 6 && (
            <View style={[pickerStyles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={nf(16)} color={colors.textSecondary} />
              <TextInput
                style={[pickerStyles.searchInput, { color: colors.text }]}
                placeholder="Search..."
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={setQuery}
                allowFontScaling={false}
              />
            </View>
          )}
          <FlatList
            data={filtered}
            keyExtractor={i => i}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[pickerStyles.item, item === selected && { backgroundColor: colors.primary + '12', borderRadius: ms(12) }]}
                onPress={() => { setQuery(''); onSelect(item); onClose(); }}
              >
                <ThemedText style={[pickerStyles.itemText, item === selected && { color: colors.primary, fontWeight: '700' }]}>
                  {item}
                </ThemedText>
                {item === selected && <Ionicons name="checkmark-circle" size={nf(20)} color={colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </ThemedView>
      </View>
    </Modal>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  icon: string;
}) {
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const [showPwd, setShowPwd] = useState(false);

  return (
    <View style={inputStyles.wrapper}>
      <ThemedText style={inputStyles.label}>{label}</ThemedText>
      <View style={[inputStyles.box, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Ionicons name={icon as any} size={nf(18)} color={colors.textSecondary} style={inputStyles.icon} />
        <TextInput
          style={[inputStyles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !showPwd}
          keyboardType={keyboardType}
          autoCapitalize={secureTextEntry ? 'none' : 'words'}
          autoCorrect={false}
          allowFontScaling={false}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPwd(p => !p)} style={inputStyles.eyeBtn}>
            <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={nf(18)} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Selector Field ───────────────────────────────────────────────────────────
function SelectorField({
  label,
  value,
  placeholder,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: string;
  onPress: () => void;
}) {
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  return (
    <View style={inputStyles.wrapper}>
      <ThemedText style={inputStyles.label}>{label}</ThemedText>
      <TouchableOpacity
        style={[inputStyles.box, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name={icon as any} size={nf(18)} color={value ? colors.primary : colors.textSecondary} style={inputStyles.icon} />
        <ThemedText style={[inputStyles.selectorText, !value && { color: colors.textSecondary }]} numberOfLines={1}>
          {value || placeholder}
        </ThemedText>
        <Ionicons name="chevron-down" size={nf(16)} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Register Screen ─────────────────────────────────────────────────────
export default function RegisterScreen() {
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const params = useLocalSearchParams<{ university?: string }>();
  const { register } = useAuth();

  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [university, setUniversity]   = useState(params.university || '');
  const [department, setDepartment]   = useState('');
  const [year, setYear]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  // Modal state
  const [uniModal, setUniModal]       = useState(false);
  const [deptModal, setDeptModal]     = useState(false);
  const [yearModal, setYearModal]     = useState(false);

  const validate = () => {
    if (!fullName.trim())  return 'Please enter your full name.';
    if (!email.includes('@')) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPwd) return 'Passwords do not match.';
    if (!university) return 'Please select your university.';
    if (!department) return 'Please select your department.';
    if (!year) return 'Please select your year of study.';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await register({
        full_name:  fullName.trim(),
        email:      email.trim().toLowerCase(),
        password,
        university,
        department,
        year,
      });
      // On success navigate to tabs
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e?.message || 'Registration failed. Please try again.');
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={nf(22)} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.heading}>
            <ThemedText style={styles.headingTitle}>Create Account</ThemedText>
            <ThemedText type="small" style={styles.headingSubtitle}>
              Join CampusEvent and discover opportunities
            </ThemedText>
          </View>

          {/* ── Personal Info ── */}
          <ThemedView variant="element" style={styles.section}>
            <View style={styles.sectionLabel}>
              <Ionicons name="person" size={nf(16)} color={colors.primary} />
              <ThemedText type="label" style={{ color: colors.primary }}>PERSONAL INFO</ThemedText>
            </View>
            <InputField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Abebe Kebede"
              icon="person-outline"
            />
            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@university.edu.et"
              icon="mail-outline"
              keyboardType="email-address"
            />
          </ThemedView>

          {/* ── University Info ── */}
          <ThemedView variant="element" style={styles.section}>
            <View style={styles.sectionLabel}>
              <Ionicons name="school" size={nf(16)} color={colors.primary} />
              <ThemedText type="label" style={{ color: colors.primary }}>UNIVERSITY INFO</ThemedText>
            </View>
            <SelectorField
              label="University"
              value={university}
              placeholder="Select your university"
              icon="school-outline"
              onPress={() => setUniModal(true)}
            />
            <SelectorField
              label="Department / Faculty"
              value={department}
              placeholder="Select your department"
              icon="book-outline"
              onPress={() => setDeptModal(true)}
            />
            <SelectorField
              label="Year of Study"
              value={year}
              placeholder="Select your year"
              icon="calendar-outline"
              onPress={() => setYearModal(true)}
            />
          </ThemedView>

          {/* ── Password ── */}
          <ThemedView variant="element" style={styles.section}>
            <View style={styles.sectionLabel}>
              <Ionicons name="lock-closed" size={nf(16)} color={colors.primary} />
              <ThemedText type="label" style={{ color: colors.primary }}>SECURITY</ThemedText>
            </View>
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 6 characters"
              icon="lock-closed-outline"
              secureTextEntry
            />
            <InputField
              label="Confirm Password"
              value={confirmPwd}
              onChangeText={setConfirmPwd}
              placeholder="Re-enter your password"
              icon="shield-checkmark-outline"
              secureTextEntry
            />
          </ThemedView>

          {/* Error */}
          {!!error && (
            <View style={[styles.errorBox, { backgroundColor: colors.accent + '15', borderColor: colors.accent }]}>
              <Ionicons name="alert-circle-outline" size={nf(16)} color={colors.accent} />
              <ThemedText style={[styles.errorText, { color: colors.accent }]}>{error}</ThemedText>
            </View>
          )}

          {/* Submit */}
          <ThemedButton
            title={loading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />

          {/* Sign in link */}
          <View style={styles.signinRow}>
            <ThemedText style={styles.signinText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <ThemedText style={[styles.signinLink, { color: colors.primary }]}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <PickerModal
        visible={uniModal}
        title="Select University"
        items={UNIVERSITIES}
        selected={university}
        onSelect={setUniversity}
        onClose={() => setUniModal(false)}
      />
      <PickerModal
        visible={deptModal}
        title="Select Department"
        items={DEPARTMENTS}
        selected={department}
        onSelect={setDepartment}
        onClose={() => setDeptModal(false)}
      />
      <PickerModal
        visible={yearModal}
        title="Year of Study"
        items={YEARS}
        selected={year}
        onSelect={setYear}
        onClose={() => setYearModal(false)}
      />
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: vs(40),
  },
  topBar: {
    paddingTop: vs(56),
    marginBottom: Spacing.two,
  },
  backBtn: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
  },
  heading: {
    marginBottom: Spacing.four,
  },
  headingTitle: {
    fontSize: nf(32),
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: Spacing.one,
  },
  headingSubtitle: {
    opacity: 0.6,
  },
  section: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.one,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  errorText: {
    fontSize: Typography.small,
    flex: 1,
    fontWeight: '600',
  },
  submitBtn: {
    marginBottom: Spacing.three,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: vs(20),
  },
  signinText: {
    fontSize: Typography.small,
    opacity: 0.7,
  },
  signinLink: {
    fontSize: Typography.small,
    fontWeight: '700',
  },
});

const inputStyles = StyleSheet.create({
  wrapper: { gap: ms(6) },
  label: {
    fontSize: Typography.caption,
    fontWeight: '700',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.large,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    minHeight: vs(52),
  },
  icon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: Typography.default,
    paddingVertical: vs(12),
  },
  eyeBtn: {
    padding: ms(8),
  },
  selectorText: {
    flex: 1,
    fontSize: Typography.default,
    fontWeight: '500',
  },
});

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: ms(28),
    borderTopRightRadius: ms(28),
    padding: Spacing.four,
    maxHeight: '85%',
    minHeight: '40%',
  },
  handle: {
    width: ms(40),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  closeBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    height: vs(46),
    borderRadius: Radius.large,
    borderWidth: 1,
    marginBottom: Spacing.two,
    gap: ms(8),
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.default,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: Spacing.three,
    marginVertical: 1,
  },
  itemText: {
    fontSize: Typography.body,
    fontWeight: '500',
    flex: 1,
    marginRight: Spacing.two,
  },
});
