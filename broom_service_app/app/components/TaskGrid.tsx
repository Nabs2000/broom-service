import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { fetchUserTasks } from '../utils/taskQueries';
import Task from './Task';
import styles from '../styles/taskGridStyles';

interface TaskType {
  id: string;
  name: string;
  assigned_to: string;
  due_date: string;
  description: string;
  date_created: string;
  date_completed?: string | null;
  status?: 'pending' | 'in-progress' | 'completed';
}

interface TaskGridProps {
  userId: string;
}

const TaskGrid: React.FC<TaskGridProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const userTasks = await fetchUserTasks(userId);
      setTasks(userTasks);
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const pendingTasks = tasks.filter(task => !task.date_completed);
  const completedTasks = tasks.filter(task => task.date_completed);

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderTask = (task: TaskType) => (
    <View key={task.id} style={styles.taskWrapper}>
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Active Tasks</Text>
      {pendingTasks.length > 0 ? (
        <View style={styles.grid}>
          {pendingTasks.map(renderTask)}
        </View>
      ) : (
        <Text style={styles.emptyState}>No active tasks found</Text>
      )}

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
