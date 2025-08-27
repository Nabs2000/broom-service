import React from 'react';
import { Text } from 'react-native';
import styles from '../styles/userViewStyles';

interface TaskListSectionProps {
    title: string;
    tasks: string[];
}

const TaskList: React.FC<TaskListSectionProps> = ({ title, tasks }) => (
    <>
        <Text style={styles.sectionTitle}>{title}</Text>
        {tasks.length === 0 ? (
            <Text style={styles.task}>No {title.toLowerCase()}.</Text>
        ) : (
            tasks.map((task) => (
                <Text key={task} style={styles.task}>{task}</Text>
            ))
        )}
    </>
);

export default TaskList