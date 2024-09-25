// App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Todo from './components/Todo';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext'; // Import useAuth
import './App.css';

function App() {
  const { isAuthenticated } = useAuth(); // Get authentication status

  return (
    <div className="app">
      <Sidebar /> {/* Sidebar is rendered here */}
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/todo" 
            element={
              <ProtectedRoute>
                <Todo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
