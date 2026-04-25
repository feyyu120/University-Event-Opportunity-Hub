import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Modal, FlatList, useColorScheme, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Carousel, CarouselItem } from '@/components/Carousel';
import { Spacing, Colors, Radius, Shadows } from '@/constants/theme';

const VALUE_PROPS: CarouselItem[] = [
  {
    id: '1',
    title: 'Discover Events',
    description: 'Find networking events, workshops, and seminars happening at your university.',
    icon: '🎉',
  },
  {
    id: '2',
    title: 'Scholarships',
    description: 'Never miss a deadline. Get notified about scholarships that match your profile.',
    icon: '🎓',
  },
  {
    id: '3',
    title: 'Internships',
    description: 'Connect with industry leaders and land your dream internship or part-time job.',
    icon: '💼',
  },
];

const UNIVERSITIES = [
  'Harvard University',
  'Stanford University',
  'MIT',
  'University of Oxford',
  'University of Cambridge',
  'Other (Request Addition)',
];

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const [selectedUniversity, setSelectedUniversity] = useState(UNIVERSITIES[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="label" style={styles.topLabel}>WELCOME TO</ThemedText>
          <ThemedText type="title" style={styles.brand}>Steam</ThemedText>
          <ThemedText style={styles.tagline}>Unlock your university potential with curated opportunities.</ThemedText>
        </View>

        <Carousel items={VALUE_PROPS} />

        <View style={styles.form}>
          <ThemedText type="label" style={styles.label}>SELECT YOUR UNIVERSITY</ThemedText>
          <TouchableOpacity 
            style={[styles.dropdown, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]} 
            onPress={() => setIsModalVisible(true)}
          >
            <ThemedText style={styles.uniText}>{selectedUniversity}</ThemedText>
            <ThemedText style={{ opacity: 0.5 }}>▼</ThemedText>
          </TouchableOpacity>

          <View style={styles.buttonGroup}>
            <ThemedButton 
              title="Get Started" 
              onPress={() => router.push('/(auth)/verification')} 
            />
            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={styles.ghostText}>Login</ThemedText>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.ghostBtn} onPress={() => router.replace('/(tabs)')}>
                <ThemedText style={styles.ghostText}>Browse as Guest</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal visible={isModalVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <ThemedView variant="element" style={[styles.modalContent, Shadows.medium]}>
              <View style={styles.modalHeader}>
                <ThemedText type="subtitle">Select University</ThemedText>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeCircle}>
                  <ThemedText style={{ fontSize: 18 }}>✕</ThemedText>
                </TouchableOpacity>
              </View>
              <FlatList
                data={UNIVERSITIES}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.uniItem} 
                    onPress={() => {
                      setSelectedUniversity(item);
                      setIsModalVisible(false);
                    }}
                  >
                    <ThemedText style={styles.uniItemText}>{item}</ThemedText>
                    {item === selectedUniversity && <ThemedText style={{ color: colors.primary }}>✓</ThemedText>}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
              />
            </ThemedView>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    marginTop: Spacing.six,
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  topLabel: {
    letterSpacing: 2,
    marginBottom: 4,
  },
  brand: {
    fontSize: 64,
    color: '#6366F1', // Primary
    fontWeight: '900',
    letterSpacing: -2,
  },
  tagline: {
    opacity: 0.6,
    textAlign: 'center',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  form: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Spacing.six,
  },
  label: {
    marginBottom: Spacing.two,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.large,
    borderWidth: 1.5,
    marginBottom: Spacing.six,
  },
  uniText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGroup: {
    gap: Spacing.four,
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  ghostBtn: {
    paddingVertical: 8,
  },
  ghostText: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.7,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    padding: Spacing.six,
  },
  modalContent: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    maxHeight: '70%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 30 },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uniItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  uniItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
