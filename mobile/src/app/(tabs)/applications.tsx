import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Spacing, Colors, Radius, Typography } from '@/constants/theme';
import { nf, vs, ms } from '@/utils/responsive';
import { useAuth } from '@/context/AuthContext';
import { useOpportunities } from '@/hooks/useOpportunities';

export default function ApplicationsScreen() {
  const router = useRouter();
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const { data: items, loading } = useOpportunities({ is_applied: true });
  const [view, setView] = useState<'List' | 'Calendar'>('List');
  
  const HEADER_HEIGHT = vs(100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':    return '#10b981';
      case 'Rejected':    return '#ef4444';
      case 'Interviewing': return '#6366f1';
      default:            return '#64748b';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.unauthContainer}>
          <View style={styles.unauthIconContainer}>
            <Ionicons name="document-text" size={nf(80)} color={colors.primary} />
          </View>
          <ThemedText type="h1" style={styles.unauthTitle}>Applied</ThemedText>
          <ThemedText style={styles.unauthSubtitle}>
            Sign in to track your applications and view your upcoming interviews and deadlines.
          </ThemedText>
          <ThemedButton 
            title="Sign In / Register" 
            onPress={() => router.push('/(auth)/login')} 
            style={styles.unauthButton}
          />
        </View>
      </ThemedView>
    );
  }

  const renderItem = useCallback(({ item }: { item: any }) => (
    <ThemedView variant="element" style={styles.appCard}>
      <View style={styles.cardInfo}>
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        <ThemedText style={styles.orgText}>{item.organization}</ThemedText>
        <ThemedText style={styles.dateText}>Applied on {item.deadline}</ThemedText>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor((item as any).status || 'Applied')}20` }]}>
        <ThemedText style={{ color: getStatusColor((item as any).status || 'Applied'), fontSize: Typography.caption, fontWeight: '700' }}>
          {((item as any).status || 'Applied').toUpperCase()}
        </ThemedText>
      </View>
    </ThemedView>
  ), [getStatusColor]);

  return (
    <ThemedView style={styles.container}>
      {/* ── Glassmorphic Header ── */}
      <BlurView
        intensity={theme === 'dark' ? 60 : 80}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={[styles.headerOverlay, { paddingTop: insets.top }]}
      >
        <View style={[styles.header, { height: HEADER_HEIGHT }]}>
          <View>
            <ThemedText type="title">Applied</ThemedText>
            <ThemedText type="small">{items.length} applications submitted</ThemedText>
          </View>
        </View>
        <View style={styles.filterBar}>
          <View style={[styles.toggleContainer, { backgroundColor: colors.backgroundElement }]}>
            {(['List', 'Calendar'] as const).map(v => (
              <TouchableOpacity
                key={v}
                style={[styles.toggleBtn, view === v && { backgroundColor: colors.background }]}
                onPress={() => setView(v)}
              >
                <ThemedText style={view === v ? { fontWeight: '700' } : undefined}>{v}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BlurView>

        {view === 'List' ? (
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : items.length > 0 ? (
            <View style={{ flex: 1 }}>
              <FlashList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}

              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={nf(48)} color={colors.textSecondary} style={{ marginBottom: 16 }} />
              <ThemedText type="subtitle">No applications yet</ThemedText>
              <ThemedText style={styles.emptySub}>Your submitted applications will appear here.</ThemedText>
            </View>
          )
        ) : (
          <View style={styles.calendarContainer}>
            <ThemedText type="subtitle" style={styles.monthTitle}>October 2026</ThemedText>
            <View style={styles.grid}>
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const hasApp = [5, 10, 12].includes(day);
                return (
                  <View key={i} style={[styles.dayCell, hasApp && { backgroundColor: colors.primary }]}>
                    <ThemedText style={hasApp ? { color: '#FFF' } : undefined}>{day}</ThemedText>
                    {hasApp && <View style={styles.dot} />}
                  </View>
                );
              })}
            </View>
            <View style={styles.legend}>
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              <ThemedText style={styles.legendText}>Application submitted</ThemedText>
            </View>
          </View>
        )}
    </ThemedView>
  );
}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  filterBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: ms(12),
    padding: ms(4),
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: vs(8),
    alignItems: 'center',
    borderRadius: ms(8),
  },
  list: { padding: Spacing.four, paddingTop: vs(170), paddingBottom: vs(120) },
  appCard: {
    flexDirection: 'row',
    padding: Spacing.four,
    borderRadius: ms(20),
    marginBottom: Spacing.three,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1 },
  orgText: {
    fontSize: Typography.small,
    opacity: 0.6,
    marginTop: 2,
  },
  dateText: {
    fontSize: Typography.caption,
    opacity: 0.5,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: ms(8),
  },
  calendarContainer: { padding: Spacing.four, paddingTop: vs(170) },
  monthTitle: {
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
    justifyContent: 'center',
  },
  dayCell: {
    width: ms(45),
    height: ms(45),
    borderRadius: ms(10),
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: '#FFF',
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.six,
    justifyContent: 'center',
  },
  legendText: {
    fontSize: Typography.caption,
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: vs(100),
  },
  emptySub: {
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 250,
    fontSize: Typography.body,
  },
  // Unauth State
  unauthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.six,
  },
  unauthIconContainer: {
    marginBottom: Spacing.four,
    opacity: 0.8,
  },
  unauthTitle: {
    fontSize: nf(32),
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  unauthSubtitle: {
    fontSize: Typography.body,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.six,
  },
  unauthButton: {
    width: '100%',
    height: vs(56),
  },
});
