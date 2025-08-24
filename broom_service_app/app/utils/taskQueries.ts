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
export const fetchUserTasks = async (userId: string): Promise<TaskType[]> => {
  try {
    // Make a GET request to the Lambda function endpoint
    // Replace 'YOUR_LAMBDA_FUNCTION_URL' with your actual Lambda function URL
    const response = await fetch(
      `https://tn6u6vcovr73c3fazqspipgaji0dcsdp.lambda-url.us-west-2.on.aws/?assigned_to=${encodeURIComponent(userId)}`,
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
    
    // Transform the response data to match our TaskType interface
    // This handles different possible field names from the API
    return Object.keys(data).map((key: string) => ({
      ...data[key],
      id: key,
      date_created: data[key].date_created || new Date().toISOString(),
      date_completed: data[key].date_completed || null,
      status: data[key].status || (data[key].date_completed ? 'completed' : 'pending')
    })) || [];  // Return empty array if no tasks are found
  } catch (error) {
    // Log the error and re-throw it for the calling component to handle
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Updates the status of a specific task
 * @param taskId - The ID of the task to update
 * @param status - The new status for the task
 * @returns A promise that resolves when the update is complete
 * @throws Will throw an error if the update request fails
 */
export const updateTaskStatus = async (
  taskId: string, 
  status: TaskType['status']
): Promise<void> => {
  try {
    // Make a POST request to update the task status
    // Replace 'YOUR_LAMBDA_FUNCTION_URL' with your actual Lambda function URL
    const response = await fetch('https://tn6u6vcovr73c3fazqspipgaji0dcsdp.lambda-url.us-west-2.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers here
        // Example: 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        taskId,  // The ID of the task to update
        status,  // The new status
        // If marking as completed, include the current timestamp
        ...(status === 'completed' && { 
          date_completed: new Date().toISOString() 
        })
      }),
    });

    // If the response is not OK, throw an error with the status code
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    // Log the error and re-throw it for the calling component to handle
    console.error('Error updating task status:', error);
    throw error;
  }
};
