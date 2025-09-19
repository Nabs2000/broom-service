import { useState } from 'react';
import { Alert, Platform, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from './contexts/AuthContext';
import styles from './styles/loginPageStyles';

export default function Login() {
  const router = useRouter();
  const { signIn, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignIn = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Simple validation
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    if (!isValid) return;

    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      // Navigate to the main app screen on successful login
      router.replace('/(tabs)/home');
    } catch (error: any) {
      // Handle different error cases
      if (error.message.includes('Invalid login credentials')) {
        setEmailError('Invalid email or password');
        setPasswordError('Invalid email or password');
      } else {
        Alert.alert('Error', error.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true);
      await signInWithOAuth(provider);
      // Navigation after OAuth is handled by the auth state change in AuthProvider
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with OAuth');
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          disabled={loading}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.loginTitle}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue to your account</Text>

        {/* User Log in Fields */}
        <View style={styles.userInputGroup}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput 
            style={[styles.userInput, emailError ? styles.inputError : null]}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            editable={!loading}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          
          <Text style={[styles.fieldLabel, { marginTop: 15 }]}>Password</Text>
          <TextInput 
            style={[styles.userInput, passwordError ? styles.inputError : null]}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoComplete="current-password"
            editable={!loading}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          
          <TouchableOpacity 
            style={{ alignSelf: 'flex-end', marginTop: 5 }}
            onPress={() => router.push('/forgotPass')}
            disabled={loading}
          >
            <Text style={styles.forgotPassOrRegisterText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Log In Button */}
        <TouchableOpacity 
          style={[styles.loginButton, (loading || !email || !password) && styles.disabledButton]} 
          onPress={handleSignIn}
          disabled={loading || !email || !password}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing In...' : 'Log In'}
          </Text>
        </TouchableOpacity>


        {/* Sign Up Link */}
        <View style={styles.forgotPassOrRegister}>
          <Text style={{ color: '#fff' }}>Don't have an account? </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.forgotPassOrRegisterText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4e9bde" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}