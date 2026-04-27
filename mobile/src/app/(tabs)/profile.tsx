import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Switch, useColorScheme, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const [notifs, setNotifs] = useState({ match: true, deadline: true, status: true });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* World Class Profile Header */}
          <View style={styles.header}>
            <View style={[styles.avatarContainer, Shadows.medium]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }} 
                style={[styles.avatar, { borderColor: colors.backgroundElement }]} 
              />
              <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                <Ionicons name="pencil" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <ThemedText type="title" style={styles.name}>Alex Johnson</ThemedText>
            <ThemedText style={styles.bio}>Computer Science • Stanford University</ThemedText>
            
            <View style={styles.statsRow}>
              <StatItem label="Saved" value="12" />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatItem label="Applied" value="5" />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatItem label="Points" value="450" />
            </View>
          </View>

          {/* Settings Sections */}
          <View style={styles.body}>
            <ThemedText type="label" style={styles.sectionLabel}>ACADEMIC PROFILE</ThemedText>
            <ThemedView variant="element" style={styles.card}>
              <ProfileRow label="Department" value="Computer Science" icon="business-outline" />
              <ProfileRow label="Year of Study" value="3rd Year" icon="school-outline" />
              <ProfileRow label="GPA" value="3.8 / 4.0" icon="bar-chart-outline" isLast />
            </ThemedView>

            <ThemedText type="label" style={styles.sectionLabel}>NOTIFICATIONS</ThemedText>
            <ThemedView variant="element" style={styles.card}>
              <SettingRow 
                label="Daily Match Digest" 
                subLabel="Get 5 daily curated opportunities."
                value={notifs.match} 
                onToggle={(v) => setNotifs({...notifs, match: v})} 
              />
              <SettingRow 
                label="Deadline Reminders" 
                subLabel="24h and 1h before expiration."
                value={notifs.deadline} 
                onToggle={(v) => setNotifs({...notifs, deadline: v})} 
              />
              <SettingRow 
                label="Quiet Hours (10 PM – 8 AM)" 
                subLabel="Suppress non-urgent alerts."
                value={true} 
                onToggle={() => {}} 
                isLast
              />
            </ThemedView>

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
      </SafeAreaView>
    </ThemedView>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <View style={styles.statItem}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

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
      <View style={{ flex: 1 }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  name: {
    marginBottom: 4,
  },
  bio: {
    opacity: 0.6,
    fontSize: 14,
    marginBottom: Spacing.four,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 24,
  },
  body: {
    paddingHorizontal: Spacing.four,
  },
  sectionLabel: {
    marginTop: Spacing.six,
    marginBottom: Spacing.three,
  },
  card: {
    borderRadius: Radius.large,
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubLabel: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  rowValue: {
    fontSize: 14,
    opacity: 0.7,
  },
  deleteBtn: {
    marginTop: Spacing.eight,
    alignItems: 'center',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
});
