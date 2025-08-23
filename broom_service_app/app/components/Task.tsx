import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import FlipCard from "react-native-flip-card";
import BouncyCheckBox from "react-native-bouncy-checkbox";
import styles from "../styles/taskStyles";

// Task takes a taskId as prop
type TaskProps = {
  task: TaskType;
};

type TaskType = {
  name: string;
  assigned_to: string;
  due_date: string;
  description: string;
  date_created: string;
  date_completed?: string | null;
};

const Task = ({ task }: TaskProps) => {
  const [isSelected, setSelection] = useState(false);
  const [taskData, setTaskData] = useState<TaskType | null>(task);
  const [loading, setLoading] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  // Animate background
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

  // Render nothing or a loading indicator if taskData is null or loading
  if (loading || !taskData) {
    return <View><Text>Loading...</Text></View>;
  }

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
        <Text style={styles.title}>{taskData.name}</Text>
        <Text style={styles.text}>Assigned to: {taskData.assigned_to}</Text>
        <Text style={styles.text}>Due date: {taskData.due_date}</Text>
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
          },
        ]}
      >
        <Text style={styles.title}>{taskData.name}</Text>
        <Text style={styles.text}>Description: {taskData.description}</Text>
        <Text style={styles.text}>Date created: {taskData.date_created}</Text>
        <Text style={styles.text}>
          Date completed: {taskData.date_completed || "Not completed"}
        </Text>
      </View>
    </FlipCard>
  );
};

export default Task;
