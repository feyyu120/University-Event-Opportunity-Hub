import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from './Themed';
import { Spacing, Colors, Radius, Shadows, Typography } from '@/constants/theme';
import { nf, vs, ms } from '@/utils/responsive';

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
  Event:      { icon: 'calendar',  color: '#8B5CF6' },
  Scholarship:{ icon: 'school',    color: '#10B981' },
  Internship: { icon: 'briefcase', color: '#6366F1' },
  Workshop:   { icon: 'construct', color: '#F59E0B' },
  Hackathon:  { icon: 'rocket',    color: '#EC4899' },
};

export const OpportunityCard = memo(function OpportunityCard({ item, onBookmark, onApply, onShowReason }: OpportunityCardProps) {
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const config = TYPE_CONFIG[item.type];

  return (
    <ThemedView style={[styles.card, Shadows.soft, { backgroundColor: colors.backgroundElement }]}>
      <View style={styles.imageSection}>
        {item.image ? (
          <Image 
            source={item.image} 
            style={styles.image} 
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.imageFallback, { backgroundColor: config.color + '20' }]}>
            <Ionicons name={config.icon} size={nf(40)} color={config.color} />
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
        <TouchableOpacity style={styles.bookmarkBtn} onPress={() => onBookmark(item.id)}>
          <View style={styles.glassCircle}>
            <Ionicons name={item.saved ? 'heart' : 'heart-outline'} size={nf(20)} color={item.saved ? '#EF4444' : '#FFF'} />
          </View>
        </TouchableOpacity>
      </View>

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
              <Ionicons name="flame" size={nf(14)} color="#F59E0B" />
              <ThemedText style={styles.statValue}>{item.saveCount || 0}</ThemedText>
            </View>
          </View>
        </View>

        {item.reason && (
          <TouchableOpacity onPress={() => onShowReason(item)} style={styles.reasonBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="sparkles" size={nf(14)} color="#6366f1" />
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
});

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  imageSection: {
    height: vs(160),
    width: '100%',
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: ms(12),
    left: ms(12),
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: Radius.small,
  },
  typeText: {
    color: '#FFF',
    fontSize: nf(10),
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  matchBadge: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: Radius.small,
  },
  matchText: {
    fontSize: nf(11),
    fontWeight: '700',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: ms(12),
    right: ms(12),
  },
  glassCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { padding: Spacing.four },
  org: { marginBottom: 4 },
  title: {
    marginBottom: Spacing.three,
    minHeight: vs(52),
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
    fontSize: nf(9),
    fontWeight: '800',
    opacity: 0.4,
    marginBottom: 2,
  },
  deadlineValue: {
    fontSize: Typography.small,
    fontWeight: '700',
  },
  statBox: { alignItems: 'flex-end' },
  statLabel: {
    fontSize: nf(9),
    fontWeight: '800',
    opacity: 0.4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: Typography.small,
    fontWeight: '700',
  },
  reasonBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: ms(10),
    borderRadius: Radius.medium,
    marginBottom: Spacing.four,
  },
  reasonText: {
    fontSize: Typography.caption,
    color: '#6366f1',
    fontWeight: '600',
    flex: 1,
  },
  footer: { flexDirection: 'row' },
  applyBtn: {
    flex: 1,
    height: vs(48),
    borderRadius: Radius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: Typography.body,
    fontWeight: '700',
  },
});
