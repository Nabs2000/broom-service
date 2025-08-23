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
  taskId: string;
};

type TaskType = {
  name: string;
  assigned_to: string;
  due_date: string;
  description: string;
  date_created: string;
  date_completed?: string | null;
};

const Task = ({ taskId }: TaskProps) => {
  const [isSelected, setSelection] = useState(false);
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch task data from backend
  useEffect(() => {
    const fetchTask = async () => {
      try {
        // 👇 get Cognito token for auth
        const idToken = await getIdTokenFromCognito();

        const res = await fetch(
          `https://abc123.execute-api.us-west-2.amazonaws.com/prod/task?task_id=${taskId}`,
          {
            headers: { Authorization: idToken },
          }
        );
        const data = await res.json();
        setTask(data);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <View style={styles.view}>
        <Text>Loading task...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.view}>
        <Text>Task not found</Text>
      </View>
    );
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
        <Text style={styles.title}>{task.name}</Text>
        <Text style={styles.text}>Assigned to: {task.assigned_to}</Text>
        <Text style={styles.text}>Due date: {task.due_date}</Text>
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
        <Text style={styles.title}>{task.name}</Text>
        <Text style={styles.text}>Description: {task.description}</Text>
        <Text style={styles.text}>Date created: {task.date_created}</Text>
        <Text style={styles.text}>
          Date completed: {task.date_completed || "Not completed"}
        </Text>
      </View>
    </FlipCard>
  );
};

export default Task;
