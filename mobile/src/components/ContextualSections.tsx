import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from './Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Opportunity } from './OpportunityCard';

interface SectionProps {
  title: string;
  items: Opportunity[];
  onPress: (item: Opportunity) => void;
}

const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'Event': return 'calendar';
    case 'Scholarship': return 'school';
    case 'Internship': return 'briefcase';
    default: return 'rocket';
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'Event': return '#8B5CF6';
    case 'Scholarship': return '#10B981';
    case 'Internship': return '#6366F1';
    default: return '#EC4899';
  }
};

export function TrendingSection({ title, items, onPress }: SectionProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Ionicons name="flame" size={20} color="#F59E0B" />
        <ThemedText type="subtitle" style={styles.sectionTitleText}>Top Trending</ThemedText>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {items.map(item => (
          <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
            <ThemedView variant="element" style={styles.trendingCard}>
              <Ionicons name={getTypeIcon(item.type)} size={24} color={getTypeColor(item.type)} />
              <ThemedText numberOfLines={2} style={styles.trendingTitle}>{item.title}</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <ThemedText style={styles.trendingStats}>{item.saveCount}</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function RecommendationSection({ title, subtext, items, onPress }: SectionProps & { subtext: string }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedText style={styles.sectionSubtext}>{subtext}</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {items.map(item => (
          <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
            <ThemedView variant="element" style={styles.recommendCard}>
              <View style={[styles.recommendIcon, { backgroundColor: colors.backgroundSelected }]}>
                <Ionicons 
                  name={item.type === 'Internship' ? 'briefcase-outline' : 'rocket-outline'} 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText numberOfLines={1} type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={styles.recommendOrg}>{item.organization}</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function DeadlineAlertSection({ items }: { items: Opportunity[] }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <ThemedView variant="selected" style={[styles.alertSection, { backgroundColor: colors.accent + '15' }]}>
      <View style={styles.alertHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="hourglass-outline" size={20} color={colors.accent} />
          <ThemedText type="subtitle">Ending Soon</ThemedText>
        </View>
        <ThemedText style={[styles.alertBadge, { backgroundColor: colors.accent, color: '#FFF' }]}>LAST CHANCE</ThemedText>
      </View>
      {items.map(item => (
        <View key={item.id} style={styles.alertItem}>
          <ThemedText numberOfLines={1} style={{ flex: 1 }}>{item.title}</ThemedText>
          <ThemedText style={[styles.countdown, { color: colors.accent }]}>23h 59m</ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: Spacing.four,
    marginHorizontal: -Spacing.four,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.one,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  sectionTitleText: {
  },
  sectionSubtext: {
    paddingHorizontal: Spacing.four,
    opacity: 0.6,
    fontSize: 12,
    marginBottom: Spacing.two,
  },
  horizontalScroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  trendingCard: {
    width: 160,
    padding: Spacing.three,
    borderRadius: 20,
    height: 140,
    justifyContent: 'space-between',
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendingStats: {
    fontSize: 11,
    opacity: 0.5,
  },
  recommendCard: {
    width: 240,
    padding: Spacing.three,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  recommendIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendOrg: {
    fontSize: 12,
    opacity: 0.6,
  },
  alertSection: {
    margin: Spacing.four,
    padding: Spacing.four,
    borderRadius: 24,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  alertBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  countdown: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: Spacing.two,
  },
});
