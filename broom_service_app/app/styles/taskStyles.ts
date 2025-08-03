import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginLeft: 500,
    marginRight: 500,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#333" },
  text: { fontSize: 12, marginTop: 5, color: "#333" },
  completeButton: { fontSize: 20, fontWeight: "bold", color: "#333" },
});

export default styles;
