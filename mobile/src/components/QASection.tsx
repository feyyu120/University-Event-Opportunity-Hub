import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, ThemedButton } from './Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface Comment {
  id: string;
  user: string;
  text: string;
  time: string;
  upvotes: number;
  replies?: Comment[];
  isAnonymous?: boolean;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    user: 'Sarah J.',
    text: 'Is this open to international students?',
    time: '2h ago',
    upvotes: 12,
    replies: [
      { id: '1-1', user: 'Admin', text: 'Yes, all full-time students are eligible.', time: '1h ago', upvotes: 5 }
    ]
  },
  {
    id: '2',
    user: 'Alex M.',
    text: 'What is the expected CGPA for this?',
    time: '5h ago',
    upvotes: 8,
    isAnonymous: true,
  }
];

export function QASection() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: isAnonymous ? 'Anonymous' : 'You',
      text: newComment,
      time: 'Just now',
      upvotes: 0,
      isAnonymous
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const renderComment = (item: Comment, isReply = false) => (
    <View key={item.id} style={[styles.commentCard, isReply && styles.replyCard, isReply && { borderLeftColor: colors.border }]}>
      <View style={styles.commentHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {item.isAnonymous && <Ionicons name="person-circle-outline" size={16} color={colors.textSecondary} />}
          <ThemedText type="defaultSemiBold">{item.isAnonymous ? 'Anonymous' : item.user}</ThemedText>
        </View>
        <ThemedText style={styles.time}>{item.time}</ThemedText>
      </View>
      <ThemedText style={styles.commentText}>{item.text}</ThemedText>
      <View style={styles.commentFooter}>
        <TouchableOpacity style={[styles.upvoteBtn, { backgroundColor: colors.backgroundSelected }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="arrow-up" size={14} color={colors.text} />
            <ThemedText style={styles.upvoteText}>{item.upvotes}</ThemedText>
          </View>
        </TouchableOpacity>
        {!isReply && (
          <TouchableOpacity>
            <ThemedText style={styles.replyBtn}>Reply</ThemedText>
          </TouchableOpacity>
        )}
      </View>
      {item.replies?.map(reply => renderComment(reply, true))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Questions & Answers</ThemedText>
      
      <ThemedView variant="element" style={styles.inputBox}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Ask a question..."
          placeholderTextColor={colors.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <View style={styles.inputFooter}>
          <TouchableOpacity 
            style={styles.anonToggle} 
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }, isAnonymous && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              {isAnonymous && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <ThemedText style={styles.anonText}>Post anonymously</ThemedText>
          </TouchableOpacity>
          <ThemedButton 
            title="Post" 
            onPress={handlePost} 
            style={styles.postBtn}
          />
        </View>
      </ThemedView>

      <View style={styles.list}>
        {comments.map(c => renderComment(c))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.four,
  },
  title: {
    marginBottom: Spacing.three,
  },
  inputBox: {
    padding: Spacing.three,
    borderRadius: 20,
    marginBottom: Spacing.four,
  },
  input: {
    minHeight: 60,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  anonToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anonText: {
    fontSize: 12,
    opacity: 0.6,
  },
  postBtn: {
    minHeight: 40,
    paddingVertical: Spacing.one,
  },
  list: {
    gap: Spacing.three,
  },
  commentCard: {
    marginBottom: Spacing.two,
  },
  replyCard: {
    marginLeft: Spacing.four,
    marginTop: Spacing.two,
    paddingLeft: Spacing.two,
    borderLeftWidth: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    opacity: 0.5,
  },
  commentText: {
    fontSize: 15,
    opacity: 0.8,
  },
  commentFooter: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  upvoteBtn: {
    paddingHorizontal: Spacing.two,
    borderRadius: 8,
  },
  upvoteText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  replyBtn: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
});
