import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch, useColorScheme, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '@/components/Themed';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();

  const [notifs, setNotifs] = useState({ match: true, deadline: true, status: true });

  const HEADER_HEIGHT = 60;

  return (
    <ThemedView style={styles.container}>
      
      {/* ── Glassmorphic Header ── */}
      <BlurView
        intensity={theme === 'dark' ? 60 : 80}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={[styles.headerOverlay, { paddingTop: insets.top, height: insets.top + HEADER_HEIGHT }]}
      >
        <View style={[styles.headerBar]}>
          <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>Profile</ThemedText>
          <TouchableOpacity onPress={() => haptic.light()} accessibilityRole="button">
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + HEADER_HEIGHT + Spacing.four }]}>
        
        {/* ── Avatar Section ── */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarContainer, Shadows.medium]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }} 
              style={[styles.avatar, { borderColor: colors.backgroundElement }]} 
            />
            <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]} onPress={() => haptic.light()}>
              <Ionicons name="pencil" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={styles.name}>Alex Johnson</ThemedText>
          <ThemedText style={styles.bio}>Computer Science • Stanford University</ThemedText>
        </View>

        <View style={styles.body}>
          
          {/* ── Bento Grid Stats ── */}
          <View style={styles.bentoGrid}>
            <ThemedView variant="element" style={[styles.bentoCard, styles.bentoLeft]}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="bookmark" size={20} color={colors.primary} />
              </View>
              <View>
                <ThemedText style={styles.statValue}>12</ThemedText>
                <ThemedText style={styles.statLabel}>Saved</ThemedText>
              </View>
            </ThemedView>

            <View style={styles.bentoCol}>
              <ThemedView variant="element" style={[styles.bentoCardMini, { marginBottom: Spacing.two }]}>
                <ThemedText style={styles.statValueMini}>5</ThemedText>
                <ThemedText style={styles.statLabel}>Applied</ThemedText>
              </ThemedView>
              <ThemedView variant="element" style={styles.bentoCardMini}>
                <ThemedText style={[styles.statValueMini, { color: colors.secondary }]}>450</ThemedText>
                <ThemedText style={styles.statLabel}>Points</ThemedText>
              </ThemedView>
            </View>
          </View>

          {/* ── Academic Profile ── */}
          <ThemedText type="label" style={styles.sectionLabel}>ACADEMIC PROFILE</ThemedText>
          <ThemedView variant="element" style={styles.card}>
            <ProfileRow label="Department" value="Computer Science" icon="business-outline" />
            <ProfileRow label="Year of Study" value="3rd Year" icon="school-outline" />
            <ProfileRow label="GPA" value="3.8 / 4.0" icon="bar-chart-outline" isLast />
          </ThemedView>

          {/* ── Notifications ── */}
          <ThemedText type="label" style={styles.sectionLabel}>NOTIFICATIONS</ThemedText>
          <ThemedView variant="element" style={styles.card}>
            <SettingRow 
              label="Daily Match Digest" 
              subLabel="Get 5 daily curated opportunities."
              value={notifs.match} 
              onToggle={(v) => { haptic.light(); setNotifs({...notifs, match: v}); }} 
            />
            <SettingRow 
              label="Deadline Reminders" 
              subLabel="24h and 1h before expiration."
              value={notifs.deadline} 
              onToggle={(v) => { haptic.light(); setNotifs({...notifs, deadline: v}); }} 
            />
            <SettingRow 
              label="Quiet Hours (10 PM – 8 AM)" 
              subLabel="Suppress non-urgent alerts."
              value={true} 
              onToggle={() => haptic.light()} 
              isLast
            />
          </ThemedView>

          {/* ── Account Actions ── */}
          <ThemedText type="label" style={styles.sectionLabel}>ACCOUNT</ThemedText>
          <ThemedView variant="element" style={styles.card}>
            <ActionRow label="Privacy Settings" icon="lock-closed-outline" />
            <ActionRow label="Export My Data" icon="download-outline" />
            <ActionRow label="Sign Out" icon="log-out-outline" isLast color={colors.accent} onPress={() => router.replace('/(auth)/welcome')} />
          </ThemedView>

          <TouchableOpacity style={styles.deleteBtn}>
            <ThemedText style={styles.deleteText}>Delete Account Permanently</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// ─── Component Helpers ────────────────────────────────────────────────────────

function ProfileRow({ label, value, icon, isLast }: { label: string, value: string, icon: keyof typeof Ionicons.glyphMap, isLast?: boolean }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <View style={[styles.row, !isLast && styles.borderBottom]}>
      <View style={styles.rowLabelGroup}>
        <Ionicons name={icon} size={18} color={colors.primary} />
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" style={styles.rowValue}>{value}</ThemedText>
    </View>
  );
}

function SettingRow({ label, subLabel, value, onToggle, isLast }: { label: string, subLabel: string, value: boolean, onToggle: (v: boolean) => void, isLast?: boolean }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <View style={[styles.row, !isLast && styles.borderBottom]}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
        <ThemedText style={styles.rowSubLabel}>{subLabel}</ThemedText>
      </View>
      <Switch value={value} onValueChange={onToggle} trackColor={{ true: colors.primary }} />
    </View>
  );
}

function ActionRow({ label, icon, isLast, color, onPress }: { label: string, icon: keyof typeof Ionicons.glyphMap, isLast?: boolean, color?: string, onPress?: () => void }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, !isLast && styles.borderBottom]}>
      <View style={styles.rowLabelGroup}>
        <Ionicons name={icon} size={18} color={color || colors.textSecondary} />
        <ThemedText style={[styles.rowLabel, color ? { color } : {}]}>{label}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  scrollContent: { paddingBottom: 110 },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.three,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  name: { marginBottom: 4 },
  bio: {
    opacity: 0.6,
    fontSize: 14,
  },
  body: { paddingHorizontal: Spacing.four },
  
  // Bento Grid
  bentoGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  bentoCol: {
    flex: 1,
  },
  bentoCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  bentoLeft: {
    flex: 1.2,
    justifyContent: 'space-between',
  },
  bentoCardMini: {
    flex: 1,
    borderRadius: Radius.xl,
    padding: Spacing.three,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 2 },
  statValueMini: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 13, opacity: 0.6, fontWeight: '500' },
  
  sectionLabel: { marginTop: Spacing.six, marginBottom: Spacing.three },
  card: {
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.four,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  rowLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSubLabel: { fontSize: 13, opacity: 0.5, marginTop: 4, lineHeight: 18 },
  rowValue: { fontSize: 14, opacity: 0.7 },
  deleteBtn: { marginTop: Spacing.eight, alignItems: 'center', marginBottom: Spacing.five },
  deleteText: { color: '#EF4444', fontSize: 14, fontWeight: '600', opacity: 0.8 },
});
