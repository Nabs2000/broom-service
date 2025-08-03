import React, { useState } from "react";
import {
  Button,
  CheckBox,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import FlipCard from "react-native-flip-card";
import styles from "../styles/taskStyles";

const Task = () => {
  const [isSelected, setSelection] = useState(false);

  return (
    <FlipCard flipVertical={true} flipHorizontal={false}>
      {/* Face Side */}
      <View style={styles.view}>
        <Text style={styles.title}>Task Name</Text>
        <Text style={styles.text}>Assigned to: Nabeel Sabzwari</Text>
        <Text style={styles.text}>Due date: 07/12/2025</Text>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Completed?</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* Back Side */}
      <View style={styles.view}>
        <Text style={styles.title}>Task Name</Text>
        <Text style={styles.text}>Description: This is a task</Text>
        <Text style={styles.text}>Date created: 07/10/2025</Text>
      </View>
    </FlipCard>
  );
};

export default Task;
