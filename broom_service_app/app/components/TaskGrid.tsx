// Import necessary React and React Native components
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
// Import our custom hook for fetching tasks
import { fetchUserTasks } from '../utils/taskQueries';
// Import the Task component to render individual tasks
import Task from './Task';
// Import styles specific to the TaskGrid component
import styles from '../styles/taskGridStyles';

// Define the shape of a task object
interface TaskType {
  id: string;                  // Unique identifier for the task
  name: string;                // Task name/title
  assigned_to: string;         // User ID of the assignee
  due_date: string;            // When the task is due (ISO date string)
  description: string;         // Task description/details
  date_created: string;        // When the task was created (ISO date string)
  date_completed?: string | null; // When the task was completed (null if not completed)
  status?: 'pending' | 'in-progress' | 'completed'; // Current status of the task
}

// Define the props that the TaskGrid component accepts
interface TaskGridProps {
  userId: string;  // The ID of the user whose tasks we want to display
}

// Main TaskGrid component that displays tasks in a grid layout
const TaskGrid: React.FC<TaskGridProps> = ({ userId }) => {
  // State to store the list of tasks
  const [tasks, setTasks] = useState<TaskType[]>([]);
  // Loading state to show/hide loading indicator
  const [loading, setLoading] = useState(true);
  // Error state to store any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to fetch tasks from the API
  const loadTasks = async () => {
    try {
      setLoading(true);  // Show loading indicator
      // Fetch tasks for the current user
      const userTasks = await fetchUserTasks(userId);
      // Update tasks in state
      setTasks(userTasks);
      // Clear any previous errors
      setError(null);
    } catch (err) {
      // Log and handle any errors
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      // Always hide loading indicator when done
      setLoading(false);
    }
  };

  // Load tasks when the component mounts or when userId changes
  useEffect(() => {
    loadTasks();
  }, [userId]);

  // Filter tasks into pending and completed
  const pendingTasks = tasks.filter(task => !task.date_completed);
  const completedTasks = tasks.filter(task => task.date_completed);

  // Show loading indicator on initial load
  if (loading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Show error message if there was an error loading tasks
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Helper function to render a single task
  const renderTask = (task: TaskType) => (
    <View key={task.id} style={styles.taskWrapper}>
      {/* Render the Task component with the task data */}
      <Task task={{
        name: task.name,
        assigned_to: task.assigned_to,
        due_date: task.due_date,
        description: task.description,
        date_created: task.date_created,
        date_completed: task.date_completed
      }} />
    </View>
  );

  // Main component render
  return (
    <ScrollView style={styles.container}>
      {/* Active Tasks Section */}
      <Text style={styles.sectionTitle}>Active Tasks</Text>
      {pendingTasks.length > 0 ? (
        <View style={styles.grid}>
          {pendingTasks.map(renderTask)}
        </View>
      ) : (
        <Text style={styles.emptyState}>No active tasks found</Text>
      )}

      {/* Completed Tasks Section */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Completed Tasks</Text>
      {completedTasks.length > 0 ? (
        <View style={styles.grid}>
          {completedTasks.map(renderTask)}
        </View>
      ) : (
        <Text style={styles.emptyState}>No completed tasks yet</Text>
      )}
    </ScrollView>
  );
};

export default TaskGrid;
