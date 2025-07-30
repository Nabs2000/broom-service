import styles from './styles/loginPageStyles';
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} >
          <AntDesign name="arrowleft" size={30} color={"#fff"} />
        </TouchableOpacity>

        {/* Reset Password Title Text */}
        <Text style={styles.loginTitle}>Reset Password</Text>

        {/* New Pass and Confirm New Pass Field */}
        <View style={styles.userInputGroup}>
          <Text style={styles.fieldLabel}>New Password</Text>
          <TextInput 
            style={styles.userInput}
            placeholder="*******"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <TextInput 
            style={styles.userInput}
            placeholder="*******"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>

        {/* Update Password Button */}
        <TouchableOpacity style={styles.loginButton} onPress={() => alert("Update New Password Button is Pressed.")} >
          <Text style={styles.loginButtonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}