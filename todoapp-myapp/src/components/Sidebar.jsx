// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Sidebar = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status

  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        {isAuthenticated && ( // Only show these links if authenticated
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/todo">Todo</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
