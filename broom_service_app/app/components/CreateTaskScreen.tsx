import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from "react-native";
import { CREATE_TASK_URL } from '../config.json';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { assignedToUser, UserType } from "../utils/userQueries";
import { Picker } from "@react-native-picker/picker";

interface CreateTaskScreenProps {
  familyId: string;
  onTaskCreated?: () => void; 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButtonText: {
    marginLeft: 10,
    color: '#333',
  },
  calendarModal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
});

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ familyId }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
    const loadUsers = async () => {
        try {
        console.log("Family ID:", familyId);
        const data = await assignedToUser(familyId);
        setUsers(data || []);  // ensure fallback to empty array
        } catch (err) {
        console.error("Failed to load users", err);
        setUsers([]); // prevent undefined
        } finally {
        setLoading(false);
        }
    };

    loadUsers();
    }, [familyId]);

    if (loading) {
    return <div>Loading users...</div>; // or your loader component
    }
    

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${CREATE_TASK_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    dueDate,
                    assignedTo,
                }),
            });

            const data = await response.json();
            if (data.message === 'Task created successfully') {
                // Reset form and close modal on success
                setName('');
                setDescription('');
                setDueDate('');
                setAssignedTo('');
                setModalVisible(false);
            } else {
                // Error creating task
            }
        } catch (error) {
            // Error creating task
        }
    };

    const handleCancel = () => {
        // Reset form and close modal
        setName('');
        setDescription('');
        setDueDate('');
        setAssignedTo('');
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity 
                style={styles.createButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.createButtonText}>Create New Task</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <Text style={styles.title}>Create New Task</Text>
                                
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Task Name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                                
                                <TextInput 
                                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                    placeholder="Description"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                />

                                <Text style={{marginBottom: 8, fontWeight: '500'}}>Due Date:</Text>
                                <TouchableOpacity 
                                    style={styles.dateButton}
                                    onPress={() => setCalendarVisible(true)}
                                >
                                    <MaterialIcons name="event" size={24} color="#666" />
                                    <Text style={styles.dateButtonText}>
                                        {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select a date'}
                                    </Text>
                                </TouchableOpacity>

                                <Modal
                                    visible={calendarVisible}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={() => setCalendarVisible(false)}
                                >
                                    <View style={styles.calendarModal}>
                                        <View style={styles.calendarContainer}>
                                            <Calendar
                                                onDayPress={(day) => {
                                                    setDueDate(day.dateString);
                                                    setCalendarVisible(false);
                                                }}
                                                markedDates={{
                                                    [dueDate]: {selected: true, selectedColor: '#4CAF50'}
                                                }}
                                                theme={{
                                                    todayTextColor: '#4CAF50',
                                                    arrowColor: '#4CAF50',
                                                }}
                                            />
                                        </View>
                                    </View>
                                </Modal>
                                
                                <Text>Assign To</Text>
                                {loading ? (
                                    <ActivityIndicator size="small" color="blue" />
                                ) : (
                                    <Picker
                                    selectedValue={assignedTo}
                                    onValueChange={(itemValue) => setAssignedTo(itemValue)}
                                    >
                                    {users.map((user) => (
                                        <Picker.Item key={user.id} label={user.name} value={user.id} />
                                    ))}
                                    </Picker>
                                )}
                                
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity 
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={handleCancel}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={[styles.button, styles.submitButton]}
                                        onPress={handleSubmit}
                                    >
                                        <Text style={styles.buttonText}>Create Task</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default CreateTaskScreen;
