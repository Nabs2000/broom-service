import React from 'react';
import { View } from 'react-native';
import styles from '../styles/userViewStyles';
import TaskGrid from './TaskGrid';

export default function UserView() {
    const userID = "user_001";

    return (
        <View style={styles.container}>
            <TaskGrid userId={userID} />
        </View>
    );
}