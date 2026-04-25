import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView } from '@/components/Themed';
import { OpportunityCard, Opportunity } from '@/components/OpportunityCard';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';

const MOCK_RESULTS: Opportunity[] = [
  { id: '1', type: 'Internship', title: 'Software Engineer Intern', organization: 'Google', deadline: 'Oct 30', description: 'Working on core search algorithms.', matchScore: 98, saveCount: 1240, image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000' },
  { id: '5', type: 'Workshop', title: 'UI/UX Design Systems', organization: 'Design Club', deadline: 'Oct 28', description: 'Learn Figma and design principles.', matchScore: 85, saveCount: 156 },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Opportunity[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Figma', 'Google Internship', 'React Native']);
  const [loading, setLoading] = useState(false);
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (text.length > 2) {
      setLoading(true);
      searchTimeout.current = setTimeout(() => {
        // Mock search logic
        const filtered = MOCK_RESULTS.filter(item => 
          item.title.toLowerCase().includes(text.toLowerCase()) || 
          item.organization.toLowerCase().includes(text.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 300);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Search</ThemedText>
          <View style={[styles.searchBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <ThemedText style={{ fontSize: 18, marginRight: 8 }}>🔍</ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Search opportunities..."
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={handleSearch}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <ThemedText style={{ opacity: 0.5 }}>✕</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {query.length === 0 ? (
          <View style={styles.recentSection}>
            <ThemedText type="label" style={styles.sectionLabel}>RECENT SEARCHES</ThemedText>
            <View style={styles.chipsRow}>
              {recentSearches.map((s, i) => (
                <TouchableOpacity key={i} style={styles.chip} onPress={() => handleSearch(s)}>
                  <ThemedText style={styles.chipText}>{s}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            
            <ThemedText type="label" style={[styles.sectionLabel, { marginTop: Spacing.six }]}>POPULAR TOPICS</ThemedText>
            <View style={styles.topicList}>
              <TopicItem label="Winter Internships" count="1.2k+" />
              <TopicItem label="Remote Roles" count="800+" />
              <TopicItem label="Scholarships" count="300+" />
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <ThemedText style={styles.loadingText}>Searching for opportunities...</ThemedText>
              </View>
            ) : results.length > 0 ? (
              <FlatList
                data={results}
                renderItem={({ item }) => (
                  <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/opportunity/${item.id}`)}>
                    <OpportunityCard 
                      item={item} 
                      onBookmark={() => {}} 
                      onApply={() => {}} 
                      onShowReason={() => {}} 
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.center}>
                <ThemedText style={{ fontSize: 40, marginBottom: 16 }}>🔎</ThemedText>
                <ThemedText type="subtitle">No matches found</ThemedText>
                <ThemedText style={styles.noResultsSub}>Try adjusting your keywords or filters.</ThemedText>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function TopicItem({ label, count }: { label: string, count: string }) {
  return (
    <TouchableOpacity style={styles.topicItem}>
      <ThemedText style={styles.topicLabel}>{label}</ThemedText>
      <ThemedText style={styles.topicCount}>{count}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.four,
  },
  title: {
    marginBottom: Spacing.four,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    height: 56,
    borderRadius: Radius.large,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  recentSection: {
    padding: Spacing.four,
  },
  sectionLabel: {
    marginBottom: Spacing.three,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  topicList: {
    gap: Spacing.two,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  topicLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  topicCount: {
    fontSize: 13,
    opacity: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.6,
  },
  noResultsSub: {
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    padding: Spacing.four,
    paddingBottom: 100,
  },
});
