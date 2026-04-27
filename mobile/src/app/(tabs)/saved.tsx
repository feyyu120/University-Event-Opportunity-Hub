import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/components/Themed';
import { OpportunityCard, Opportunity } from '@/components/OpportunityCard';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';

const MOCK_SAVED: Opportunity[] = [
  { 
    id: '1', 
    type: 'Internship', 
    title: 'Software Engineer Intern', 
    organization: 'Google', 
    deadline: 'Oct 30', 
    description: 'Working on core search algorithms.', 
    matchScore: 98, 
    saveCount: 1240, 
    saved: true,
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000'
  },
  { id: '2', type: 'Scholarship', title: 'Academic Excellence Grant', organization: 'University Foundation', deadline: 'Tomorrow', description: 'Merit-based scholarship for CS students.', saveCount: 450, saved: true },
];

export default function SavedScreen() {
  const [items, setItems] = useState<Opportunity[]>(MOCK_SAVED);
  const [sortBy, setSortBy] = useState<'Deadline' | 'Newest'>('Deadline');
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <ThemedText type="title">Saved</ThemedText>
            <ThemedText type="small">{items.length} items collected</ThemedText>
          </View>
          <TouchableOpacity style={[styles.exportBtn, { backgroundColor: colors.primary + '10' }]}>
            <ThemedText style={[styles.exportText, { color: colors.primary }]}>Export CSV</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.filterBar}>
          <FilterTab label="Deadline" active={sortBy === 'Deadline'} onPress={() => setSortBy('Deadline')} />
          <FilterTab label="Recently Saved" active={sortBy === 'Newest'} onPress={() => setSortBy('Newest')} />
        </View>

        {items.length > 0 ? (
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/opportunity/${item.id}`)}>
                <OpportunityCard 
                  item={item} 
                  onBookmark={handleDelete} 
                  onApply={() => router.push(`/opportunity/${item.id}`)} 
                  onShowReason={() => {}} 
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
            <ThemedText type="subtitle">No saved items</ThemedText>
            <ThemedText style={styles.emptySub}>Your bookmarked opportunities will appear here.</ThemedText>
            <TouchableOpacity style={[styles.browseBtn, { backgroundColor: colors.text }]} onPress={() => router.push('/(tabs)')}>
              <ThemedText style={[styles.browseText, { color: colors.background }]}>Browse Opportunities</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function FilterTab({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.filterTab, active && { backgroundColor: colors.backgroundSelected }]}
    >
      <ThemedText style={[styles.filterTabText, active && { color: colors.primary, fontWeight: '700' }]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
  },
  exportBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.medium,
  },
  exportText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: 8,
    marginBottom: Spacing.four,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.6,
  },
  listContent: {
    padding: Spacing.four,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptySub: {
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 250,
  },
  browseBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.medium,
  },
  browseText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
