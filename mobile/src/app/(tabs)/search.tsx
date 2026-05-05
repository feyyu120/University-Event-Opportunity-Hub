import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, useColorScheme } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/components/Themed';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Spacing, Colors, Radius, Typography } from '@/constants/theme';
import { nf, vs, ms } from '@/utils/responsive';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const [recentSearches, setRecentSearches] = useState<string[]>(['Figma', 'Google Internship', 'React Native']);
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const { data: results, loading, toggleSave } = useOpportunities({ 
    search: debouncedQuery.length > 2 ? debouncedQuery : undefined 
  });

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/opportunity/${item.id}`)}>
      <OpportunityCard 
        item={{ ...item, saved: item.is_saved, saveCount: item.save_count }} 
        onBookmark={toggleSave} 
        onApply={() => router.push(`/opportunity/${item.id}`)} 
        onShowReason={() => {}} 
      />
    </TouchableOpacity>
  ), [router, toggleSave]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Search</ThemedText>
          <View style={[styles.searchBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={nf(20)} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Search by title, role, or type..."
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={handleSearch}
              autoFocus
              allowFontScaling={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={nf(20)} color={colors.textSecondary} />
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
              <View style={{ flex: 1 }}>
                <FlashList
                  data={results}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.listContent}

                />
              </View>
            ) : (
              <View style={styles.center}>
                <Ionicons name="search" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
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
