import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from './Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Opportunity } from './OpportunityCard';

interface SectionProps {
  title: string;
  items: Opportunity[];
  onPress: (item: Opportunity) => void;
}

export function TrendingSection({ title, items, onPress }: SectionProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {items.map(item => (
          <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
            <ThemedView variant="element" style={styles.trendingCard}>
              <ThemedText style={styles.trendingEmoji}>
                {item.type === 'Event' ? '🗓️' : item.type === 'Scholarship' ? '🎓' : '💼'}
              </ThemedText>
              <ThemedText numberOfLines={2} style={styles.trendingTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.trendingStats}>⭐ {item.saveCount}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function RecommendationSection({ title, subtext, items, onPress }: SectionProps & { subtext: string }) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedText style={styles.sectionSubtext}>{subtext}</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {items.map(item => (
          <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
            <ThemedView variant="element" style={styles.recommendCard}>
              <View style={[styles.recommendIcon, { backgroundColor: colors.backgroundSelected }]}>
                <ThemedText>{item.type === 'Internship' ? '💼' : '🚀'}</ThemedText>
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
        <ThemedText type="subtitle">⏳ Ending Soon</ThemedText>
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
  },
  sectionTitle: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.one,
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
  trendingEmoji: {
    fontSize: 24,
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
