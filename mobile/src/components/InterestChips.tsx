import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from './Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export interface Interest {
  id: string;
  name: string;
  icon: string;
  category: string;
}

interface InterestChipsProps {
  interests: Interest[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function InterestChips({ interests, selectedIds, onToggle }: InterestChipsProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  // Group by category
  const categories = [...new Set(interests.map(i => i.category))];

  return (
    <View style={styles.container}>
      {categories.map(category => (
        <View key={category} style={styles.categoryGroup}>
          <ThemedText style={styles.categoryTitle}>{category}</ThemedText>
          <View style={styles.chipContainer}>
            {interests.filter(i => i.category === category).map(interest => {
              const isSelected = selectedIds.includes(interest.id);
              return (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: isSelected ? colors.primary : colors.backgroundElement,
                      borderColor: isSelected ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => onToggle(interest.id)}
                >
                  <ThemedText style={[styles.chipText, isSelected && { color: '#FFF' }]}>
                    {interest.icon} {interest.name}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
  },
  categoryGroup: {
    marginBottom: Spacing.three,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: Spacing.one,
    textTransform: 'uppercase',
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
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
