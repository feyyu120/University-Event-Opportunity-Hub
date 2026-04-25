import React from 'react';
import { View, StyleSheet, Animated, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText, ThemedView } from './Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

export function SkeletonLoader() {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map(i => (
        <Animated.View key={i} style={[styles.skeletonCard, { backgroundColor: colors.backgroundElement, opacity }]}>
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonBody} />
          <View style={styles.skeletonFooter} />
        </Animated.View>
      ))}
    </View>
  );
}

interface TutorialStep {
  title: string;
  description: string;
  targetPos: { x: number, y: number, w: number, h: number };
}

interface TutorialOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function TutorialOverlay({ visible, onClose }: TutorialOverlayProps) {
  const [step, setStep] = React.useState(0);
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const steps = [
    { title: 'Filters', description: 'Filter opportunities by category and deadline.' },
    { title: 'Bookmarks', description: 'Save opportunities to your profile for later.' },
    { title: 'Notifications', description: 'Manage your alerts and daily updates.' },
  ];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.tutorialBox}>
          <ThemedText type="subtitle">{steps[step].title}</ThemedText>
          <ThemedText style={styles.tutorialDesc}>{steps[step].description}</ThemedText>
          
          <View style={styles.tutorialFooter}>
            <ThemedText style={styles.stepText}>{step + 1} of {steps.length}</ThemedText>
            <TouchableOpacity 
              onPress={() => step < steps.length - 1 ? setStep(step + 1) : onClose()}
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
            >
              <ThemedText style={{ color: '#FFF' }}>{step < steps.length - 1 ? 'Next' : 'Got it'}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  skeletonCard: {
    height: 200,
    borderRadius: 24,
    padding: Spacing.four,
  },
  skeletonHeader: { height: 24, width: '60%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, marginBottom: 12 },
  skeletonBody: { height: 16, width: '90%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, marginBottom: 8 },
  skeletonFooter: { height: 40, width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12, marginTop: 'auto' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialBox: {
    backgroundColor: '#FFF',
    width: width * 0.8,
    padding: Spacing.four,
    borderRadius: 24,
    alignItems: 'center',
  },
  tutorialDesc: {
    textAlign: 'center',
    marginTop: Spacing.two,
    opacity: 0.8,
    color: '#000',
  },
  tutorialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.four,
  },
  stepText: {
    color: '#000',
    opacity: 0.5,
  },
  nextButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 12,
  },
});
