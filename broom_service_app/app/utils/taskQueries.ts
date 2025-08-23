export interface TaskType {
  id: string;
  name: string;
  assigned_to: string;
  due_date: string;
  description: string;
  date_created: string;
  date_completed?: string | null;
  status?: 'pending' | 'in-progress' | 'completed';
}

export const fetchUserTasks = async (userId: string): Promise<TaskType[]> => {
  try {
    // Replace this URL with your actual Lambda function URL
    const response = await fetch(`YOUR_LAMBDA_FUNCTION_URL?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers like API keys
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    // Transform the response to match our TaskType if needed
    return data.tasks?.map((task: any) => ({
      id: task.id || task.taskId,
      name: task.name || task.title,
      assigned_to: task.assigned_to || task.assignedTo || '',
      due_date: task.due_date || task.dueDate || '',
      description: task.description || '',
      date_created: task.date_created || task.createdAt || new Date().toISOString(),
      date_completed: task.date_completed || task.completedAt || null,
      status: task.status || (task.date_completed ? 'completed' : 'pending')
    })) || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId: string, status: TaskType['status']): Promise<void> => {
  try {
    const response = await fetch('YOUR_LAMBDA_FUNCTION_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
        status,
        // Include the completion date if marking as completed
        ...(status === 'completed' && { date_completed: new Date().toISOString() })
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};
