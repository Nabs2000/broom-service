import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 20,
    paddingTop: 40,
    position: 'relative',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  profileIcon: {
    position: 'absolute',
    top: 40,
    right: 30,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  task: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 4,
  },
});

export default styles;