import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Spacing, Colors, Radius, Typography } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';
import { nf, vs, ms } from '@/utils/responsive';
import { useAuth } from '@/context/AuthContext';
import { useOpportunities } from '@/hooks/useOpportunities';

export default function SavedScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const { data: items, loading, toggleSave } = useOpportunities({ is_saved: true });

  const [sortBy, setSortBy] = useState<'Deadline' | 'Newest'>('Deadline');
  
  const HEADER_HEIGHT = vs(100);

  if (!isAuthenticated || !user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.unauthContainer}>
          <View style={styles.unauthIconContainer}>
            <Ionicons name="bookmark" size={nf(80)} color={colors.primary} />
          </View>
          <ThemedText type="h1" style={styles.unauthTitle}>Saved</ThemedText>
          <ThemedText style={styles.unauthSubtitle}>
            Sign in to bookmark opportunities and access them later from any device.
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

  const handleDelete = (id: string) => {
    haptic.selection();
    toggleSave(id);
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/opportunity/${item.id}`)}>
      <OpportunityCard 
        item={{ ...item, saved: item.is_saved, saveCount: item.save_count }} 
        onBookmark={handleDelete} 
        onApply={() => router.push(`/opportunity/${item.id}`)} 
        onShowReason={() => {}} 
      />
    </TouchableOpacity>
  ), [router, handleDelete]);

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
            <ThemedText type="title">Saved</ThemedText>
            <ThemedText type="small">{items.length} items collected</ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.exportBtn, { backgroundColor: colors.primary + '15' }]}
            onPress={() => haptic.light()}
          >
            <ThemedText style={[styles.exportText, { color: colors.primary }]}>Export CSV</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.filterBar}>
          <FilterTab label="Deadline" active={sortBy === 'Deadline'} onPress={() => { haptic.light(); setSortBy('Deadline'); }} />
          <FilterTab label="Recently Saved" active={sortBy === 'Newest'} onPress={() => { haptic.light(); setSortBy('Newest'); }} />
        </View>
      </BlurView>

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : items.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlashList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={[styles.listContent, { paddingTop: insets.top + HEADER_HEIGHT + 60 }]}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={220}
          />
        </View>
      ) : (
        <View style={[styles.emptyState, { paddingTop: insets.top + HEADER_HEIGHT }]}>
          <Ionicons name="bookmark-outline" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
          <ThemedText type="subtitle">No saved items</ThemedText>
          <ThemedText style={styles.emptySub}>Your bookmarked opportunities will appear here.</ThemedText>
          <TouchableOpacity 
            style={[styles.browseBtn, { backgroundColor: colors.text }]} 
            onPress={() => { haptic.medium(); router.push('/(tabs)'); }}
          >
            <ThemedText style={[styles.browseText, { color: colors.background }]}>Browse Opportunities</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

function FilterTab({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
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
  exportBtn: {
    paddingHorizontal: ms(16),
    paddingVertical: vs(8),
    borderRadius: Radius.medium,
  },
  exportText: {
    fontSize: Typography.small,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: ms(8),
    paddingBottom: Spacing.three,
  },
  filterTab: {
    paddingHorizontal: ms(16),
    paddingVertical: vs(8),
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  filterTabText: {
    fontSize: Typography.small,
    fontWeight: '500',
    opacity: 0.6,
  },
  listContent: {
    padding: Spacing.four,
    paddingBottom: vs(100),
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
  browseBtn: {
    marginTop: vs(24),
    paddingHorizontal: ms(24),
    paddingVertical: vs(14),
    borderRadius: Radius.medium,
  },
  browseText: {
    color: '#FFF',
    fontWeight: '700',
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
