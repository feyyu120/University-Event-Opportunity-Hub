import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Modal, FlatList, useColorScheme, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Carousel, CarouselItem } from '@/components/Carousel';
import { Spacing, Colors, Radius, Shadows, Typography } from '@/constants/theme';
import { nf, vs, ms } from '@/utils/responsive';

const VALUE_PROPS: CarouselItem[] = [
  {
    id: '1',
    title: 'Discover Events',
    description: 'Find networking events, workshops, and seminars happening at your university.',
    icon: 'sparkles',
    iconColor: '#8B5CF6',
  },
  {
    id: '2',
    title: 'Scholarships',
    description: 'Never miss a deadline. Get notified about scholarships that match your profile.',
    icon: 'school',
    iconColor: '#10B981',
  },
  {
    id: '3',
    title: 'Internships',
    description: 'Connect with industry leaders and land your dream internship or part-time job.',
    icon: 'briefcase',
    iconColor: '#6366F1',
  },
];

const UNIVERSITIES = [
  'Adama Science and Technology University',
  'Addis Ababa Science and Technology University',
  'Addis Ababa University',
  'Adigrat University',
  'Aksum University',
  'Ambo University',
  'Arba Minch University',
  'Arsi University',
  'Assosa University',
  'Bahir Dar University',
  'Bonga University',
  'Borena University',
  'Bule Hora University',
  'Debark University',
  'Debre Berhan University',
  'Debre Markos University',
  'Debre Tabor University',
  'Dembi Dolo University',
  'Dilla University',
  'Dire Dawa University',
  'Ethiopian Civil Service University',
  'Ethiopian Police University',
  'Gambella University',
  'Haramaya University',
  'Hawassa University',
  'Injibara University',
  'Jijiga University',
  'Jimma University',
  'Jinka University',
  'Kebri Dehar University',
  'Kotebe Education University',
  'Madda Walabu University',
  'Mekdela Amba University',
  'Mekelle University',
  'Mettu University',
  'Mizan-Tepi University',
  'Oromia State University',
  'Raya University',
  'Samara University',
  'Selale University',
  'University of Gondar',
  'Wachemo University',
  'Werabe University',
  'Woldia University',
  'Wolaita Sodo University',
  'Wollega University',
  'Wolkite University',
  'Wollo University',
];

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const [selectedUniversity, setSelectedUniversity] = useState(UNIVERSITIES[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUniversities = UNIVERSITIES.filter(uni =>
    uni.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="label" style={styles.topLabel}>WELCOME TO</ThemedText>
            <ThemedText style={styles.brand}>CampusEvent</ThemedText>
          </View>

          <Carousel items={VALUE_PROPS} />

          <View style={styles.footer}>
            <View style={styles.dropdownContainer}>
              <ThemedText type="label" style={styles.label}>YOUR UNIVERSITY</ThemedText>
              <TouchableOpacity
                style={[styles.dropdown, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
                onPress={() => setIsModalVisible(true)}
              >
                <View style={styles.dropdownContent}>
                  <Ionicons name="school-outline" size={20} color={colors.primary} style={styles.dropdownIcon} />
                  <ThemedText style={styles.uniText} numberOfLines={1}>{selectedUniversity}</ThemedText>
                </View>
                <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonGroup}>
              <ThemedButton
                title="Get Started"
                onPress={() => router.push('/(auth)/register')}
              />
              <View style={styles.rowActions}>
                <TouchableOpacity style={styles.ghostBtn} onPress={() => router.push('/(auth)/login')}>
                  <ThemedText style={styles.ghostText}>Sign In</ThemedText>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.ghostBtn} onPress={() => router.replace('/(tabs)')}>
                  <ThemedText style={styles.ghostText}>Explore as Guest</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <ThemedView variant="element" style={[styles.modalContent, Shadows.premium]}>
              <View style={styles.modalHeader}>
                <View>
                  <ThemedText type="subtitle">Select University</ThemedText>
                  <ThemedText type="caption">Choose your current institution</ThemedText>
                </View>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeCircle}>
                  <Ionicons name="close" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search universities..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <FlatList
                data={filteredUniversities}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.uniItem,
                      item === selectedUniversity && { backgroundColor: colors.primary + '10', borderRadius: 12 }
                    ]}
                    onPress={() => {
                      setSelectedUniversity(item);
                      setIsModalVisible(false);
                      setSearchQuery('');
                    }}
                  >
                    <ThemedText style={[
                      styles.uniItemText,
                      item === selectedUniversity && { color: colors.primary, fontWeight: '700' }
                    ]}>{item}</ThemedText>
                    {item === selectedUniversity && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    marginTop: Spacing.four,
    alignItems: 'center',
    marginBottom: Spacing.one,
  },

  topLabel: {
    letterSpacing: 3,
    marginBottom: 4,
    marginTop: vs(40),
    opacity: 0.6,
    fontSize: nf(13),
  },
  brand: {
    fontSize: nf(52),
    color: '#6366F1',
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: nf(58),
  },

  footer: {
    marginTop: Spacing.two,
    marginBottom: Spacing.eight,
  },
  dropdownContainer: {
    marginBottom: Spacing.four,
  },
  label: {
    marginBottom: Spacing.one,
    marginLeft: 4,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.large,
    borderWidth: 1.5,
    minHeight: vs(56),
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownIcon: {
    marginRight: Spacing.two,
  },
  uniText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  buttonGroup: {
    gap: Spacing.three,
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtn: {
    paddingVertical: Spacing.two,
  },
  ghostText: {
    fontSize: Typography.small,
    fontWeight: '700',
    color: '#6366F1',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: Spacing.three,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.two,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: Spacing.eight,
  },
  uniItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginVertical: 2,
  },
  uniItemText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    marginRight: Spacing.two,
  },
});
