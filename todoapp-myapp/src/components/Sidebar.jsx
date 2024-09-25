// Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './sidebar.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth(); // Get authentication status and logout function
  const navigate = useNavigate(); // Use navigate for redirection after logout

  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate('/login'); // Redirect to the login page after logout
  };

  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        {isAuthenticated ? ( // Use ternary for clearer rendering logic
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/todo">Todo</Link>
            </li>
            <li onClick={handleLogout} style={{ cursor: 'pointer' }}> {/* Handle Logout Click */}
              Logout
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
