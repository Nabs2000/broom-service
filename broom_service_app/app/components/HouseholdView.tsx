import React, { useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import styles from "./styles/householdViewStyles";

type Member = {
  id: string;
  initials: string;
};

type Task = {
  id: number;
  title: string;
  assigneeInitials: string; // matches Member.initials
  completed: boolean;
  date: Date;
};

const members: Member[] = [
  { id: "1", initials: "NS" },
  { id: "2", initials: "YQ" },
  { id: "3", initials: "IE" },
  { id: "4", initials: "KD" },
];

// --- Mock tasks (dates spread across last/this/next week) ---
const mockTasks: Task[] = [
  // last week
  {
    id: 1,
    title: "Take out trash",
    assigneeInitials: "NS",
    completed: true,
    date: new Date(new Date().setDate(new Date().getDate() - 6)),
  },
  {
    id: 2,
    title: "Organize pantry",
    assigneeInitials: "IE",
    completed: true,
    date: new Date(new Date().setDate(new Date().getDate() - 10)),
  },
  {
    id: 3,
    title: "Vacuum bedroom",
    assigneeInitials: "YQ",
    completed: false,
    date: new Date(new Date().setDate(new Date().getDate() - 6))
  },
  {
    id: 4,
    title: "Vacuum ceiling idk",
    assigneeInitials: "YQ",
    completed: false,
    date: new Date(new Date().setDate(new Date().getDate() - 10))
  },


  // this week
  {
    id: 4,
    title: "Vacuum living room",
    assigneeInitials: "YQ",
    completed: false,
    date: new Date(), // today
  },
  {
    id: 5,
    title: "Wash dishes",
    assigneeInitials: "IE",
    completed: false,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: 6,
    title: "Clean bathroom",
    assigneeInitials: "KD",
    completed: true,
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
  },

  // next week
  {
    id: 7,
    title: "Do laundry",
    assigneeInitials: "NS",
    completed: false,
    date: new Date(new Date().setDate(new Date().getDate() + 8)),
  },
  {
    id: 8,
    title: "Mop kitchen floor",
    assigneeInitials: "YQ",
    completed: false,
    date: new Date(new Date().setDate(new Date().getDate() + 10)),
  },
  {
    id: 9,
    title: "Wipe counters",
    assigneeInitials: "KD",
    completed: false,
    date: new Date(new Date().setDate(new Date().getDate() + 12)),
  },
];

// Helper: start-of-week (Sunday) for a given date
function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sunday as start
  return d;
}

// Helper: week offset relative to current week start (0 = this week)
function weekOffsetForDate(d: Date) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const targetStart = startOfWeek(d).getTime();
  const currentStart = startOfWeek(new Date()).getTime();
  return Math.round((targetStart - currentStart) / msPerWeek);
}

export default function HouseholdView() {
  // -1 = last week, 0 = this week, +1 = next week
  const [currentWeek, setCurrentWeek] = useState<number>(0);

  // bucket tasks by week offset using a memo
  const tasksByOffset = useMemo(() => {
    const map: Record<number, Task[]> = {};
    for (const t of mockTasks) {
      const offset = weekOffsetForDate(t.date);
      if (!map[offset]) map[offset] = [];
      map[offset].push(t);
    }
    return map; // e.g. { -1: [...], 0: [...], 1: [...] }
  }, []);

  const handlePrevWeek = () => setCurrentWeek((s) => s - 1);
  const handleNextWeek = () => setCurrentWeek((s) => s + 1);

  const handleTaskPress = (task: Task) => {
    console.log("Task clicked:", task.title, "date:", task.date.toISOString());
    Alert.alert("Task selected", `${task.title}\n${task.date.toDateString()}`);
  };

  return (
    <View style={styles.container}>
      {/* Household name in header */}
      <Text style={styles.householdName}>La Casa De Flores</Text>

      {/* Week navigation (arrows) */}
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
            : `${currentWeek > 0 ? "+" : ""}${currentWeek} Week`}
        </Text>

        <Pressable onPress={handleNextWeek} style={styles.arrowButton}>
          <ArrowRight size={24} color="black" />
        </Pressable>
      </View>

      {/* Members + tasks */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {members.map((member) => {
          // tasks for this week for this member
          const weekTasks = tasksByOffset[currentWeek] ?? [];
          const memberTasks = weekTasks.filter(
            (t) => t.assigneeInitials === member.initials
          );

          return (
            <View key={member.id} style={styles.memberRow}>
              {/* Member circle */}
              <View style={styles.memberCircle}>
                <Text style={styles.memberText}>{member.initials}</Text>
              </View>

              {/* Task grid for this member and week */}
              <View style={styles.taskRow}>
                {memberTasks.length === 0 ? (
                  <View style={styles.noTaskBox}>
                    <Text style={styles.noTaskText}>—</Text>
                  </View>
                ) : (
                  memberTasks.map((task) => (
                    <Pressable
                      key={task.id}
                      onPress={() => handleTaskPress(task)}
                      style={({ pressed }) => [
                        styles.taskBox,
                        task.completed === true
                          ? { backgroundColor: pressed ? "#86efac" : "#bbf7d0" } // green-300 : green-200
                          : { backgroundColor: pressed ? "#93c5fd" : "#dbeafe" }, // blue-300 : blue-100
                      ]}
                    >
                      <Text style={styles.taskText}>{task.title}</Text>
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