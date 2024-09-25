import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/todos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err.response.data.msg);
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3000/todos',
        { task: newTask, status: 'pending' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, { id: res.data.id, task: newTask, status: 'pending' }]);
      setNewTask('');
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.task} - {task.status}{" "}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default Todo;
