import { UPDATE_TASK_URL, FETCH_TASKS_URL, DELETE_TASKS_URL } from '../config.json';

// Define the TaskType interface that represents the structure of a task
// This interface is used throughout the application to ensure type safety
export interface TaskType {
  id: string;                  // Unique identifier for the task
  name: string;                // Task name/title
  assigned_to: string;         // User ID of the person assigned to the task
  due_date: string;            // ISO date string of when the task is due
  description: string;         // Detailed description of the task
  date_created: string;        // ISO date string of when the task was created
  date_completed?: string | null; // Optional ISO date string of when the task was completed
  status?: 'pending' | 'in-progress' | 'completed'; // Current status of the task
}

/**
 * Fetches all tasks for a specific user from the backend API
 * @param userId - The ID of the user whose tasks to fetch
 * @returns A promise that resolves to an array of TaskType objects
 * @throws Will throw an error if the fetch request fails
 */
/**
 * Updates a task's status and completion date
 * @param taskId - The ID of the task to update
 * @param isCompleted - Whether the task is being marked as completed
 * @returns A promise that resolves to the updated task
 * @throws Will throw an error if the update request fails
 */
export const updateTask = async (taskId: string, isCompleted: boolean): Promise<TaskType> => {
  try {
    const response = await fetch(
      `${UPDATE_TASK_URL}?taskId=${encodeURIComponent(taskId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: isCompleted ? 'completed' : 'pending',
          date_completed: isCompleted ? new Date().toISOString() : null
        }),
      }
    );

    console.log('Response:', response);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error: ${response.status} - ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const fetchUserTasks = async (userId: string): Promise<TaskType[]> => {
  try {
    // Make a GET request to the Lambda function endpoint
    const response = await fetch(
      `${FETCH_TASKS_URL}?assigned_to=${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers here
          // Example: 'Authorization': `Bearer ${token}`
        },
      }
    );

    // If the response is not OK (status code not in 200-299 range), throw an error
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    return Array.isArray(data) 
    ? data.map(task => ({
        ...task,
        date_created: task.date_created || new Date().toISOString(),
        date_completed: task.date_completed || null,
        status: task.status || (task.date_completed ? 'completed' : 'pending')
      }))
    : [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${DELETE_TASKS_URL}/${taskId}}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error deleting ${response.status} - ${error}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting task', error);
    return false;
  }
};