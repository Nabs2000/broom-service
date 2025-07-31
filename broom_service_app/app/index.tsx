import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Broom Service</Text>
      <Link style={styles.text} href="/signup">
        Sign Up
      </Link>
      <Link style={styles.text} href="/login">
        Login
      </Link>
      <Link style={styles.text} href="/taskTesting">
        Task Testing
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    color: "#fff",
  },
});
