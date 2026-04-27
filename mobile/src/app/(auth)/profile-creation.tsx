import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { InterestChips, Interest } from '@/components/InterestChips';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

const DEPARTMENTS = ['Computer Science', 'Business', 'Engineering', 'Medicine', 'Arts', 'Law', 'Science'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', "Master's", 'PhD'];
const INTERESTS: Interest[] = [
  { id: '1', name: 'AI', icon: 'hardware-chip-outline', category: 'Technology' },
  { id: '2', name: 'Web Dev', icon: 'globe-outline', category: 'Technology' },
  { id: '3', name: 'Cybersecurity', icon: 'shield-checkmark-outline', category: 'Technology' },
  { id: '4', name: 'Marketing', icon: 'trending-up-outline', category: 'Business' },
  { id: '5', name: 'Finance', icon: 'cash-outline', category: 'Business' },
  { id: '6', name: 'Entrepreneurship', icon: 'rocket-outline', category: 'Business' },
  { id: '7', name: 'UI/UX', icon: 'color-palette-outline', category: 'Design' },
  { id: '8', name: 'Graphic Design', icon: 'brush-outline', category: 'Design' },
  { id: '9', name: 'Research', icon: 'flask-outline', category: 'Science' },
];
const GOALS = ['Internship', 'Scholarship', 'Networking', 'Learning new skill', 'Part-time job'];

export default function ProfileCreationScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const [name, setName] = useState('');
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 10 ? [...prev, id] : prev
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title">Create Profile</ThemedText>
          <ThemedText style={styles.subtitle}>Tell us a bit about yourself.</ThemedText>

          {/* Profile Pic Placeholder */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={[styles.avatar, { backgroundColor: colors.backgroundElement }]}>
              <Ionicons name="person-outline" size={40} color={colors.textSecondary} />
            </TouchableOpacity>
            <ThemedText style={styles.avatarLabel}>Add Photo</ThemedText>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: colors.backgroundElement, color: colors.text, borderColor: colors.border }]}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <ThemedText style={styles.label}>Department</ThemedText>
            <View style={styles.row}>
              {DEPARTMENTS.slice(0, 3).map(d => (
                <TouchableOpacity 
                  key={d} 
                  style={[styles.smallChip, dept === d && { backgroundColor: colors.primary }]}
                  onPress={() => setDept(d)}
                >
                  <ThemedText style={dept === d && { color: '#FFF' }}>{d}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <ThemedText style={styles.label}>Year of Study</ThemedText>
            <View style={styles.row}>
              {YEARS.slice(0, 4).map(y => (
                <TouchableOpacity 
                  key={y} 
                  style={[styles.smallChip, year === y && { backgroundColor: colors.primary }]}
                  onPress={() => setYear(y)}
                >
                  <ThemedText style={year === y && { color: '#FFF' }}>{y}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <ThemedText style={styles.label}>Interests (Select 3-10)</ThemedText>
            <InterestChips 
              interests={INTERESTS} 
              selectedIds={selectedInterests} 
              onToggle={toggleInterest} 
            />

            <ThemedText style={styles.label}>What are you looking for?</ThemedText>
            <View style={styles.chipContainer}>
              {GOALS.map(goal => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: selectedGoals.includes(goal) ? colors.secondary : colors.backgroundElement,
                      borderColor: selectedGoals.includes(goal) ? colors.secondary : colors.border
                    }
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <ThemedText style={selectedGoals.includes(goal) && { color: '#FFF' }}>{goal}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <ThemedButton 
              title="Continue" 
              onPress={() => router.push('/(auth)/permissions')}
              disabled={selectedInterests.length < 3 || !name}
            />
            <TouchableOpacity onPress={() => router.push('/(auth)/permissions')} style={styles.skipButton}>
              <ThemedText style={styles.skipText}>Skip for now</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: Spacing.four,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  avatarLabel: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  form: {
    gap: Spacing.three,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.two,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  smallChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
  },
  footer: {
    marginTop: Spacing.six,
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  skipText: {
    opacity: 0.6,
  },
});
