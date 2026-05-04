import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="profile-creation" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
