import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/components/Themed';
import { SkeletonLoader } from '@/components/Feedback';
import { OpportunityCard } from '@/components/OpportunityCard';
import { TrendingSection, DeadlineAlertSection } from '@/components/ContextualSections';
import { RecommendationSheet } from '@/components/RecommendationSheet';
import { FilterModal } from '@/components/FilterModal';
import { Spacing, Colors, Radius } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/context/AuthContext';
import { type Opportunity } from '@/api/opportunities';

// ─── Dynamic date helper ──────────────────────────────────────────────────────
function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();
}

// ─── Animated Card Wrapper ───────────────────────────────────────────────────
function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(14)}>
      {children}
    </Animated.View>
  );
}

// ─── Error State ─────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <View style={errorStyles.wrapper}>
      <Ionicons name="cloud-offline-outline" size={52} color={colors.textSecondary} />
      <ThemedText type="subtitle" style={errorStyles.title}>Something went wrong</ThemedText>
      <ThemedText style={errorStyles.msg}>{message}</ThemedText>
      <TouchableOpacity
        style={[errorStyles.retryBtn, { backgroundColor: colors.primary }]}
        onPress={onRetry}
      >
        <ThemedText style={errorStyles.retryText}>Try Again</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const errorStyles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  title:   { marginTop: 8 },
  msg:     { opacity: 0.6, textAlign: 'center', lineHeight: 22 },
  retryBtn: { marginTop: 8, paddingHorizontal: 32, paddingVertical: 14, borderRadius: Radius.full },
  retryText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

// ─── Trending Mock ────────────────────────────────────────────────────────────
const TRENDING_DATA: Opportunity[] = [
  { id: 't1', type: 'Internship', title: 'Product Manager Intern', organization: 'Meta', deadline: 'Nov 1', description: 'Shape the future of social.', save_count: 5600, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000', is_saved: false, is_deadline_soon: false, match_score: 98, is_featured: true },
  { id: 't2', type: 'Event', title: 'Career Fair 2026', organization: 'Career Center', deadline: 'Oct 18', description: 'Meet 50+ employers.', save_count: 3800, image: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=1000', is_saved: false, is_deadline_soon: false, match_score: 85, is_featured: false },
];

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function HomeFeedScreen() {
  const { user } = useAuth();
  const theme    = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors   = Colors[theme];
  const router   = useRouter();
  const insets   = useSafeAreaInsets();

  const { data, loading, refreshing, error, refresh, toggleSave } = useOpportunities();

  const [selectedItem, setSelectedItem]   = useState<Opportunity | null>(null);
  const [sheetVisible, setSheetVisible]   = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const firstName = user?.full_name?.split(' ')[0] ?? 'Explorer';

  const handlePressCard = useCallback((id: string) => {
    haptic.light();
    router.push(`/opportunity/${id}`);
  }, [router]);

  const renderItem = useCallback(({ item, index }: { item: Opportunity; index: number }) => {
    const deadlineSoonItems = data.filter(d => d.is_deadline_soon);

    return (
      <AnimatedCard index={index}>
        {index === 0 && (
          <TrendingSection
            title="🔥 Top Trending"
            items={TRENDING_DATA}
            onPress={(it: Opportunity) => handlePressCard(it.id)}
          />
        )}
        {index === 1 && deadlineSoonItems.length > 0 && (
          <DeadlineAlertSection items={deadlineSoonItems.slice(0, 2)} />
        )}
        <OpportunityCard
          item={{ ...item, saved: item.is_saved, saveCount: item.save_count }}
          onBookmark={toggleSave}
          onApply={() => handlePressCard(item.id)}
          onShowReason={(i) => { setSelectedItem(item); setSheetVisible(true); }}
        />
      </AnimatedCard>
    );
  }, [data, handlePressCard, toggleSave]);

  const HEADER_HEIGHT = 80;

  return (
    <ThemedView style={styles.container}>
      {/* ── Glassmorphic Header (Fixed to Top) ── */}
      <BlurView
        intensity={theme === 'dark' ? 60 : 80}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={[styles.headerOverlay, { paddingTop: insets.top }]}
      >
        <View style={[styles.header, { height: HEADER_HEIGHT }]}>
          <View>
            <ThemedText type="label" style={styles.greeting}>{getTodayLabel()}</ThemedText>
            <ThemedText type="h1">
              {activeFilterCount > 0 ? 'Filtered' : `Hi, ${firstName}`}
            </ThemedText>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.backgroundElement }]}
              onPress={() => { haptic.light(); router.push('/search'); }}
              accessibilityRole="button"
            >
              <Ionicons name="search" size={20} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.backgroundElement }]}
              onPress={() => { haptic.light(); router.push('/notifications'); }}
              accessibilityRole="button"
            >
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              <View style={[styles.notifDot, { backgroundColor: colors.accent }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterBtn, { backgroundColor: colors.text }]}
              onPress={() => { haptic.medium(); setFilterVisible(true); }}
              accessibilityRole="button"
            >
              <Ionicons name="options-outline" size={16} color={colors.background} />
              <ThemedText style={[styles.filterText, { color: colors.background }]}>Filter</ThemedText>
              {activeFilterCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.text }]}>
                  <ThemedText style={styles.badgeText}>{activeFilterCount}</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* ── Content ── */}
      {loading ? (
        <View style={{ padding: Spacing.four, paddingTop: insets.top + HEADER_HEIGHT + Spacing.four }}>
          <SkeletonLoader />
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          estimatedItemSize={320}
          contentContainerStyle={[styles.listContent, { paddingTop: insets.top + HEADER_HEIGHT + Spacing.two }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              progressViewOffset={insets.top + HEADER_HEIGHT}
            />
          }
        />
      )}

      <RecommendationSheet
        item={selectedItem ? { ...selectedItem, saved: selectedItem.is_saved, saveCount: selectedItem.save_count } : null}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onShowLess={(id) => { setSheetVisible(false); }}
      />
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={() => {
          haptic.success();
          setFilterVisible(false);
          setActiveFilterCount(2);
        }}
      />
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  greeting: { marginBottom: 2 },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: Radius.full,
  },
  filterText: {
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 110,
  },
});
