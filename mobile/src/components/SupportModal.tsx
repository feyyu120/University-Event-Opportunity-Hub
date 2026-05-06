import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView, useColorScheme, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from './Themed';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { ms, vs, nf } from '@/utils/responsive';
import { haptic } from '@/utils/hapticHelper';

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SupportModal({ visible, onClose }: SupportModalProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const [showStory, setShowStory] = useState(false);

  const handleTelegram = () => {
    haptic.light();
    Linking.openURL('https://t.me/campusevent');
  };

  const handleEmail = () => {
    haptic.light();
    Linking.openURL('mailto:feyselfeyyu@gmail.com');
  };

  const toggleStory = () => {
    haptic.light();
    setShowStory(!showStory);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <ThemedText style={{ color: colors.primary, fontSize: nf(16) }}>Close</ThemedText>
          </TouchableOpacity>
          <ThemedText type="defaultSemiBold" style={{ fontSize: nf(16) }}>Support & About</ThemedText>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          <View style={styles.heroSection}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="chatbubbles" size={nf(40)} color={colors.primary} />
            </View>
            <ThemedText type="h1" style={styles.title}>How can we help?</ThemedText>
            <ThemedText style={styles.subtitle}>
              Reach out to our team or learn more about our mission.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="label" style={styles.sectionLabel}>CONTACT US</ThemedText>
            <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <TouchableOpacity style={[styles.actionRow, { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]} onPress={handleTelegram}>
                <View style={[styles.iconBox, { backgroundColor: '#0088cc20' }]}>
                  <Ionicons name="paper-plane" size={20} color="#0088cc" />
                </View>
                <View style={styles.actionTextGroup}>
                  <ThemedText style={styles.actionTitle}>Telegram</ThemedText>
                  <ThemedText style={styles.actionSubtitle}>@campusevent</ThemedText>
                </View>
                <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionRow} onPress={handleEmail}>
                <View style={[styles.iconBox, { backgroundColor: '#EA433520' }]}>
                  <Ionicons name="mail" size={20} color="#EA4335" />
                </View>
                <View style={styles.actionTextGroup}>
                  <ThemedText style={styles.actionTitle}>Email</ThemedText>
                  <ThemedText style={styles.actionSubtitle}>feyselfeyyu@gmail.com</ThemedText>
                </View>
                <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="label" style={styles.sectionLabel}>ABOUT CampusEvent</ThemedText>
            <TouchableOpacity
              style={[styles.storyToggle, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}
              onPress={toggleStory}
              activeOpacity={0.8}
            >
              <View style={styles.storyHeader}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="information-circle" size={24} color={colors.primary} />
                </View>
                <ThemedText type="defaultSemiBold" style={{ flex: 1, fontSize: nf(16) }}>Our Story</ThemedText>
                <Ionicons name={showStory ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
              </View>

              {showStory && (
                <View style={styles.storyContent}>
                  <ThemedText style={styles.storyText}>
                    UniHub was born from a simple idea: university students should have equal access to opportunities, no matter where they are.
                  </ThemedText>
                  <ThemedText style={styles.storyText}>
                    We realized that countless scholarships, internships, and events were slipping through the cracks simply because information was fragmented.
                  </ThemedText>
                  <ThemedText style={styles.storyText}>
                    Our dedicated team is building the bridge between ambition and reality, curating the best resources to empower students across the country. Let's grow together!
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.version}>App Version 1.0.0</ThemedText>
            <ThemedText style={styles.copyright}>© 2026 CampusEvent. All rights reserved.</ThemedText>
          </View>

        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    padding: 8,
    minWidth: 60,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.eight,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: Spacing.six,
  },
  iconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: nf(28),
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.body,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
    lineHeight: 22,
  },
  section: {
    marginTop: Spacing.six,
  },
  sectionLabel: {
    marginBottom: Spacing.three,
    marginLeft: Spacing.one,
  },
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  actionTextGroup: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.body,
    fontWeight: '600',
  },
  actionSubtitle: {
    fontSize: Typography.small,
    opacity: 0.6,
    marginTop: 2,
  },
  storyToggle: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyContent: {
    marginTop: Spacing.four,
    paddingTop: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
  },
  storyText: {
    fontSize: nf(15),
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: Spacing.three,
  },
  footer: {
    marginTop: Spacing.eight,
    alignItems: 'center',
  },
  version: {
    fontSize: Typography.small,
    fontWeight: '600',
    opacity: 0.5,
  },
  copyright: {
    fontSize: Typography.small,
    opacity: 0.4,
    marginTop: 4,
  },
});
