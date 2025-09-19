import { useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "./contexts/AuthContext";
import styles from "./styles/signupPageStyles";

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    let isValid = true;
    
    // Reset errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");

    // Validate form
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      isValid = false;
    }
    
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      isValid = false;
    }
    
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }
    
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }
    
    if (!isValid) return;

    try {
      setLoading(true);

      console.log("email", email);
      console.log("password", password);
      console.log("firstName", firstName);
      console.log("lastName", lastName);
      console.log("isValid", isValid);
      
      
      // Create user with email and password
      const { error } = await signUp(email, password);
      console.log("error", error);
      
      if (error) throw error;
      
      // If signup is successful, user will be automatically signed in
      // and the auth state change will handle navigation
      
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create account");
    } finally {
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
          <AntDesign name="arrowleft" size={30} color={"#fff"} />
        </TouchableOpacity>

        {/* Sign Up Title Text */}
        <Text style={styles.signupTitle}>Create Account</Text>

        {/* User Sign Up Fields */}
        <View style={styles.userInputGroup}>
          <Text style={styles.fieldLabel}>First Name</Text>
          <TextInput
            style={[styles.userInput, firstNameError ? styles.inputError : null]}
            placeholder="John"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError("");
            }}
            editable={!loading}
          />
          {firstNameError ? (
            <Text style={styles.errorText}>{firstNameError}</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Last Name</Text>
          <TextInput
            style={[styles.userInput, lastNameError ? styles.inputError : null]}
            placeholder="Doe"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setLastNameError("");
            }}
            editable={!loading}
          />
          {lastNameError ? (
            <Text style={styles.errorText}>{lastNameError}</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={[styles.userInput, emailError ? styles.inputError : null]}
            placeholder="your@email.com"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            editable={!loading}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={[styles.userInput, passwordError ? styles.inputError : null]}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            editable={!loading}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : (
            <Text style={styles.hintText}>Use at least 6 characters</Text>
          )}
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signupButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Already have an account? */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={[styles.loginLink, { fontWeight: '600' }]}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By creating an account, you agree to our{' '}
          <Text style={styles.termsLink} onPress={() => Alert.alert('Terms of Service', 'Terms of service will be displayed here.')}>
            Terms of Service
          </Text>
          {' '}and{' '}
          <Text style={styles.termsLink} onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will be displayed here.')}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
