import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function PermissionsScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const [emailDigest, setEmailDigest] = useState(true);

  const handleEnableNotifications = () => {
    // Simulate native permission request
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <ThemedText style={styles.bigIcon}>🔔</ThemedText>
          </View>
          
          <ThemedText type="title" style={styles.title}>Never Miss an Opportunity</ThemedText>
          <ThemedText style={styles.description}>
            We'll notify you 24h before deadlines and when new opportunities match your interests.
          </ThemedText>

          <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">Weekly Email Digest</ThemedText>
                <ThemedText style={styles.cardSubtitle}>The best opportunities in your inbox every Monday.</ThemedText>
              </View>
              <Switch 
                value={emailDigest} 
                onValueChange={setEmailDigest}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedButton 
            title="Enable Notifications" 
            onPress={handleEnableNotifications} 
          />
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.skipButton}>
            <ThemedText style={styles.skipText}>Not now</ThemedText>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  bigIcon: {
    fontSize: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  description: {
    textAlign: 'center',
    opacity: 0.6,
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.six,
  },
  card: {
    width: '100%',
    padding: Spacing.four,
    borderRadius: 24,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  cardSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  footer: {
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
