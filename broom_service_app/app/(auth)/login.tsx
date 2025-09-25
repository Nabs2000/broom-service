import React, { useState } from 'react';
import { Alert, StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import Title from '../components/Title';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUpPress = () => {
    router.push('/(auth)/signup');
  };

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (error) {
        Alert.alert('Sign In Error', error.message);
        return;
      }
  
      if (data?.user) {
        router.replace({
          pathname: '/(tabs)/home/[id]',
          params: { id: data.user.id }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Title />
            
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue</Text>
            
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Input
                label="Email"
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                onChangeText={setEmail}
                value={email}
                placeholder="email@address.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.verticallySpaced}>
              <Input
                label="Password"
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                rightIcon={{
                  type: 'font-awesome',
                  name: showPassword ? 'eye-slash' : 'eye',
                  onPress: () => setShowPassword(!showPassword),
                }}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                autoCapitalize="none"
                autoComplete="current-password"
              />
            </View>

            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Button
                title={loading ? 'Signing In...' : 'Sign In'}
                disabled={loading}
                onPress={signInWithEmail}
                buttonStyle={styles.signInButton}
                titleStyle={styles.buttonText}
              />
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUpPress} disabled={loading}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  verticallySpaced: {
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});