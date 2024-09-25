import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setErrorMessage(''); // Reset error message

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Signup failed'); // Provide more specific error messages
      setSuccessMessage('');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
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
          {loading ? 'Signing up...' : 'Sign Up'} {/* Change button text while loading */}
        </button>
      </form>
      <p>
        Already Registered? <button onClick={() => navigate('/login')}>Login</button>
      </p>
    </div>
  );
};

export default Signup;
