import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import FlipCard from "react-native-flip-card";
import styles from "../styles/signupPageStyles";

const Task = () => {
  return (
    <FlipCard>
      {/* Face Side */}
    <View style={[styles.userInput, { alignItems: "center", justifyContent: "center", height: 200, backgroundColor: "#f0f0f0", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }]}>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>The Face</Text>
    </View>
    {/* Back Side */}
    <View style={[styles.userInput, { alignItems: "center", justifyContent: "center", height: 200, backgroundColor: "#e0e0e0", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }]}>
        <Text>The Back</Text>
      </View>
    </FlipCard>
  );
};

export default Task;
