import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Shadows } from '@/constants/theme';
import { haptic } from '@/utils/hapticHelper';
import { ThemedText } from '@/components/Themed';

export default function TabLayout() {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView 
            intensity={theme === 'dark' ? 60 : 80} 
            tint={theme === 'dark' ? 'dark' : 'light'} 
            style={StyleSheet.absoluteFill} 
          />
        ),
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
      screenListeners={{
        state: () => haptic.selection(),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <ThemedText style={{ color, fontSize: 22 }}>🏠</ThemedText>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <ThemedText style={{ color, fontSize: 22 }}>🔍</ThemedText>,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <ThemedText style={{ color, fontSize: 22 }}>🔖</ThemedText>,
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applied',
          tabBarIcon: ({ color }) => <ThemedText style={{ color, fontSize: 22 }}>💼</ThemedText>,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <ThemedText style={{ color, fontSize: 22 }}>🔔</ThemedText>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ThemedText style={{ color, fontSize: 22 }}>👤</ThemedText>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    paddingTop: 12,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  tabBarIcon: {
    marginBottom: -2,
  },
});
