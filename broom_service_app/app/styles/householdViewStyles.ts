import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  householdName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#111827", // gray-900
  },
  weekNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  weekText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151", // gray-700
  },
  arrowButton: {
    padding: 8,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  memberCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#bfdbfe", // blue-200
    alignItems: "center",
    justifyContent: "center",
  },
  memberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937", // gray-800
  },
  taskRow: {
    flexDirection: "row",
    marginLeft: 16,
  },
  taskBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  noTaskBox: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  taskText: {
    fontSize: 12,
    color: "#4b5563", // gray-600
  },
  noTaskText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6b7280",
    textAlign: "center",
  },
});

export default styles;