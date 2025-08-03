import {
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Task from "./components/Task";

export default function TaskTesting() {

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>
        <Text>Hello!</Text>
        <Task />
      </View>
    </TouchableWithoutFeedback>
  );
}
