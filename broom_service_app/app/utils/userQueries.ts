import { ASSIGN_TO_URL } from "../config.json";

export interface UserType {
    id: string;
    name: string;
    family_id: string;
    email?: string;
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
        console.log("API raw response:", data); // <-- Check the structure
        return data; // <-- Adjust based on actual response
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};