import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Animated } from 'react-native';
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
              <ThemedText style={styles.icon}>💡</ThemedText>
              <ThemedText style={styles.reasonText}>
                {item.reason || `Recommended because you selected ${item.type}s as an interest.`}
              </ThemedText>
            </View>
            
            <View style={styles.reasonRow}>
              <ThemedText style={styles.icon}>👥</ThemedText>
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
  icon: {
    fontSize: 24,
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
