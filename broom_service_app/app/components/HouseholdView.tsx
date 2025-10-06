import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator, Modal, TextInput } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import styles from "../styles/householdViewStyles";
import { HOUSEHOLD_VIEW_URL, GET_USER_HOUSEHOLD_URL, CREATE_HOUSEHOLD_URL, JOIN_HOUSEHOLD_URL } from "../config.json";

type Task = { 
  id: string;
  name: string;
  assigned_to: string;
  date_completed?: string;
  due_date?: string;
  description?: string;
  status: string;
};

type Member = {
  id: string;
  email: string;
  family_id: string;
  is_admin: boolean;
  name: string;
  tasks: Task[];
};

type Household = {
  id: string;
  name: string;
  members: Member[];
};

// Helpers
function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function weekOffsetForDate(d: Date) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const targetStart = startOfWeek(d).getTime();
  const currentStart = startOfWeek(new Date()).getTime();
  return Math.round((targetStart - currentStart) / msPerWeek);
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

const testUserId = "user_zzz"; // testing user

export default function HouseholdView() {
  const [currentUser, setUser] = useState(testUserId);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [inHousehold, setInHousehold] = useState<boolean | null>(null);

  const handlePrevWeek = () => setCurrentWeek((s) => s - 1);
  const handleNextWeek = () => setCurrentWeek((s) => s + 1);

  const handleTaskPress = (task: Task) => {
    Alert.alert("Task selected", `${task.name}\n${task.due_date ?? "No due date"}`);
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [householdNameInput, setHouseholdNameInput] = useState("");
  const [householdCodeInput, setHouseholdCodeInput] = useState("");

  const fetchHouseholdStatus = async () => {
    try {
      // 1. Check if user belongs to household
      const response = await fetch(
        `${GET_USER_HOUSEHOLD_URL}?userId=${encodeURIComponent(testUserId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      const data = await response.json();

      console.log(data)

      if (!data || data.family_id == "default-family-id") {
        setInHousehold(false);
      } else {
        setInHousehold(true);

        // 2. Fetch household details
        const householdRes = await fetch(`${HOUSEHOLD_VIEW_URL}?id=${encodeURIComponent(data.family_id)}`);
        const householdData = await householdRes.json();

        console.log(householdData)

        setHousehold(householdData);
      }
    } catch (err) {
      console.error("Error checking household:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHousehold = async () => {
    try {
      const res = await fetch(`${CREATE_HOUSEHOLD_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: testUserId,
          name: householdNameInput,
        }),
      });

      const data = await res.json();

      console.log(data)

      if (res.ok) {
        const { householdId } = data;
        // immediately fetch full household
        const householdRes = await fetch(`${HOUSEHOLD_VIEW_URL}?id=${encodeURIComponent(data.family_id)}`);
        const fullHousehold = await householdRes.json();
        setHousehold(fullHousehold);

      } else {
        Alert.alert("Error", data?.message || "Failed to create household");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong creating household");
    }
  };

  const handleJoinHousehold = async () => {
    try {
      const res = await fetch(`${JOIN_HOUSEHOLD_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testUserId,
          familyId: householdCodeInput,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowJoinModal(false);
        setInHousehold(true);
        setHousehold(data.household);
      } else {
        Alert.alert("Error", data?.message || "Failed to join household");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong joining household");
    }
  };

  useEffect(() => {
    
    
    fetchHouseholdStatus();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  // 🚫 User not in household → show "join/create" view
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  // 🚫 User not in household → show "join/create" view
  if (inHousehold === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.householdName}>You’re not in a household yet</Text>

        <Pressable style={styles.actionButton} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.actionButtonText}>Create Household</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => setShowJoinModal(true)}>
          <Text style={styles.actionButtonText}>Join Household</Text>
        </Pressable>

        {/* --- Create Household Modal --- */}
        <Modal visible={showCreateModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create a Household</Text>
              <TextInput
                placeholder="Enter household name"
                value={householdNameInput}
                onChangeText={setHouseholdNameInput}
                style={styles.input}
              />
              <Pressable style={styles.actionButton} onPress={handleCreateHousehold}>
                <Text style={styles.actionButtonText}>Create</Text>
              </Pressable>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* --- Join Household Modal --- */}
        <Modal visible={showJoinModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Join a Household</Text>
              <TextInput
                placeholder="Enter household code"
                value={householdCodeInput}
                onChangeText={setHouseholdCodeInput}
                style={styles.input}
              />
              <Pressable style={styles.actionButton} onPress={handleJoinHousehold}>
                <Text style={styles.actionButtonText}>Join</Text>
              </Pressable>
              <Pressable onPress={() => setShowJoinModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // ✅ User is in household → render normal view
  return (
    <View style={styles.container}>
      {/* Household name */}
      <Text style={styles.householdName}>{household?.name}</Text>

      {/* Week navigation */}
      <View style={styles.weekNav}>
        <Pressable onPress={handlePrevWeek} style={styles.arrowButton}>
          <ArrowLeft size={24} color="black" />
        </Pressable>

        <Text style={styles.weekText}>
          {currentWeek === 0
            ? "This Week"
            : currentWeek === -1
            ? "Last Week"
            : currentWeek === 1
            ? "Next Week"
            : `${currentWeek > 0 ? "+" : ""}${currentWeek} Weeks`}
        </Text>

        <Pressable onPress={handleNextWeek} style={styles.arrowButton}>
          <ArrowRight size={24} color="black" />
        </Pressable>
      </View>

      {/* Members + tasks */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {household?.members.map((member) => {
          const weekTasks = member.tasks.filter((t) => {
            if (!t.due_date) return false;
            return weekOffsetForDate(new Date(t.due_date)) === currentWeek;
          });

          return (
            <View key={member.id} style={styles.memberRow}>
              {/* Member circle */}
              <View style={styles.memberCircle}>
                <Text style={styles.memberText}>{getInitials(member.name)}</Text>
              </View>

              {/* Task grid */}
              <View style={styles.taskRow}>
                {weekTasks.length === 0 ? (
                  <View style={styles.noTaskBox}>
                    <Text style={styles.noTaskText}>—</Text>
                  </View>
                ) : (
                  weekTasks.map((task) => (
                    <Pressable
                      key={task.id}
                      onPress={() => handleTaskPress(task)}
                      style={({ pressed }) => [
                        styles.taskBox,
                        task.status === "completed"
                          ? { backgroundColor: pressed ? "#86efac" : "#bbf7d0" }
                          : { backgroundColor: pressed ? "#93c5fd" : "#dbeafe" },
                      ]}
                    >
                      <Text style={styles.taskText}>{task.name}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
