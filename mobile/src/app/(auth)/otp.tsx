import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { Spacing, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function OTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      Keyboard.dismiss();
      handleVerify();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    // Simulate verification
    setTimeout(() => {
      router.push('/(auth)/profile-creation');
    }, 500);
  };

  const handleResend = () => {
    if (attempts < 3) {
      setTimer(30);
      setAttempts(attempts + 1);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0].focus();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </TouchableOpacity>

        <View style={styles.content}>
          <ThemedText type="title">Enter Code</ThemedText>
          <ThemedText style={styles.subtitle}>
            We've sent a 6-digit code to {email || 'your email'}.
          </ThemedText>

          <View style={styles.otpContainer}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => (inputs.current[i] = ref!)}
                style={[
                  styles.otpInput,
                  { 
                    backgroundColor: Colors[theme].backgroundElement, 
                    color: Colors[theme].text,
                    borderColor: digit ? Colors[theme].primary : Colors[theme].border
                  }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <ThemedText style={styles.timerText}>Resend code in {timer}s</ThemedText>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={attempts >= 3}>
                <ThemedText style={[styles.resendText, attempts >= 3 && { opacity: 0.5 }]}>
                  {attempts >= 3 ? 'Max attempts reached' : 'Resend Code'}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          <ThemedButton 
            title="Verify & Continue" 
            onPress={handleVerify}
            disabled={otp.some(digit => digit === '')}
          />
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.six,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  timerText: {
    opacity: 0.6,
  },
  resendText: {
    color: '#6366f1',
    fontWeight: '600',
  },
});
