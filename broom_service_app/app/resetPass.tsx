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

        {/* Reset Password Title Text */}
        <Text style={styles.resetPassTitle}>Reset Password</Text>

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
        <TouchableOpacity style={styles.resetPassButton} onPress={() => alert("Password is updated")} >
          <Text style={styles.resetPassButtonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}