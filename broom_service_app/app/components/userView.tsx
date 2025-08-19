import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from '../styles/userViewStyles';

export default function UserView() {
    const userName = "Filler Name";
    const pendingTasks = ["Task 3", "Task 4"];
    const completedTasks = ["Task 1", "Task 2"];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>User View</Text>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.greeting}>Hello, {userName}</Text>
                <Text style={styles.sectionTitle}>Pending tasks:</Text>
                {pendingTasks.map((task) => (
                    <Text key={task} style={styles.task}>{task}</Text>
                ))}
                <Text style={styles.sectionTitle}>Completed tasks:</Text>
                {completedTasks.map((task) => (
                    <Text key={task} style={styles.task}>{task}</Text>
                ))}
            </ScrollView>
        </View>
    );
}