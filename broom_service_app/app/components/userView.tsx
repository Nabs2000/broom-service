import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../styles/userViewStyles';
import TaskList from './TaskList';
import { LAMBDA_URL } from '../config'; 
import CreateTaskScreen from './CreateTaskScreen';

export default function UserView() {
    const [userName, setUserName] = useState('Loading...');
    const [pendingTasks, setPendingTasks] = useState<string[]>([]);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = 'user_001';

    useEffect(() => {
        const lurl = `${LAMBDA_URL}?userId=${userId}`;

        fetch(lurl)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setUserName(data.userName || 'Unknown');
                setPendingTasks(data.pendingTasks || []);
                setCompletedTasks(data.completedTasks || []);
                setError(null);
            })
            .catch(err => {
                setUserName('Error');
                setPendingTasks([]);
                setCompletedTasks([]);
                setError('Failed to load data. Please try again.');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
    <View style={styles.container}>
        <Text style={styles.header}>User View</Text>
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.greeting}>Hello, {userName}</Text>
            {error && (
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
            )}
            <TaskList title="Pending tasks" tasks={pendingTasks} />
            <TaskList title="Completed tasks" tasks={completedTasks} />
            <CreateTaskScreen />
        </ScrollView>
    </View>
);
}