import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Todo = () => {
  const { token } = useAuth(); // Get token directly from context
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('pending'); // Default status
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [editingTaskTitle, setEditingTaskTitle] = useState(''); // Store the new title for the task being edited
  const [editingTaskStatus, setEditingTaskStatus] = useState(''); // Store the new status for the task being edited

  // Fetch tasks when the component mounts
  useEffect(() => {
    console.log('Token:', token); // Log the token to the console
    const fetchTasks = async () => {
      if (!token) return; // Guard clause: If token is not available, skip fetching tasks
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data); // Assuming the backend returns an array of tasks
      } catch (err) {
        console.error(err.response?.data?.msg || 'Error fetching tasks');
      }
    };

    fetchTasks();
  }, [token]);

  // Handle adding a new task
  const handleAddTask = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { title: newTaskTitle, status: newTaskStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, { id: res.data.taskId, title: newTaskTitle, status: newTaskStatus }]);
      setNewTaskTitle('');
      setNewTaskStatus('pending'); // Reset status to default
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error adding task');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error deleting task');
    }
  };

  // Handle opening the edit form for a task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
    setEditingTaskStatus(task.status); // Set the current status for the task being edited
  };

  // Handle saving changes to the edited task (updating both title and status)
  const handleSaveTask = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${editingTaskId}`,
        { title: editingTaskTitle, status: editingTaskStatus }, // Sending both title and status
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, title: editingTaskTitle, status: editingTaskStatus } : task
        )
      );
      setEditingTaskId(null); // Exit edit mode
      setEditingTaskTitle('');
      setEditingTaskStatus('');
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error saving task');
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              // Show the edit form if the task is being edited
              <div>
                <input
                  type="text"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  placeholder="Edit task title"
                />
                <select
                  value={editingTaskStatus}
                  onChange={(e) => setEditingTaskStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="in progress">In Progress</option>
                </select>
                <button onClick={handleSaveTask}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {task.title} - {task.status}{" "}
                <button onClick={() => handleEditTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="New Task"
      />
      <select
        value={newTaskStatus}
        onChange={(e) => setNewTaskStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="in progress">In Progress</option>
      </select>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default Todo;
