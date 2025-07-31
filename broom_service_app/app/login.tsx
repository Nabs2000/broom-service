import styles from './styles/loginPageStyles';
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} >
          <AntDesign name="arrowleft" size={30} color={"#fff"} />
        </TouchableOpacity>

        {/* Log In Title Text */}
        <Text style={styles.loginTitle}>Log In</Text>

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
        <TouchableOpacity style={styles.loginButton} onPress={() => alert("Log in Button is Pressed.")} >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Forgot Password or Register */}
        <View style={styles.forgotPassOrRegister}>
          <Link href="/forgotPass" style={styles.forgotPassOrRegisterText}>Forgot Password? Reset</Link>
          <Link href="/signup" style={styles.forgotPassOrRegisterText}>Don&apos;t have an account? Sign Up</Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}