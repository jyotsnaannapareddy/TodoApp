import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Access the login method and isAuthenticated

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todo'); // Redirect if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = response.data;
      login(token); // Call the login method from context
      navigate('/todo');
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      // Set specific error messages based on error response
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid email or password');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'} {/* Change button text while loading */}
        </button>
      </form>
      <p>
        Not Registered? <button onClick={() => navigate('/signup')}>Sign Up</button>
      </p>
    </div>
  );
};

export default Login;
