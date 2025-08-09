import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import styles from "./styles/indexPageStyles";

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
    </View>
  );
}
