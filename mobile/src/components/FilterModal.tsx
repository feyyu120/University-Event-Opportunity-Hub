import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { ThemedText, ThemedView, ThemedButton } from './Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setExpanded(!expanded)}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText>{expanded ? '▼' : '▶'}</ThemedText>
      </TouchableOpacity>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [year, setYear] = useState('Any');
  const [sort, setSort] = useState('Relevance');
  const [showExpired, setShowExpired] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleDept = (dept: string) => {
    setSelectedDepts(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]);
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedDepts([]);
    setYear('Any');
    setSort('Relevance');
    setShowExpired(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <ThemedView variant="element" style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.closeBtn}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle">Filters</ThemedText>
            <TouchableOpacity onPress={handleReset}>
              <ThemedText style={styles.resetBtn}>Reset</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <FilterSection title="Opportunity Type">
              <View style={styles.chipRow}>
                {['Events', 'Scholarships', 'Internships', 'Workshops', 'Hackathons'].map(t => (
                  <TouchableOpacity 
                    key={t} 
                    style={[styles.chip, { borderColor: colors.border }, selectedTypes.includes(t) && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                    onPress={() => toggleType(t)}
                  >
                    <ThemedText style={selectedTypes.includes(t) && { color: '#FFF' }}>{t}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Department Target">
              <View style={styles.chipRow}>
                {['Computer Science', 'Business', 'Engineering', 'Medicine', 'Law'].map(d => (
                  <TouchableOpacity 
                    key={d} 
                    style={[styles.chip, { borderColor: colors.border }, selectedDepts.includes(d) && { backgroundColor: colors.secondary, borderColor: colors.secondary }]}
                    onPress={() => toggleDept(d)}
                  >
                    <ThemedText style={selectedDepts.includes(d) && { color: '#FFF' }}>{d}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Eligibility Year">
              <View style={styles.radioGroup}>
                {['Any', '1st Year', '2nd+', '3rd+', '4th+', 'Graduate'].map(y => (
                  <TouchableOpacity key={y} style={styles.radioItem} onPress={() => setYear(y)}>
                    <View style={[styles.radio, { borderColor: colors.border }, year === y && { borderColor: colors.primary, borderWidth: 5 }]} />
                    <ThemedText>{y}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Sort By">
              <View style={styles.radioGroup}>
                {['Relevance', 'Nearest deadline', 'Most saved', 'Newest'].map(s => (
                  <TouchableOpacity key={s} style={styles.radioItem} onPress={() => setSort(s)}>
                    <View style={[styles.radio, { borderColor: colors.border }, sort === s && { borderColor: colors.primary, borderWidth: 5 }]} />
                    <ThemedText>{s}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            <View style={styles.toggleRow}>
              <ThemedText type="defaultSemiBold">Show Expired Opportunities</ThemedText>
              <Switch value={showExpired} onValueChange={setShowExpired} trackColor={{ true: colors.primary }} />
            </View>

            <ThemedButton 
              title="Save this filter set" 
              variant="outline" 
              onPress={() => {}} 
              style={styles.saveBtn}
            />
          </ScrollView>

          <View style={styles.footer}>
            <ThemedButton title="Apply Filters" onPress={() => onApply({})} />
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '90%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  closeBtn: { color: '#64748b' },
  resetBtn: { color: '#ef4444' },
  scroll: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  sectionContent: {
    marginTop: Spacing.two,
  },
  chipRow: {
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
  radioGroup: {
    gap: Spacing.two,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.three,
  },
  saveBtn: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  footer: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
});
