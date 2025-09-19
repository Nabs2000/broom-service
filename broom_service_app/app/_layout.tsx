import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// This component will protect our routes from unauthorized access
function AuthLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Define public routes that don't require authentication
    const publicRoutes = ['login', 'signup', 'forgotPass', 'resetPass'];
    const currentRoute = segments[0] || '';
    const isPublicRoute = publicRoutes.includes(currentRoute);

    if (!user) {
      // If user is not signed in and not on a public route, redirect to login
      if (!isPublicRoute) {
        router.replace('/login');
      }
    } else {
      // If user is signed in and on a public route or root, redirect to home
      if (isPublicRoute || !currentRoute) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public Routes */}
      <Stack.Screen name="login" options={{ title: "Log In" }} />
      <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="forgotPass" options={{ title: "Forgot Password" }} />
      <Stack.Screen name="resetPass" options={{ title: "Reset Password" }} />
      
      {/* Protected Routes */}
      <Stack.Screen name="home" options={{ title: "Home" }} />
      
      {/* Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Other Screens */}
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
      <Stack.Screen name="components/userView" options={{ title: "User View" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}
