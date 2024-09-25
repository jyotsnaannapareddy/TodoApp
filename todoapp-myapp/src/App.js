import React, { useState } from "react";
import jwtDecode from "jwt-decode";  // Import for decoding JWT tokens
import Login from "./Login";         // Import the Login component
import Signup from "./Signup";       // Import the Signup component
import Todo from "./Todo";           // Import the Todo component
import './App.css';                  // Keep your existing CSS import
import logo from './logo.svg';        // Keep the logo for the header

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const user = token ? jwtDecode(token) : null;

  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Todo Application</h1>
        {token ? (
          <div>
            <h2>Welcome, {user ? user.name : 'User'}</h2>
            <Todo token={token} />
          </div>
        ) : (
          <div>
            <Login setToken={handleSetToken} />
            <Signup setToken={handleSetToken} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
