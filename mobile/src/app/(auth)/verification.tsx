import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function VerificationScreen() {
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [email, setEmail] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.includes('@') && !text.endsWith('.edu')) {
      const prefix = text.split('@')[0];
      setSuggestions([`${prefix}@harvard.edu`, `${prefix}@stanford.edu`, `${prefix}@mit.edu`]);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backIcon}>←</ThemedText>
          </TouchableOpacity>

          <View style={styles.content}>
            <ThemedText type="title">Verify Email</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your university email address to receive a verification code.
            </ThemedText>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: Colors[theme].backgroundElement, 
                    color: Colors[theme].text,
                    borderColor: Colors[theme].border 
                  }
                ]}
                placeholder="university@example.edu"
                placeholderTextColor={Colors[theme].textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={handleEmailChange}
              />
              
              {suggestions.length > 0 && (
                <View style={[styles.suggestions, { backgroundColor: Colors[theme].backgroundElement }]}>
                  {suggestions.map((s) => (
                    <TouchableOpacity key={s} onPress={() => { setEmail(s); setSuggestions([]); }} style={styles.suggestionItem}>
                      <ThemedText>{s}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <ThemedButton 
              title="Send Verification Code" 
              onPress={() => router.push({ pathname: '/(auth)/otp', params: { email } })}
              disabled={!email.endsWith('.edu')}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  backButton: {
    paddingVertical: Spacing.two,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: Spacing.four,
  },
  subtitle: {
    opacity: 0.6,
    marginTop: Spacing.two,
    marginBottom: Spacing.six,
  },
  inputContainer: {
    marginBottom: Spacing.four,
    zIndex: 1,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
  },
  suggestions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    borderRadius: 12,
    padding: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  suggestionItem: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
});
