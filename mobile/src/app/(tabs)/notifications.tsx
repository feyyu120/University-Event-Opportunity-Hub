import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/components/Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface Notification {
  id: string;
  type: 'New Match' | 'Deadline' | 'QA' | 'Update';
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  group: 'Today' | 'Yesterday' | 'Earlier';
}

const MOCK_NOTIFS: Notification[] = [
  { id: '1', type: 'Deadline', title: 'Deadline Tomorrow', body: 'Software Engineer Intern application ends in 24h.', time: '2h ago', isRead: false, group: 'Today' },
  { id: '2', type: 'QA', title: 'New Answer', body: 'Admin replied to your question about eligibility.', time: '5h ago', isRead: false, group: 'Today' },
  { id: '3', type: 'New Match', title: 'New Opportunity', body: 'A new AI Internship was posted that matches your interests.', time: '1d ago', isRead: true, group: 'Yesterday' },
];

const getTypeIcon = (type: string): { name: keyof typeof Ionicons.glyphMap; color: string } => {
  switch (type) {
    case 'Deadline': return { name: 'hourglass-outline', color: '#F59E0B' };
    case 'QA': return { name: 'chatbubble-outline', color: '#6366F1' };
    case 'New Match': return { name: 'flash-outline', color: '#10B981' };
    default: return { name: 'notifications-outline', color: '#64748B' };
  }
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFS);
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const handleClear = () => {
    Alert.alert('Clear All', 'Are you sure you want to clear all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText type="title">Notifications</ThemedText>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={markAllRead}>
              <ThemedText style={styles.actionText}>Mark all as read</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClear}>
              <ThemedText style={[styles.actionText, { color: '#ef4444' }]}>Clear all</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={notifications}
          renderItem={({ item }) => {
            const iconInfo = getTypeIcon(item.type);
            return (
              <TouchableOpacity style={[styles.notifCard, !item.isRead && { backgroundColor: `${colors.primary}10` }]}>
                <View style={[styles.iconContainer, { backgroundColor: iconInfo.color + '15' }]}>
                  <Ionicons name={iconInfo.name} size={22} color={iconInfo.color} />
                </View>
                <View style={styles.body}>
                  <View style={styles.cardHeader}>
                    <ThemedText type="defaultSemiBold" style={!item.isRead && { color: colors.primary }}>{item.title}</ThemedText>
                    <ThemedText style={styles.time}>{item.time}</ThemedText>
                  </View>
                  <ThemedText style={styles.notifBody}>{item.body}</ThemedText>
                </View>
                {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="mail-open-outline" size={60} color={colors.textSecondary} />
              <ThemedText type="subtitle" style={{ marginTop: 16 }}>Inbox is empty</ThemedText>
              <ThemedText style={styles.emptySub}>We'll notify you when something important happens.</ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
  list: {
    paddingBottom: Spacing.six,
  },
  notifCard: {
    flexDirection: 'row',
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    opacity: 0.5,
  },
  notifBody: {
    fontSize: 14,
    opacity: 0.7,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
    padding: Spacing.six,
  },
  emptySub: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: Spacing.one,
  },
});
