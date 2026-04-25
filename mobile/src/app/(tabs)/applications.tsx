import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ThemedText, ThemedView } from '@/components/Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface AppRecord {
  id: string;
  title: string;
  status: 'Applied' | 'Accepted' | 'Rejected' | 'Interviewing';
  date: string;
  org: string;
}

const MOCK_APPS: AppRecord[] = [
  { id: '1', title: 'Summer Intern', org: 'Google', status: 'Interviewing', date: 'Oct 12' },
  { id: '2', title: 'Research Assistant', org: 'Physics Dept', status: 'Applied', date: 'Oct 10' },
  { id: '3', title: 'Tech Talk RSVP', org: 'ACM', status: 'Accepted', date: 'Oct 05' },
];

export default function ApplicationsScreen() {
  const [view, setView] = useState<'List' | 'Calendar'>('List');
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return '#10b981';
      case 'Rejected': return '#ef4444';
      case 'Interviewing': return '#6366f1';
      default: return '#64748b';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText type="title">My Applications</ThemedText>
          <View style={[styles.toggleContainer, { backgroundColor: colors.backgroundElement }]}>
            {['List', 'Calendar'].map(v => (
              <TouchableOpacity 
                key={v} 
                style={[styles.toggleBtn, view === v && { backgroundColor: colors.background }]}
                onPress={() => setView(v as any)}
              >
                <ThemedText style={view === v && { fontWeight: '700' }}>{v}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {view === 'List' ? (
          <FlatList
            data={MOCK_APPS}
            renderItem={({ item }) => (
              <ThemedView variant="element" style={styles.appCard}>
                <View style={styles.cardInfo}>
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                  <ThemedText style={styles.orgText}>{item.org}</ThemedText>
                  <ThemedText style={styles.dateText}>Applied on {item.date}</ThemedText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                  <ThemedText style={{ color: getStatusColor(item.status), fontSize: 12, fontWeight: '700' }}>
                    {item.status.toUpperCase()}
                  </ThemedText>
                </View>
              </ThemedView>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.calendarContainer}>
            <ThemedText type="subtitle" style={styles.monthTitle}>October 2026</ThemedText>
            <View style={styles.grid}>
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const hasApp = [5, 10, 12].includes(day);
                return (
                  <View key={i} style={[styles.dayCell, hasApp && { backgroundColor: colors.primary }]}>
                    <ThemedText style={hasApp && { color: '#FFF' }}>{day}</ThemedText>
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
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  list: {
    padding: Spacing.four,
  },
  appCard: {
    flexDirection: 'row',
    padding: Spacing.four,
    borderRadius: 20,
    marginBottom: Spacing.three,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  orgText: {
    fontSize: 14,
    opacity: 0.6,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calendarContainer: {
    padding: Spacing.four,
  },
  monthTitle: {
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  dayCell: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
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
    fontSize: 12,
    opacity: 0.6,
  },
});
