import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ThemedText, ThemedView, ThemedButton } from './Themed';
import { Spacing, Colors, Radius } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { haptic } from '@/utils/hapticHelper';
import { opportunitiesApi, type Comment } from '@/api/opportunities';
import { useAuth } from '@/context/AuthContext';

interface InteractionSectionProps {
  opportunityId: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
}

export function InteractionSection({ opportunityId, comments: initialComments, onCommentAdded }: InteractionSectionProps) {
  const { user } = useAuth();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    
    setSubmitting(true);

    // Mock items: create local-only comment without API call
    const isMockItem = opportunityId.startsWith('t') || !opportunityId.includes('-');
    if (isMockItem) {
      haptic.success();
      const localComment: Comment = {
        id: `local-${Date.now()}`,
        opportunity_id: opportunityId,
        user_id: user.id.toString(),
        user_name: user.full_name,
        profile_image: user.profile_image,
        parent_id: replyTo?.id || null,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
      };
      onCommentAdded(localComment);
      setNewComment('');
      setReplyTo(null);
      setSubmitting(false);
      return;
    }

    try {
      const res = await opportunitiesApi.comment(
        opportunityId, 
        user.id.toString(), 
        newComment.trim(), 
        replyTo?.id
      );
      
      if (res.success) {
        haptic.success();
        // Construct the full comment object for local state update
        const fullComment: Comment = {
          ...res.data,
          user_name: user.full_name,
          profile_image: user.profile_image
        };
        onCommentAdded(fullComment);
        setNewComment('');
        setReplyTo(null);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
      haptic.error();
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const isReply = !!item.parent_id;
    const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.user_name) + '&background=random';
    
    return (
      <View style={[styles.commentCard, isReply && styles.replyPadding]}>
        <Image 
          source={item.profile_image ? { uri: item.profile_image } : { uri: defaultAvatar }} 
          style={styles.avatar} 
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <ThemedText type="defaultSemiBold" style={styles.userName}>{item.user_name}</ThemedText>
            <ThemedText type="caption" style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</ThemedText>
          </View>
          <ThemedText style={styles.contentText}>{item.content}</ThemedText>
          
          {!isReply && (
            <TouchableOpacity 
              onPress={() => {
                setReplyTo(item);
                haptic.light();
              }}
              style={styles.replyBtn}
            >
              <ThemedText type="caption" style={{ color: colors.primary, fontWeight: '700' }}>Reply</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Group comments by parent
  const mainComments = initialComments.filter(c => !c.parent_id);
  const replies = initialComments.filter(c => !!c.parent_id);

  // Flatten for simple list rendering with nesting logic in renderItem
  const threadedComments: Comment[] = [];
  mainComments.forEach(main => {
    threadedComments.push(main);
    replies.filter(r => r.parent_id === main.id).forEach(reply => {
      threadedComments.push(reply);
    });
  });

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Comments ({initialComments.length})</ThemedText>
      
      {threadedComments.length > 0 ? (
        threadedComments.map((item) => (
          <View key={item.id}>
            {renderComment({ item })}
          </View>
        ))
      ) : (
        <ThemedText style={styles.emptyText}>No comments yet. Be the first to share your thoughts!</ThemedText>
      )}

      <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        {replyTo && (
          <View style={styles.replyingTo}>
            <ThemedText type="caption">Replying to <ThemedText type="defaultSemiBold">{replyTo.user_name}</ThemedText></ThemedText>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text }]}
            multiline
          />
          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={submitting || !newComment.trim()}
            style={[styles.sendBtn, { backgroundColor: colors.primary }]}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.four,
  },
  title: {
    marginBottom: Spacing.four,
  },
  commentCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.four,
  },
  replyPadding: {
    marginLeft: 40,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
  },
  time: {
    fontSize: 11,
    opacity: 0.6,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  replyBtn: {
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginVertical: Spacing.six,
    fontStyle: 'italic',
  },
  inputWrapper: {
    marginTop: Spacing.four,
    padding: 12,
    borderRadius: Radius.large,
    borderWidth: 1,
  },
  replyingTo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
    paddingTop: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
