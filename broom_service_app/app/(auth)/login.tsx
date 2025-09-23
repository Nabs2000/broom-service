import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Text } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '@rneui/themed'
import {useRouter} from 'expo-router'
import Title from '../components/Title'
import {UserType, createUser} from '../../utils/userQueries'
import DropDownPicker from "react-native-dropdown-picker";

export default function Auth() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ]);
  const router = useRouter()

  // Listen for auth state changes to detect email verification and handle user creation
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if we've already processed this user
        const { data: { user } } = await supabase.auth.getUser();
        console.log('User:', user);
        const isProcessed = user?.user_metadata?.dynamodb_created;
        
        if (!isProcessed) {
          try {
            const userData: UserType = {
              id: session.user.id,
              name: session.user.user_metadata.full_name,
              family_id: 'default-family-id', // You might want to generate or set a default family_id
              email: session.user.email,
              is_admin: session.user.user_metadata.is_admin
            };
            
            console.log('User data:', userData);
            // Create user in DynamoDB
            // Do error handling for createUser
            try {
              await createUser(userData);
            } catch (error) {
              console.error('Error creating user:', error);
              Alert.alert('Error', 'An unexpected error occurred during user creation.');
              return;
            }
            
            // Mark user as processed in Supabase
            await supabase.auth.updateUser({
              data: { dynamodb_created: true }
            });
            
            console.log('User created in DynamoDB and marked as processed');
          } catch (error) {
            console.error('Error in user creation flow:', error);
          }
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [firstName, lastName]);

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
        Alert.alert(error.message)
        setLoading(false)
        return // Exit if there's an error
      }
      
      // Only navigate if there's no error
      router.replace('/(tabs)/home')
      setLoading(false)
  }

  async function signUpWithEmail({firstName, lastName, email, password, isAdmin}: {firstName: string, lastName: string, email: string, password: string, isAdmin: boolean}) {
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

      if (!data.session) {
        Alert.alert(
          'Verify Your Email',
          'Please check your email and click the verification link to complete your registration.'
        );
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Error', 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  }

  // Close dropdown when keyboard appears to prevent layout issues
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (open) setOpen(false);
    });
    return () => {
      keyboardShowListener.remove();
    };
  }, [open]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        if (open) setOpen(false);
      }}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={!open} // Disable scrolling when dropdown is open
        >
          <View style={styles.container}>
            <Title />
            
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Text style={styles.label}>Is Admin?</Text>
              <DropDownPicker
                open={open}
                value={isAdmin}
                items={items}
                setOpen={setOpen}
                setValue={setIsAdmin}
                setItems={setItems}
                placeholder="Select user type"
                style={styles.dropdown}
                dropDownContainerStyle={[
                  styles.dropdownContainer,
                  Platform.OS === 'ios' && { position: 'relative', top: 0, marginTop: 5 }
                ]}
                listMode="MODAL" // This prevents the VirtualizedList nesting issue
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
              <Input 
                label="First Name"
                leftIcon={{ type: 'font-awesome', name: 'user' }}
                onChangeText={(text) => setFirstName(text)}
                value={firstName}
                placeholder="First Name"
                autoCapitalize={'words'}
              />
            </View>
            
            <View style={styles.verticallySpaced}>
              <Input
                label="Last Name"
                leftIcon={{ type: 'font-awesome', name: 'user' }}
                onChangeText={(text) => setLastName(text)}
                value={lastName}
                placeholder="Last Name"
                autoCapitalize={'words'}
              />
            </View>
            
            <View style={styles.verticallySpaced}>
              <Input
                label="Email"
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}
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
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={!showPassword}
                placeholder="Password"
                autoCapitalize={'none'}
                autoComplete="password"
              />
            </View>
            
            <View style={[styles.verticallySpaced, styles.buttonContainer]}>
              <Button 
                title="Sign in" 
                disabled={loading} 
                onPress={() => signInWithEmail()} 
                containerStyle={styles.button}
              />
              <Button 
                title="Sign up" 
                disabled={loading} 
                onPress={() => signUpWithEmail({firstName, lastName, email, password, isAdmin})} 
                containerStyle={styles.button}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#86939e',
  },
  dropdown: {
    borderColor: '#86939e',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    borderColor: '#86939e',
    marginTop: 4,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    padding: 15,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    marginVertical: 8,
    width: '100%',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})