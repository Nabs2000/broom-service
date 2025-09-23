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
        const userData = {
            id: user.id,
            name: user.name,
            family_id: user.family_id,
            email: user.email,
            is_admin: user.is_admin
        };

        const response = await fetch(CREATE_USER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const responseText = await response.text();
        let responseData;
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
        }
        
        if (!response.ok) {
            throw new Error(responseData.message || `Failed to create user: ${response.status} ${response.statusText}`);
        }

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
        return data; 
    } catch (error) {
        throw error;
    }
};