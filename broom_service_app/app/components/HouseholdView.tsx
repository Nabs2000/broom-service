import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator} from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import styles from "../styles/householdViewStyles";
import { GET_HOUSEHOLD_URL, FETCH_TASKS_URL } from '../config.json';

type Task = { 
  id: number; 
  name: string;
  assigned_to: string;
  date_completed: string;
  due_date: string;
  description: string;
  status: string;
};

type Member ={
  id: string;
  email: string;
  family_id: string;
  is_admin: boolean;
  name: string;
  tasks: []; // list of task id strings
}

type UserTasks = {
  userId: string;
  tasks: Task[];
};

type Household = {
  id: string;
  name: string;
  members: string[];
};

// Helper: start-of-week (Sunday) for a given date
function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sunday as start
  return d;
}

function getInitials(fullName: string) {
  if (!fullName || typeof fullName !== 'string') {
    return ''; // Handle empty or non-string input
  }

  const nameParts = fullName.trim().split(/\s+/); // Split by one or more spaces
  let initials = '';

  for (let i = 0; i < nameParts.length; i++) {
    if (nameParts[i].length > 0) {
      initials += nameParts[i][0].toUpperCase(); // Take the first letter and convert to uppercase
    }
  }
  return initials;
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
  const [household, setHousehold] = useState<Household | null>(null);
  const [userTasks, setUserTasks] = useState<UserTasks[]>([]);
  const [loading, setLoading] = useState(true);

  // bucket tasks by week offset using a memo
  // const tasksByOffset = useMemo(() => {
  //   const map: Record<number, Task[]> = {};
  //   for (const t of mockTasks) {
  //     const offset = weekOffsetForDate(t.date);
  //     if (!map[offset]) map[offset] = [];
  //     map[offset].push(t);
  //   }
  //   return map; // e.g. { -1: [...], 0: [...], 1: [...] }
  // }, []);

  const handlePrevWeek = () => setCurrentWeek((s) => s - 1);
  const handleNextWeek = () => setCurrentWeek((s) => s + 1);

  const handleTaskPress = (task: Task) => {
    console.log("Task clicked:", task.name, "date:", task.due_date);
    Alert.alert("Task selected", `${task.name}\n${task.due_date}`);
  };

  useEffect(() => {
    const householdId = "fam_alpha"; // hardcoded for now

    const fetchHousehold = async () => {
      try {
        const householdRes = await fetch(
          `${GET_HOUSEHOLD_URL}?id=${encodeURIComponent(householdId)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );        

        const data = await householdRes.json();
        setHousehold(data);

        if (data.members && data.members.length > 0) {
          const taskResults = await Promise.all(
            data.members.map(async (uid: string) => {
              try {
                const r = await fetch(`${FETCH_TASKS_URL}?assigned_to=${uid}`);
                if (!r.ok) return { userId: uid, tasks: [] };
  
                const tasksJson = await r.json();
  
                // convert date strings to Date objects
                const normalized = tasksJson.map((t: any, idx: number) => ({
                  id: idx,
                  name: t.name,
                  assigneeInitials: t.assigned_to ?? uid, // fallback
                  completed: t.completed ?? false,
                  date: new Date(t.date), // assumes ISO string
                }));
  
                return { userId: uid, tasks: normalized };
              } catch (err) {
                console.error("Error fetching tasks for user", uid, err);
                return { userId: uid, tasks: [] };
              }
            })
          );
          setUserTasks(taskResults);
        }
      } catch (err) {
        console.error("Error fetching household:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHousehold();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    // <View style={styles.container}>

    //   {/* Household name in header */}
    //   <Text style={styles.householdName}>household?.name</Text>

    //   {/* Week navigation (arrows) */}
    //   <View style={styles.weekNav}>
    //     <Pressable onPress={handlePrevWeek} style={styles.arrowButton}>
    //       <ArrowLeft size={24} color="black" />
    //     </Pressable>

    //     <Text style={styles.weekText}>
    //       {currentWeek === 0
    //         ? "This Week"
    //         : currentWeek === -1
    //         ? "Last Week"
    //         : currentWeek === 1
    //         ? "Next Week"
    //         : `${currentWeek > 0 ? "+" : ""}${currentWeek} Week`}
    //     </Text>

    //     <Pressable onPress={handleNextWeek} style={styles.arrowButton}>
    //       <ArrowRight size={24} color="black" />
    //     </Pressable>
    //   </View>

    //   {/* Members + tasks */}
    //   <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
    //     {household?.members.map((member) => {
    //       // tasks for this week for this member
    //       const weekTasks = tasksByOffset[currentWeek] ?? [];
    //       const memberTasks = weekTasks.filter(
    //         (t) => t.assigneeInitials === member.initials
    //       );

    //       return (
    //         <View key={member.id} style={styles.memberRow}>
    //           {/* Member circle */}
    //           <View style={styles.memberCircle}>
    //             <Text style={styles.memberText}>{member.initials}</Text>
    //           </View>

    //           {/* Task grid for this member and week */}
    //           <View style={styles.taskRow}>
    //             {memberTasks.length === 0 ? (
    //               <View style={styles.noTaskBox}>
    //                 <Text style={styles.noTaskText}>—</Text>
    //               </View>
    //             ) : (
    //               memberTasks.map((task) => (
    //                 <Pressable
    //                   key={task.id}
    //                   onPress={() => handleTaskPress(task)}
    //                   style={({ pressed }) => [
    //                     styles.taskBox,
    //                     task.status === "completed"
    //                       ? { backgroundColor: pressed ? "#86efac" : "#bbf7d0" } // green-300 : green-200
    //                       : { backgroundColor: pressed ? "#93c5fd" : "#dbeafe" }, // blue-300 : blue-100
    //                   ]}
    //                 >
    //                   <Text style={styles.taskText}>{task.name}</Text>
    //                 </Pressable>
    //               ))
    //             )}
    //           </View>
    //         </View>
    //       );
    //     })}
    //   </ScrollView>
    // </View>
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Household: {household?.name}
      </Text>
      <Text>ID: {household?.id}</Text>
      <Text>Members: {household?.members?.join(", ")}</Text>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        UserTasks
      </Text>
      {userTasks.map((ut) => (
        <View key={ut.userId} style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: "bold" }}>User: {ut.userId}</Text>
          {ut.tasks.length === 0 ? (
            <Text>No tasks</Text>
          ) : (
            ut.tasks.map((task) => (
            <Text>
              • {task.name} –{" "}
              {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
            </Text>
            ))
          )}
        </View>
      ))}
    </View>
  );
}