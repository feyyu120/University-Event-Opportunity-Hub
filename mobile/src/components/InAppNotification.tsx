import React, { useState, useEffect, createContext, useContext } from 'react';
import { StyleSheet, Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { ThemedText, ThemedView } from './Themed';
import { Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface InAppNotif {
  title: string;
  body: string;
  onPress?: () => void;
}

interface NotificationContextType {
  showNotification: (notif: InAppNotif) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useInAppNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useInAppNotification must be used within a NotificationProvider');
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [currentNotif, setCurrentNotif] = useState<InAppNotif | null>(null);
  const translateY = React.useRef(new Animated.Value(-100)).current;

  const showNotification = (notif: InAppNotif) => {
    setCurrentNotif(notif);
    Animated.sequence([
      Animated.timing(translateY, { toValue: 60, duration: 500, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(translateY, { toValue: -100, duration: 500, useNativeDriver: true }),
    ]).start(() => setCurrentNotif(null));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {currentNotif && (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => {
              currentNotif.onPress?.();
              setCurrentNotif(null);
            }}
          >
            <ThemedView variant="element" style={styles.toast}>
              <View style={styles.icon}>
                <ThemedText style={{ fontSize: 24 }}>🎯</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" numberOfLines={1}>{currentNotif.title}</ThemedText>
                <ThemedText style={styles.body} numberOfLines={1}>{currentNotif.body}</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  toast: {
    width: width - Spacing.eight,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 20,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    fontSize: 12,
    opacity: 0.7,
  },
});
