import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  view: {
    padding: 10,  // reduce vertical padding
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',      // horizontal layout
    alignItems: 'center',       // vertical center
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    marginRight: 6,
  },
  checkboxTouchable: {
    width: 28,            // small fixed hit area
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  completedText: {
    marginLeft: 8, // Space between circle & text
    fontSize: 14,
    color: '#333',
  },
  label: {
    fontSize: 14,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Circle + text on same line
    marginTop: 6,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#333" },
  text: { fontSize: 12, marginTop: 5, color: "#333" },
  completeButton: { fontSize: 20, fontWeight: "bold", color: "#333" },
});

export default styles;
