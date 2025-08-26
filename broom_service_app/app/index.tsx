import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import styles from "./styles/indexPageStyles";

export default function Index() {
  // Removed unused router variable
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.titleText}>🧹 Broom Service 🧹</Text>
        <Text style={styles.text}>A fun way to clean the house</Text>
        {/* User Log in Fields */}
        <View style={styles.userInputGroup}>
          <Text style={styles.fieldLabel}>Username or Email</Text>
          <TextInput
            style={styles.userInput}
            placeholder="example@gmail.com"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.userInput}
            placeholder="*******"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>

        {/* Log In Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => alert("Log in Button is Pressed.")}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Forgot Password or Register */}
        <View style={styles.forgotPassOrRegister}>
          <Link href="/forgotPass" style={styles.forgotPassOrRegisterText}>
            Forgot Password? Reset
          </Link>
          <Link href="/signup" style={styles.forgotPassOrRegisterText}>
            Don&apos;t have an account? Sign Up
          </Link>
        </View>

        <View style={styles.forgotPassOrRegister}>
          <Link href="/components/userView" style={styles.forgotPassOrRegisterText}>User View</Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
