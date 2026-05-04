import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, TextInput, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { ThemedText, ThemedView } from './Themed';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { ms, vs, nf } from '@/utils/responsive';
import { useAuth } from '@/context/AuthContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');

  // Hydrate state when modal opens
  useEffect(() => {
    if (visible && user) {
      setName(user.full_name || '');
      setBio(user.bio || '');
      setImage(user.profile_image || '');
    }
  }, [visible, user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    updateUser({
      full_name: name,
      bio: bio,
      profile_image: image,
    });
    onClose();
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { onClose(); logout(); } },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. Are you absolutely sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { onClose(); logout(); /* Handle backend delete later */ } },
    ]);
  };

  if (!user) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <ThemedText style={{ color: colors.primary, fontSize: nf(16) }}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText type="defaultSemiBold" style={{ fontSize: nf(16) }}>Edit Profile</ThemedText>
          <TouchableOpacity onPress={handleSave} style={{ padding: 8 }}>
            <ThemedText style={{ color: colors.primary, fontWeight: '700', fontSize: nf(16) }}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.avatarSection} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={[styles.avatar, { borderColor: colors.primary }]} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.backgroundElement, borderColor: colors.primary }]}>
                <ThemedText style={styles.avatarText}>{name.charAt(0).toUpperCase()}</ThemedText>
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={nf(14)} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Bio</ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.backgroundElement, borderColor: colors.border, height: vs(80), textAlignVertical: 'top' }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>

          <View style={{ marginTop: Spacing.six }}>
            <TouchableOpacity style={[styles.dangerBtn, { backgroundColor: '#EF444420' }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <ThemedText style={[styles.dangerText, { color: '#EF4444' }]}>Sign Out</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.dangerBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF444420' }]} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <ThemedText style={[styles.dangerText, { color: '#EF4444' }]}>Delete Account</ThemedText>
            </TouchableOpacity>
          </View>

        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    padding: Spacing.four,
  },
  avatarSection: {
    alignSelf: 'center',
    marginBottom: Spacing.six,
    marginTop: Spacing.two,
  },
  avatar: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: nf(36),
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  inputGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: nf(12),
    fontWeight: '600',
    marginBottom: Spacing.two,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.medium,
    padding: Spacing.three,
    fontSize: nf(16),
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    borderRadius: Radius.medium,
    marginBottom: Spacing.three,
    gap: 8,
  },
  dangerText: {
    fontSize: nf(16),
    fontWeight: '600',
  },
});
