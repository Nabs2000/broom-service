import React, { useState } from 'react';
import { Alert, StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import Title from '../components/Title';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminItems, setAdminItems] = useState([
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ]);
  const router = useRouter();

  const handleBackToLogin = () => {
    router.replace('/(auth)/login');
  };

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter your first and last name');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  async function handleSignUp() {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
            is_admin: isAdmin
          }
        }
      });

      if (error) {
        Alert.alert('Signup Error', error.message);
        return;
      }

      if (data.user && !data.session) {
        Alert.alert(
          'Verify Your Email',
        );
        router.replace('/(auth)/login');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during signup.');
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
            
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>Sign up to get started</Text>
            
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Input
                label="First Name"
                leftIcon={{ type: 'font-awesome', name: 'user' }}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="John"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.verticallySpaced}>
              <Input
                label="Last Name"
                leftIcon={{ type: 'font-awesome', name: 'user' }}
                onChangeText={setLastName}
                value={lastName}
                placeholder="Doe"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.verticallySpaced}>
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
                placeholder="Create a password"
                autoCapitalize="none"
                autoComplete="new-password"
              />
            </View>

            <View style={styles.verticallySpaced}>
              <Input
                label="Confirm Password"
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                rightIcon={{
                  type: 'font-awesome',
                  name: showConfirmPassword ? 'eye-slash' : 'eye',
                  onPress: () => setShowConfirmPassword(!showConfirmPassword),
                }}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm your password"
                autoCapitalize="none"
                autoComplete="new-password"
              />
            </View>

            <View style={[styles.verticallySpaced, { zIndex: 1000 }]}>
              <Text style={styles.label}>Admin User?</Text>
              <DropDownPicker
                open={adminOpen}
                value={isAdmin}
                items={adminItems}
                setOpen={setAdminOpen}
                setValue={setIsAdmin}
                setItems={setAdminItems}
                placeholder="Select user type"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                modalProps={{
                  animationType: 'fade',
                }}
                modalTitle="Select user type"
                modalContentContainerStyle={styles.modalContent}
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>

            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Button
                title={loading ? 'Creating Account...' : 'Sign Up'}
                disabled={loading}
                onPress={handleSignUp}
                buttonStyle={styles.signUpButton}
                titleStyle={styles.buttonText}
              />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleBackToLogin} disabled={loading}>
                <Text style={styles.loginLink}>Sign in</Text>
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
  signUpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#666',
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 50,
    marginTop: 5,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    marginTop: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});