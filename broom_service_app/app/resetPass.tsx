import { useState } from 'react';
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import styles from './styles/resetPassPageStyles';

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      // Get the access token from the URL if it exists (for email links)
      const accessToken = params?.access_token;
      const refreshToken = params?.refresh_token;
      
      if (accessToken && refreshToken) {
        // If we have tokens from the URL, set the session first
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken as string,
          refresh_token: refreshToken as string,
        });
        
        if (sessionError) throw sessionError;
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (updateError) throw updateError;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} >
          <AntDesign name="arrowleft" size={30} color={"#fff"} />
        </TouchableOpacity>

        {success ? (
          <View style={styles.successContainer}>
            <AntDesign name="checkcircle" size={64} color="#4BB543" style={styles.successIcon} />
            <Text style={styles.successTitle}>Password Updated</Text>
            <Text style={styles.successText}>
              Your password has been successfully updated. You can now log in with your new password.
            </Text>
            <TouchableOpacity 
              style={styles.backToLoginButton}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.backToLoginButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Reset Password Title Text */}
            <Text style={styles.resetPassTitle}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below and confirm it to update your password.
            </Text>

            {/* New Pass and Confirm New Pass Field */}
            <View style={styles.userInputGroup}>
              <Text style={styles.fieldLabel}>New Password</Text>
              <TextInput 
                style={[styles.userInput, error ? styles.inputError : null]}
                placeholder="••••••••"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                editable={!loading}
              />
              
              <Text style={styles.fieldLabel}>Confirm New Password</Text>
              <TextInput 
                style={[styles.userInput, error ? styles.inputError : null]}
                placeholder="••••••••"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                editable={!loading}
                onSubmitEditing={handleResetPassword}
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Text style={styles.hintText}>Use at least 6 characters</Text>
            </View>

            {/* Update Password Button */}
            <TouchableOpacity 
              style={[styles.resetPassButton, loading && styles.disabledButton]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.resetPassButtonText}>
                {loading ? 'Updating...' : 'Update Password'}
              </Text>
            </TouchableOpacity>
            
            {/* Back to Login Link */}
            <TouchableOpacity 
              style={styles.backToLoginButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.backToLoginButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}