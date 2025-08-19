import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Landing Page" }} />
      <Stack.Screen name="signup" options={{ title: "Sign Up Page" }} />
      <Stack.Screen name="login" options={{ title: "Login Page" }} />
      <Stack.Screen name="forgotPass" options={{ title: "Forgot Pass Page" }} />
      <Stack.Screen
        name="taskTesting"
        options={{ title: "Task Testing Page" }}
      />
    </Stack>
  );
}
