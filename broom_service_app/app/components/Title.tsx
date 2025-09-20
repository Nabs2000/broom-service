import { Text, View } from "react-native";

export default function Title() {
    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>🧹 Broom Service 🧹</Text>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>A fun way to keep your home clean!</Text>
        </View>
    )
}