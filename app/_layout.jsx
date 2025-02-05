import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="home"
        options={{ title: "Home", headerBackVisible: false }}
      />
      <Stack.Screen
        name="audioDetail"
        options={{ title: "Audio Details", headerShown: true }}
      />
    </Stack>
  );
}