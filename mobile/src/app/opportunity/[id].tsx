import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Share, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { QASection } from '@/components/QASection';
import { CampusMap } from '@/components/CampusMap';
import { getBuildingLocation } from '@/utils/locationHelper';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';
import { useColorScheme } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getOpportunityData = (id: string) => ({
  id,
  type: 'Internship' as const,
  title: 'Software Engineer Intern (Cloud Systems)',
  organization: 'Google',
  deadline: 'Oct 30, 2026',
  isDeadlineSoon: true,
  description: 'Join the Google Cloud team to build next-generation infrastructure. You will work on distributed systems, optimize storage performance, and collaborate with engineers globally.\n\n### Key Responsibilities:\n- Design and implement cloud primitives\n- Optimize resource allocation algorithms\n- Build scalable monitoring tools using Go and Python\n\n### Required Skills:\n- Strong foundation in data structures and algorithms\n- Experience with C++, Go, or Rust\n- Familiarity with Kubernetes is a plus',
  eligibility: 'Open to 3rd year and above, CGPA ≥ 3.5',
  location: 'Google Building 43, Mountain View, CA',
  mode: 'Hybrid',
  contact: 'internships@google.com',
  departments: ['Computer Science', 'Data Science', 'Mathematics'],
  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
});

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const data = getOpportunityData(id || '1');
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    haptic.selection();
    try {
      await Share.share({ message: `Check out this: ${data.title} at ${data.organization}` });
    } catch (error) { console.error(error); }
  };

  const handleSave = () => {
    haptic.success();
    setIsSaved(!isSaved);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Enterprise Blur Header */}
      <Animated.View style={[styles.navBar, { opacity: headerOpacity }]}>
        <ThemedView variant="blur" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.navContent}>
            <TouchableOpacity onPress={() => { haptic.light(); router.back(); }} style={styles.backBtn}>
              <ThemedText style={{ fontSize: 24 }}>←</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>{data.title}</ThemedText>
            <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
              <ThemedText style={{ fontSize: 20 }}>↗</ThemedText>
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
          <Image source={{ uri: data.image }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.imageOverlay} />
        </View>

        <View style={[styles.body, { backgroundColor: colors.background }]}>
          <View style={styles.titleSection}>
            <View style={styles.orgRow}>
              <ThemedText type="label">{data.organization}</ThemedText>
              <View style={[styles.verifiedBadge, { backgroundColor: colors.success + '15' }]}>
                <ThemedText style={[styles.verifiedText, { color: colors.success }]}>✓ Verified</ThemedText>
              </View>
            </View>
            <ThemedText type="title" style={styles.title}>{data.title}</ThemedText>
            
            <View style={styles.metaRow}>
              <View style={[styles.typeBadge, { backgroundColor: colors.primary + '15' }]}>
                <ThemedText style={[styles.typeText, { color: colors.primary }]}>{data.type}</ThemedText>
              </View>
              {data.isDeadlineSoon && (
                <View style={[styles.deadlineBadge, { backgroundColor: colors.accent + '15' }]}>
                  <ThemedText style={[styles.deadlineText, { color: colors.accent }]}>Ends Soon</ThemedText>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.actionRow, Shadows.medium, { backgroundColor: colors.backgroundElement }]}>
            <ActionItem icon={isSaved ? "❤️" : "🤍"} label={isSaved ? "Saved" : "Save"} onPress={handleSave} />
            <ActionItem icon="🗓️" label="Add" onPress={() => haptic.light()} />
            <ActionItem icon="📢" label="Share" onPress={handleShare} />
            <ActionItem icon="🚩" label="Report" onPress={() => haptic.warning()} />
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.description}>{data.description}</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Eligibility</ThemedText>
            <ThemedView variant="element" style={styles.eligibilityCard}>
              <ThemedText type="defaultSemiBold" style={{ color: colors.primary }}>{data.eligibility}</ThemedText>
            </ThemedView>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Details</ThemedText>
            <View style={styles.infoGrid}>
              <InfoItem icon="📍" label="Location" value={data.location} />
              <InfoItem icon="🏢" label="Work Mode" value={data.mode} />
              <InfoItem icon="📧" label="Inquiries" value={data.contact} />
            </View>

            {getBuildingLocation(data.location) && (
              <CampusMap 
                locations={[getBuildingLocation(data.location)!]} 
                fullLocationName={data.location} 
              />
            )}
          </View>

          <QASection />
        </View>
        <View style={{ height: 140 }} />
      </Animated.ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.footerContent}>
            <ThemedButton 
              title={applied ? "Application Tracked" : "Apply Now"} 
              onPress={() => { haptic.success(); setApplied(true); }} 
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
          <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>←</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

function ActionItem({ icon, label, onPress }: { icon: string, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionItem}>
      <ThemedText style={{ fontSize: 20, marginBottom: 4 }}>{icon}</ThemedText>
      <ThemedText type="caption">{label}</ThemedText>
    </TouchableOpacity>
  );
}

function InfoItem({ icon, label, value }: { icon: string, label: string, value: string }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIconBox}>
        <ThemedText style={{ fontSize: 20 }}>{icon}</ThemedText>
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
    backgroundColor: 'rgba(0,0,0,0.04)',
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
