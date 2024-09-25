import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css'; // Optional CSS for styling
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed

const Profile = () => {
  const { token } = useAuth(); // Use the useAuth hook to access the token
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Token:', token); // Log the token to the console
      if (!token) return; // If there's no token, do not fetch the profile
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err.response?.data || 'Error fetching profile');
      }
    };
    fetchProfile();
  }, [token]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/user/profile',
        { name: newName || profile.name, email: newEmail || profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile({ name: newName || profile.name, email: newEmail || profile.email });
      setIsEditing(false);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error(err.response?.data || 'Error updating profile');
      setMessage('Error updating profile');
    }
  };

  // Handle change password click (You can redirect to a change password page or trigger a modal)
  const handleChangePassword = () => {
    console.log('Change Password Clicked');
    // Implement change password logic here (or redirect to change password page)
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {message && <p className="message">{message}</p>}

      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      ) : (
        <div>
          <label>
            Name:
            <input
              type="text"
              value={newName || profile.name}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              value={newEmail || profile.email}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
          </label>
          <br />
          <button onClick={handleUpdateProfile}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
