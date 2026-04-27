import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from './Themed';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';

export type OpportunityType = 'Event' | 'Scholarship' | 'Internship' | 'Workshop' | 'Hackathon';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  deadline: string;
  description: string;
  matchScore?: number;
  saveCount?: number;
  saved?: boolean;
  reason?: string;
  image?: string;
}

interface OpportunityCardProps {
  item: Opportunity;
  onBookmark: (id: string) => void;
  onApply: (id: string) => void;
  onShowReason: (item: Opportunity) => void;
}

const TYPE_CONFIG: Record<OpportunityType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  Event: { icon: 'calendar', color: '#8B5CF6' },
  Scholarship: { icon: 'school', color: '#10B981' },
  Internship: { icon: 'briefcase', color: '#6366F1' },
  Workshop: { icon: 'construct', color: '#F59E0B' },
  Hackathon: { icon: 'rocket', color: '#EC4899' },
};

export function OpportunityCard({ item, onBookmark, onApply, onShowReason }: OpportunityCardProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const config = TYPE_CONFIG[item.type];

  return (
    <ThemedView style={[styles.card, Shadows.soft, { backgroundColor: colors.backgroundElement }]}>
      {/* Top Section with Image/Gradient */}
      <View style={styles.imageSection}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={[styles.imageFallback, { backgroundColor: config.color + '20' }]}>
            <Ionicons name={config.icon} size={40} color={config.color} />
          </View>
        )}
        <View style={styles.imageOverlay}>
          <View style={[styles.typeBadge, { backgroundColor: config.color }]}>
            <ThemedText style={styles.typeText}>{item.type}</ThemedText>
          </View>
          {item.matchScore && (
            <View style={[styles.matchBadge, { backgroundColor: colors.backgroundElement + 'E0' }]}>
              <ThemedText style={[styles.matchText, { color: colors.text }]}>{item.matchScore}% Match</ThemedText>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.bookmarkBtn} 
          onPress={() => onBookmark(item.id)}
        >
          <View style={styles.glassCircle}>
            <Ionicons name={item.saved ? 'heart' : 'heart-outline'} size={20} color={item.saved ? '#EF4444' : '#FFF'} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <ThemedText type="label" style={styles.org}>{item.organization}</ThemedText>
        <ThemedText type="subtitle" numberOfLines={2} style={styles.title}>{item.title}</ThemedText>
        
        <View style={styles.infoRow}>
          <View style={styles.deadlineBox}>
            <ThemedText style={styles.deadlineLabel}>DEADLINE</ThemedText>
            <ThemedText style={[styles.deadlineValue, item.deadline === 'Tomorrow' && { color: colors.accent }]}>
              {item.deadline}
            </ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={styles.statLabel}>INTEREST</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="flame" size={14} color="#F59E0B" />
              <ThemedText style={styles.statValue}>{item.saveCount || 0}</ThemedText>
            </View>
          </View>
        </View>

        {item.reason && (
          <TouchableOpacity onPress={() => onShowReason(item)} style={styles.reasonBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="sparkles" size={14} color="#6366f1" />
              <ThemedText style={styles.reasonText}>{item.reason}</ThemedText>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            onPress={() => onApply(item.id)}
          >
            <ThemedText style={styles.applyBtnText}>View Details</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  imageSection: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.small,
  },
  typeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  matchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.small,
  },
  matchText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  glassCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.four,
  },
  org: {
    marginBottom: 4,
  },
  title: {
    marginBottom: Spacing.three,
    height: 56, // fixed height for 2 lines
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  deadlineBox: {},
  deadlineLabel: {
    fontSize: 9,
    fontWeight: '800',
    opacity: 0.4,
    marginBottom: 2,
  },
  deadlineValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  statBox: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    opacity: 0.4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  reasonBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: 10,
    borderRadius: Radius.medium,
    marginBottom: Spacing.four,
  },
  reasonText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
  },
  applyBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
