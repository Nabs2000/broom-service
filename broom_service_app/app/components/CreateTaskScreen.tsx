import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { LAMBDA_URL } from '../config2';

const CreateTaskScreen = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${LAMBDA_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    dueDate,
                }),
            });

            const data = await response.json();

            if (data.message === 'Task created successfully') {
                console.log('Task created successfully');
            } else {
                console.error('Error creating task:', data.error);
            }
        } catch (error) {
            console.error('Error creating task:', error)
        }
    };

    return (
        <View>
            <Text>Create Task</Text>
            <TextInput 
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <TextInput 
                placeholder="Description"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />
            <TextInput 
                placeholder="Due Date"
                value={dueDate}
                onChangeText={(text) => setDueDate(text)}
            />
            <Button title="Create Task" onPress={handleSubmit} />
        </View>
    );
};

export default CreateTaskScreen;
