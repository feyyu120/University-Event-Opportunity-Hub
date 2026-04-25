import { Platform } from 'react-native';

// Simplified mock of expo-notifications if not available
const Notifications = {
  requestPermissionsAsync: async () => ({ status: 'granted' }),
  getPermissionsAsync: async () => ({ status: 'granted' }),
  scheduleNotificationAsync: async (req: any) => 'mock-id',
  setNotificationHandler: (handler: any) => {},
};

export interface QuietHours {
  start: number; // 0-23
  end: number;   // 0-23
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function checkNotificationStatus() {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export function isWithinQuietHours(quietHours: QuietHours | null): boolean {
  if (!quietHours) return false;
  const now = new Date();
  const currentHour = now.getHours();
  
  if (quietHours.start < quietHours.end) {
    return currentHour >= quietHours.start && currentHour < quietHours.end;
  } else {
    // Overlap midnight (e.g., 22 to 8)
    return currentHour >= quietHours.start || currentHour < quietHours.end;
  }
}

export async function scheduleDailyDigest(quietHours: QuietHours | null) {
  if (isWithinQuietHours(quietHours)) return;
  
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Good morning! ☀️',
      body: '5 new opportunities matching your interests are waiting for you.',
      data: { url: '/(tabs)' },
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

export async function scheduleDeadlineReminder(title: string, dateStr: string) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Deadline Tomorrow',
      body: `${title} ends in 24h. Don't forget to apply!`,
      data: { url: '/(tabs)/saved' },
    },
    trigger: {
      seconds: 24 * 3600, // 24h from now for demo
    },
  });
}

export async function scheduleStatusUpdate(title: string, status: string) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: status === 'Accepted' ? '✅ Congratulations!' : '🔔 Status Update',
      body: `Your application for ${title} was marked as ${status}.`,
      data: { url: '/(tabs)/applications' },
    },
    trigger: null, // immediate
  });
}
