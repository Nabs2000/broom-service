import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import FlipCard from "react-native-flip-card";
import styles from "../styles/taskStyles";

const Task = () => {
  return (
    <FlipCard>
      {/* Face Side */}
      <View style={styles.view}>
        <Text style={styles.title}>Task Name</Text>
        <Text style={styles.text}>Assigned to: Nabeel Sabzwari</Text>
        <Text style={styles.text}>Due date: 07/12/2025</Text>
      </View>
      {/* Back Side */}
      <View style={styles.view}>
        <Text style={styles.title}>Task Name</Text>
        <Text style={styles.text}>Description:</Text>
        <Text style={styles.text}>Date created: 07/10/2025</Text>
      </View>
    </FlipCard>
  );
};

export default Task;
