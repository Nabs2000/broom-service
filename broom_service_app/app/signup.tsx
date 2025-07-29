import styles from "./signupPageStyles";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    if (!firstName.trim()) {
      setFirstNameError("First name required");
      return;
    }
    if (!lastName.trim()) {
      setLastNameError("Last name required");
      return;
    }
    if (!username.trim()) {
      setUsernameError("Username required");
      return;
    }
    if (!password.trim()) {
      setPasswordError("Password required");
      return;
    }

    // Proceed with submission logic
    alert("Signup successful!");
    setFirstNameError("");
    setLastNameError("");
    setUsernameError("");
    setPasswordError("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={30} color={"#fff"} />
        </TouchableOpacity>

        {/* Log In Title Text */}
        <Text style={styles.loginTitle}>Sign Up</Text>

        {/* User Log in Fields */}
        <View style={styles.userInputGroup}>
          <Text style={styles.fieldLabel}>First Name</Text>
          <TextInput
            style={styles.userInput}
            placeholder="John"
            value={firstName}
            onChangeText={(text) => {
              setUsername(text);
              if (usernameError && text.trim()) {
                setUsernameError("");
              }
            }}
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="default"
          />
          <Text style={styles.fieldLabel}>Middle Name</Text>
          <TextInput
            style={styles.userInput}
            placeholder="Alex"
            placeholderTextColor="#aaa"
            value={middleName}
            onChangeText={(text) => {
              setMiddleName(text);
            }}
            autoCapitalize="none"
            keyboardType="default"
          />
          <Text style={styles.fieldLabel}>Last Name</Text>
          <TextInput
            style={styles.userInput}
            placeholder="John"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              if (lastNameError && text.trim()) {
                setLastNameError("");
              }
            }}
            autoCapitalize="none"
            keyboardType="default"
          />
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.userInput}
            placeholder="*******"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError && text.trim()) {
                setPasswordError("");
              }
            }}
            secureTextEntry
          />
        </View>

        {/* Log In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
          <Text style={styles.loginButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
