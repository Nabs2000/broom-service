import React, { useState } from "react";
import { Button, Text, View } from "react-native";

const Task = () => {
  return (
    <View>
      <Text>Task Name: TASK NAME FROM DB</Text>
      <Text>Date Created: DATE FROM DB</Text>
      <Text>Description: DESC FROM DB</Text>
      <Text>Date Completed: DATE COMPLETED FROM DB</Text>
    </View>
  );
};

export default Task;
