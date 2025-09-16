import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../styles/userViewStyles';
import { GET_USER_URL } from '../config.json';
import CreateTaskScreen from './CreateTaskScreen';
import TaskGrid from './TaskGrid';

export default function UserView() {
    const [userName, setUserName] = useState('Loading...');
    const [pendingTasks, setPendingTasks] = useState<string[]>([]);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = 'user_001';

    useEffect(() => {
        const lurl = `${GET_USER_URL}?userId=${userId}`;

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
        <Text style={styles.header}>Hello, {userName}</Text>
        <ScrollView contentContainerStyle={styles.content}>
            {error && (
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
            )}
            <TaskGrid userId={userId} />
            <CreateTaskScreen familyId='fam_alpha'/>
        </ScrollView>
    </View>
);
}