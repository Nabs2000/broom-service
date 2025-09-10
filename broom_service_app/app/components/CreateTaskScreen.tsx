import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { CREATE_TASK_URL } from '../config.json';

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
});

const CreateTaskScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    

    const handleSubmit = async () => {
        try {
            console.log('Creating task...');
            console.log('Name:', name);
            console.log('Description:', description);
            console.log('Due Date:', dueDate);
            console.log('Assigned To:', assignedTo);
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
            console.log('Response data:', data);

            if (data.message === 'Task created successfully') {
                console.log('Task created successfully');
                // Reset form and close modal on success
                setName('');
                setDescription('');
                setDueDate('');
                setAssignedTo('');
                setModalVisible(false);
            } else {
                console.error('Error creating task:', data.error);
            }
        } catch (error) {
            console.error('Error creating task:', error);
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
                                
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Due Date (YYYY-MM-DD)"
                                    value={dueDate}
                                    onChangeText={setDueDate}
                                    keyboardType="numbers-and-punctuation"
                                />
                                
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Assigned To (User ID)"
                                    value={assignedTo}
                                    onChangeText={setAssignedTo}
                                    keyboardType="number-pad"
                                />
                                
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
