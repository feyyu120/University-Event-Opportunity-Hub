import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, ThemedButton } from './Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Opportunity } from './OpportunityCard';

interface RecommendationSheetProps {
  item: Opportunity | null;
  visible: boolean;
  onClose: () => void;
  onShowLess: (id: string) => void;
}

export function RecommendationSheet({ item, visible, onClose, onShowLess }: RecommendationSheetProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <ThemedView variant="element" style={styles.sheet}>
          <View style={styles.handle} />
          
          <ThemedText type="subtitle" style={styles.title}>Why this?</ThemedText>
          
          <View style={styles.content}>
            <View style={styles.reasonRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#F59E0B15' }]}>
                <Ionicons name="bulb-outline" size={22} color="#F59E0B" />
              </View>
              <ThemedText style={styles.reasonText}>
                {item.reason || `Recommended because you selected ${item.type}s as an interest.`}
              </ThemedText>
            </View>
            
            <View style={styles.reasonRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#6366F115' }]}>
                <Ionicons name="people-outline" size={22} color="#6366F1" />
              </View>
              <ThemedText style={styles.reasonText}>
                Popular among students in your department.
              </ThemedText>
            </View>
          </View>

          <View style={styles.footer}>
            <ThemedButton 
              title="Show Less Like This" 
              variant="outline" 
              onPress={() => {
                onShowLess(item.id);
                onClose();
              }}
              style={styles.showLessBtn}
            />
            <ThemedButton 
              title="Got it" 
              onPress={onClose} 
            />
          </View>
        </ThemedView>
      </TouchableOpacity>
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.four,
  },
  title: {
    marginBottom: Spacing.three,
  },
  content: {
    gap: Spacing.three,
    marginBottom: Spacing.six,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonText: {
    flex: 1,
    opacity: 0.8,
  },
  footer: {
    gap: Spacing.two,
  },
  showLessBtn: {
    borderColor: '#ef4444',
  }
});
