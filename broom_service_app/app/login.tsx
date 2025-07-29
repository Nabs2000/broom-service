import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} >
        {/* <Text style={styles.backButtonText} onPress={() => router.back()} >Back</Text> */}
        <AntDesign name="arrowleft" size={30} color={"#fff"} />
      </TouchableOpacity>
      <Text style={styles.loginTitle}>Log In</Text>
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
  }, 
  userInput: {
    width: 300,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 20,
    marginBottom: 16,
  },
});
