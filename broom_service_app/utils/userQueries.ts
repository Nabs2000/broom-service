import { ASSIGN_TO_URL, CREATE_USER_URL } from "../lib/config.json";


export interface UserType {
    id: string;
    name: string;
    family_id: string;
    email?: string;
    is_admin?: boolean;
}

export const createUser = async (user: UserType) => {
    try {
        console.log('Creating user with data:', user);
        
        // Ensure required fields are present
        const userData = {
            id: user.id,
            name: user.name,
            family_id: user.family_id || 'default-family-id',
            email: user.email || '',
            is_admin: user.is_admin || false
        };

        console.log('Sending to', CREATE_USER_URL);
        const response = await fetch(CREATE_USER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        console.log('Response status:', response.status);
        
        // Get response as text first to handle potential non-JSON responses
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        let responseData;
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            console.error('Response headers:', Object.fromEntries(response.headers.entries()));
            throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
        }
        
        if (!response.ok) {
            console.error('Error response:', responseData);
            throw new Error(responseData.message || `Failed to create user: ${response.status} ${response.statusText}`);
        }

        console.log('User created successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
}

export const assignedToUser = async (familyId: string): Promise<UserType[]> => {
    try {
        const response = await fetch(`${ASSIGN_TO_URL}?family_id=${encodeURIComponent(familyId)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("API raw response:", data); 
        return data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};