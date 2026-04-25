import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView } from '@/components/Themed';
import { SkeletonLoader } from '@/components/Feedback';
import { OpportunityCard, Opportunity } from '@/components/OpportunityCard';
import { TrendingSection, DeadlineAlertSection } from '@/components/ContextualSections';
import { RecommendationSheet } from '@/components/RecommendationSheet';
import { FilterModal } from '@/components/FilterModal';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';
import { checkNotificationStatus, requestNotificationPermissions } from '@/utils/notificationHelper';
import { useInAppNotification } from '@/components/InAppNotification';

const INITIAL_DATA: Opportunity[] = [
  { 
    id: '1', 
    type: 'Internship', 
    title: 'Software Engineer Intern', 
    organization: 'Google', 
    deadline: 'Oct 30', 
    description: 'Working on core search algorithms.', 
    matchScore: 98, 
    saveCount: 1240, 
    reason: 'Recommended because you liked AI and Web Dev.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000'
  },
  { id: '2', type: 'Scholarship', title: 'Academic Excellence Grant', organization: 'University Foundation', deadline: 'Tomorrow', description: 'Merit-based scholarship for CS students.', saveCount: 450 },
  { 
    id: '3', 
    type: 'Event', 
    title: 'Tech Talk: Future of AI', 
    organization: 'ACM Student Chapter', 
    deadline: 'Oct 25', 
    description: 'Guest speaker from OpenAI.', 
    matchScore: 92, 
    saveCount: 89, 
    reason: 'Popular among 3rd year students.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'
  },
];

const TRENDING_DATA: Opportunity[] = [
  { id: 't1', type: 'Internship', title: 'Product Manager Intern', organization: 'Meta', deadline: 'Nov 1', description: 'Shape the future of social.', saveCount: 5600, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000' },
  { id: 't3', type: 'Event', title: 'Career Fair 2026', organization: 'Career Center', deadline: 'Oct 18', description: 'Meet 50+ employers.', saveCount: 3800, image: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=1000' },
];

export default function HomeFeedScreen() {
  const [data, setData] = useState<Opportunity[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Opportunity | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [hasNotifPermission, setHasNotifPermission] = useState(true);

  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { showNotification } = useInAppNotification();

  useEffect(() => {
    const init = async () => {
      const status = await checkNotificationStatus();
      setHasNotifPermission(status);
      setTimeout(() => setLoading(false), 1200);
    };
    init();
  }, []);

  const onRefresh = useCallback(() => {
    haptic.medium();
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleBookmark = (id: string) => {
    haptic.selection();
    setData(prev => prev.map(item => item.id === id ? { ...item, saved: !item.saved } : item));
  };

  const handlePressCard = (id: string) => {
    haptic.light();
    router.push(`/opportunity/${id}`);
  };

  const renderItem = ({ item, index }: { item: Opportunity, index: number }) => {
    if (index === 0) {
      return (
        <View>
          <TrendingSection 
            title="🔥 Top Trending" 
            items={TRENDING_DATA} 
            onPress={(item) => handlePressCard(item.id)} 
          />
          <OpportunityCard 
            item={item} 
            onBookmark={handleBookmark} 
            onApply={() => handlePressCard(item.id)} 
            onShowReason={(i) => { setSelectedItem(i); setSheetVisible(true); }}
          />
        </View>
      );
    }
    
    if (index === 1) {
      return (
        <View>
          <DeadlineAlertSection items={[INITIAL_DATA[1]]} />
          <OpportunityCard 
            item={item} 
            onBookmark={handleBookmark} 
            onApply={() => handlePressCard(item.id)} 
            onShowReason={(i) => { setSelectedItem(i); setSheetVisible(true); }}
          />
        </View>
      );
    }

    return (
      <OpportunityCard 
        item={item} 
        onBookmark={handleBookmark} 
        onApply={() => handlePressCard(item.id)} 
        onShowReason={(i) => { setSelectedItem(i); setSheetVisible(true); }}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <ThemedText type="label" style={styles.greeting}>MONDAY, OCT 20</ThemedText>
            <ThemedText type="h1">Curated</ThemedText>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: colors.backgroundElement }]} 
              onPress={() => { haptic.light(); router.push('/search'); }}
            >
              <ThemedText style={{ fontSize: 20 }}>🔍</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterBtn, { backgroundColor: colors.text }]} 
              onPress={() => { haptic.medium(); setFilterVisible(true); }}
            >
              <ThemedText style={[styles.filterText, { color: colors.background }]}>Filter</ThemedText>
              {activeFilterCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.text }]}>
                  <ThemedText style={styles.badgeText}>{activeFilterCount}</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={{ padding: Spacing.four }}>
            <SkeletonLoader />
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
        )}

        <RecommendationSheet 
          item={selectedItem} 
          visible={sheetVisible} 
          onClose={() => setSheetVisible(false)} 
          onShowLess={(id) => setData(prev => prev.filter(item => item.id !== id))}
        />
        <FilterModal 
          visible={filterVisible} 
          onClose={() => setFilterVisible(false)} 
          onApply={() => { haptic.success(); setFilterVisible(false); setActiveFilterCount(2); }} 
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  greeting: {
    marginBottom: -2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 4,
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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  filterText: {
    fontWeight: '800',
    fontSize: 14,
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
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 100,
  },
});
