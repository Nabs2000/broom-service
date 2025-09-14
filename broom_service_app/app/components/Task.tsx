import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Animated,
  Text,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import FlipCard from "react-native-flip-card";
import BouncyCheckBox from "react-native-bouncy-checkbox";
import styles from "../styles/taskStyles";
import { deleteTask, updateTask } from "../utils/taskQueries";
import { FontAwesome } from '@expo/vector-icons';

// Task component props
type TaskProps = {
  task: TaskType;
  onTaskUpdate?: (updatedTask: TaskType) => void;
  onTaskDelete?: (taskId: string) => void;
};

export type TaskType = {
  id: string;
  name: string;
  assigned_to: string;
  due_date: string;
  description: string;
  date_created: string;
  date_completed?: string | null;
  status?: 'pending' | 'in-progress' | 'completed';
};

const Task = ({ task, onTaskUpdate, onTaskDelete }: TaskProps) => {
  const [taskData, setTaskData] = useState<TaskType | null>(task);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const isSelected = taskData?.status === 'completed';

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

  const handleCheckboxChange = useCallback(async (isChecked: boolean) => {
    if (!taskData) return;
    setUpdating(true);
    try {
      const updatedTask = await updateTask(taskData.id, isChecked);
      setTaskData(updatedTask);
      // Notify parent component about the update
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert the UI state on error
      setTaskData({...taskData});
    } finally {
      setUpdating(false);
    }
  }, [taskData, onTaskUpdate]);

  // Render nothing or a loading indicator if taskData is null or loading
  if (loading || !taskData) {
    return (
      <View style={[styles.view, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="small" color="#0000ff" />
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
        <Text style={styles.title}>{taskData.name}</Text>
        <Text style={styles.text}>Assigned to: {taskData.assigned_to}</Text>
        <Text style={styles.text}>Due date: {taskData.due_date}</Text>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.checkboxContainer}>
            {updating ? (
              <ActivityIndicator size="small" color="#0000ff" style={styles.checkbox} />
            ) : (
              <BouncyCheckBox
                size={15}
                isChecked={isSelected}
                onPress={handleCheckboxChange}
                style={styles.checkbox}
                disabled={updating}
              />
            )}
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
        <Text style={styles.text}>Description: {taskData.description}</Text>
        <Text style={styles.text}>Date created: {taskData.date_created}</Text>
        <Text style={styles.text}>
          Date completed: {taskData.date_completed || "Not completed"}
        </Text>

      {/* Delete  */}
      <TouchableOpacity 
        style={{ marginTop: 10, alignSelf: "flex-end" }}
        onPress={() => deleteTask(taskData.id)}
      >
        <FontAwesome name="trash" size={24} color="red" />
      </TouchableOpacity>
      </View>
    </FlipCard>
  );
};

export default Task;
