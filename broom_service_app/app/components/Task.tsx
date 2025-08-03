import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Animated,
  Text,
  View,
  TouchableWithoutFeedback,
  useAnimatedValue,
} from "react-native";
import FlipCard from "react-native-flip-card";
import BouncyCheckBox from "react-native-bouncy-checkbox";
import styles from "../styles/taskStyles";

const Task = () => {
  const [isSelected, setSelection] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isSelected ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isSelected, animation]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f08080", "#90ee90"],
  });

  return (
    <FlipCard flipVertical={true} flipHorizontal={false}>
      {/* Face Side */}
      <Animated.View
        style={[
          styles.view,
          {
            backgroundColor: backgroundColor,
          },
        ]}
      >
        <Text style={styles.title}>Task Name</Text>
        <Text style={styles.text}>Assigned to: Nabeel Sabzwari</Text>
        <Text style={styles.text}>Due date: 07/12/2025</Text>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.checkboxContainer}>
            <BouncyCheckBox
              size={15}
              isChecked={isSelected}
              onPress={setSelection}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Completed?</Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
      {/* Back Side */}
      <View
        style={[
          styles.view,
          {
            backgroundColor: isSelected ? "#90ee90" : "#f08080",
            transitionProperty: "background-color",
            transitionDuration: "500ms",
            transitionTimingFunction: "ease",
          },
        ]}
      >
        <Text style={styles.title}>Task Name</Text>
        <Text style={styles.text}>Description: This is a task</Text>
        <Text style={styles.text}>Date created: 07/10/2025</Text>
        <Text style={styles.text}>Date completed: 07/14/2025</Text>
      </View>
    </FlipCard>
  );
};

export default Task;
