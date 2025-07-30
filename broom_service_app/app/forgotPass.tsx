import styles from './styles/resetPassPageStyles';
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

        {/* Forgot Password Title Text */}
        <Text style={styles.resetPassTitle}>Forgot Password</Text>

        {/* User Email Field */}
        <View style={styles.userInputGroup}>
          <Text style={styles.fieldLabel}>Enter Email</Text>
          <TextInput 
            style={styles.userInput}
            placeholder="example@gmail.com"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Reset Pass Button */}
        <TouchableOpacity style={styles.resetPassButton} onPress={() => alert("Reset Button is Pressed.")} >
          <Text style={styles.resetPassButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}