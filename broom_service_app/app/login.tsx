import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();

  return (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    padding: 10,
  },
  loginTitle: {
    color: '#fff',
    fontSize: 100,
    fontFamily: "Cochin",
    fontWeight: "bold",
    marginTop: 150,
    marginBottom: 70,
  }, 
  userInputGroup: {
    width: 300,
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  fieldLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  userInput: {
    width: 300,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 20,
    marginBottom: 45,
  },
  loginButton: {
    backgroundColor: '#4e9bde',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  forgotPassOrRegister: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  forgotPassOrRegisterText: {
    color: '#4e9bde',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});
