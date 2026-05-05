import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Share, Dimensions, ActivityIndicator, Alert, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { InteractionSection } from '@/components/InteractionSection';
import { CampusMap } from '@/components/CampusMap';
import { getBuildingLocation } from '@/utils/locationHelper';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';
import { opportunitiesApi, type Opportunity, type Comment } from '@/api/opportunities';
import { useAuth } from '@/context/AuthContext';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  
  const [data, setData] = useState<Opportunity | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [applied, setApplied] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  // Check if current item is a mock/fallback (not in the database)
  const isMockItem = useCallback((itemId: string) => {
    return itemId.startsWith('t') || !itemId.includes('-');
  }, []);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await opportunitiesApi.detail(id, user?.id?.toString());
      if (res.success) {
        // Map organization_name to organization if needed
        const mappedData = {
          ...res.data,
          organization: res.data.organization || res.data.organization_name || 'UniHub Partner'
        };
        setData(mappedData);
        setComments(res.comments || []);
        setIsLiked(res.data.is_liked || false);
        setLikeCount(res.data.like_count || 0);
        setApplied(res.data.is_applied || false);
      }
    } catch (err) {
      console.error('Failed to fetch detail:', err);
      // Temporarily show mock fallback for ALL failed API calls (including real items)
      // This allows the app to work seamlessly even while the Render backend is missing the endpoint
      setData({
        id,
        type: 'Internship',
        title: id.startsWith('t') ? 'Featured Trending Opportunity' : 'Sample Opportunity (Backend Offline)',
        organization: 'UniHub Partner',
        deadline: 'Oct 30, 2026',
        description: 'This is sample data because the real details could not be loaded from the server.\n\n### Requirements:\n- Current student at an Ethiopian University\n- Passion for innovation\n- Willingness to learn',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000',
      } as Opportunity);
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    if (!data) return;
    haptic.selection();
    try {
      await Share.share({ message: `Check out this: ${data.title} at ${data.organization || data.organization_name}` });
    } catch (error) { console.error(error); }
  };

  const handleLike = async () => {
    if (!data || !user) return;
    haptic.success();

    // Mock items: local-only toggle
    if (isMockItem(data.id)) {
      setIsLiked(prev => !prev);
      setLikeCount(prev => !isLiked ? prev + 1 : Math.max(0, prev - 1));
      return;
    }
    
    // Optimistic UI update
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      const res = await opportunitiesApi.like(data.id, user.id.toString());
      // Sync with server response if needed
      setIsLiked(res.liked);
      setLikeCount(res.like_count);
    } catch (err) {
      // Revert on error
      setIsLiked(!newLiked);
      setLikeCount(prev => !newLiked ? prev + 1 : prev - 1);
    }
  };

  const handleReport = () => {
    if (!data || !user) return;
    haptic.warning();

    // Mock items can't be reported
    if (isMockItem(data.id)) {
      Alert.alert("Demo Mode", "Reporting is not available for sample opportunities.");
      return;
    }
    
    Alert.prompt(
      "Report Opportunity",
      "Why are you reporting this? (Scam, inappropriate, expired, etc.)",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Submit", 
          onPress: async (reason: string | undefined) => {
            if (!reason || reason.length < 5) {
              Alert.alert("Error", "Please provide a valid reason.");
              return;
            }
            try {
              const res = await opportunitiesApi.report(data.id, user.id.toString(), reason);
              if (res.success) {
                Alert.alert("Success", res.message);
              }
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to submit report.");
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!data) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Failed to load opportunity details.</ThemedText>
        <ThemedButton title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.navBar, { opacity: headerOpacity }]}>
        <ThemedView variant="blur" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.navContent}>
            <TouchableOpacity onPress={() => { haptic.light(); router.back(); }} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemedText type="subtitle" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>{data.title}</ThemedText>
            <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
              <Ionicons name="share-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Image 
            source={data.image ? { uri: data.image } : { uri: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000' }} 
            style={styles.heroImage} 
            contentFit="cover" 
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={[styles.body, { backgroundColor: colors.background }]}>
          <View style={styles.titleSection}>
            <View style={styles.orgRow}>
              <ThemedText type="label">{data.organization || data.organization_name}</ThemedText>
              <View style={[styles.verifiedBadge, { backgroundColor: colors.success + '15' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                  <ThemedText style={[styles.verifiedText, { color: colors.success }]}>Verified</ThemedText>
                </View>
              </View>
            </View>
            <ThemedText type="title" style={styles.title}>{data.title}</ThemedText>
            
            <View style={styles.metaRow}>
              <View style={[styles.typeBadge, { backgroundColor: colors.primary + '15' }]}>
                <ThemedText style={[styles.typeText, { color: colors.primary }]}>{data.type}</ThemedText>
              </View>
              {data.is_deadline_soon && (
                <View style={[styles.deadlineBadge, { backgroundColor: colors.accent + '15' }]}>
                  <ThemedText style={[styles.deadlineText, { color: colors.accent }]}>Ends Soon</ThemedText>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.actionRow, Shadows.medium, { backgroundColor: colors.backgroundElement }]}>
            <ActionItem 
              icon={isLiked ? "heart" : "heart-outline"} 
              iconColor={isLiked ? "#EF4444" : colors.text}
              label={likeCount > 0 ? `${likeCount}` : "Like"} 
              onPress={handleLike} 
            />
            <ActionItem icon="chatbubble-outline" label="Comment" onPress={() => haptic.light()} />
            <ActionItem icon="share-social-outline" label="Share" onPress={handleShare} />
            <ActionItem icon="flag-outline" label="Report" onPress={handleReport} />
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.description}>{data.description}</ThemedText>
          </View>

          {data.eligibility && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Eligibility</ThemedText>
              <ThemedView variant="element" style={styles.eligibilityCard}>
                <ThemedText type="defaultSemiBold" style={{ color: colors.primary }}>{data.eligibility}</ThemedText>
              </ThemedView>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Details</ThemedText>
            <View style={styles.infoGrid}>
              {data.location && <InfoItem icon="location-outline" label="Location" value={data.location} />}
              {data.mode && <InfoItem icon="business-outline" label="Work Mode" value={data.mode} />}
              {data.contact && <InfoItem icon="mail-outline" label="Inquiries" value={data.contact} />}
            </View>

            {data.location && getBuildingLocation(data.location) && (
              <CampusMap 
                locations={[getBuildingLocation(data.location)!]} 
                fullLocationName={data.location} 
              />
            )}
          </View>

          <InteractionSection 
            opportunityId={data.id} 
            comments={comments} 
            onCommentAdded={(newC) => setComments(prev => [...prev, newC])} 
          />
        </View>
        <View style={{ height: 140 }} />
      </Animated.ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.footerContent}>
            <ThemedButton 
              title={applied ? "Application Tracked" : "Apply Now"} 
              onPress={async () => { 
                if (!user || applied) return;
                haptic.success();
                // Mock items: local-only toggle
                if (isMockItem(data.id)) {
                  setApplied(true);
                  return;
                }
                try {
                  await opportunitiesApi.apply(data.id, user.id.toString());
                  setApplied(true);
                } catch (err) {
                  Alert.alert("Error", "Failed to track application.");
                }
              }} 
              variant={applied ? "secondary" : "primary"}
              style={{ flex: 1 }}
            />
          </View>
        </SafeAreaView>
      </View>

      {/* Floating Back Button (Blur variant) */}
      <Animated.View style={[styles.floatingBack, { opacity: Animated.subtract(1, headerOpacity) }]}>
        <TouchableOpacity onPress={() => { haptic.light(); router.back(); }} style={styles.circleBtn}>
          <ThemedView variant="blur" style={StyleSheet.absoluteFill} />
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

function ActionItem({ icon, iconColor, label, onPress }: { icon: keyof typeof Ionicons.glyphMap, iconColor?: string, label: string, onPress: () => void }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionItem}>
      <Ionicons name={icon} size={22} color={iconColor || colors.text} style={{ marginBottom: 4 }} />
      <ThemedText type="caption">{label}</ThemedText>
    </TouchableOpacity>
  );
}

function InfoItem({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string }) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  return (
    <View style={styles.infoItem}>
      <View style={[styles.infoIconBox, { backgroundColor: colors.primary + '10' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="label" style={{ marginBottom: 2 }}>{label}</ThemedText>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  navContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  backBtn: { width: 44 },
  shareBtn: { width: 44, alignItems: 'flex-end' },
  heroContainer: {
    height: SCREEN_WIDTH * 0.8,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  body: {
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  titleSection: {
    marginBottom: Spacing.six,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: Spacing.three,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.medium,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  deadlineBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.medium,
  },
  deadlineText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.four,
    borderRadius: Radius.large,
    marginBottom: Spacing.six,
  },
  actionItem: {
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    marginBottom: Spacing.three,
  },
  description: {
    opacity: 0.8,
    lineHeight: 26,
  },
  eligibilityCard: {
    padding: Spacing.four,
    borderRadius: Radius.large,
    borderWidth: 1,
  },
  infoGrid: {
    gap: Spacing.four,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerContent: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  floatingBack: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    overflow: 'hidden',
    borderRadius: 24,
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
