import React, { useState } from "react";
import jwtDecode from "jwt-decode";  // Import for decoding JWT tokens
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Login from "./components/Login";
import Signup from "./components/Signup";
import Todo from "./components/Todo";
import './App.css';                  // Keep your existing CSS import

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(true);  // State to toggle between login and signup
  const user = token ? jwtDecode(token) : null;
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate('/'); // Redirect to the Todo page after setting the token
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo Application</h1>

        {token ? (
          <div>
            <h2>Welcome, {user ? user.name : 'User'}</h2>
            <Todo token={token} />
          </div>
        ) : (
          <div>
            {isLogin ? (
              <div>
                <Login setToken={handleSetToken} />
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setIsLogin(false)}>
                    Sign up here
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <Signup setToken={handleSetToken} />
                <p>
                  Already have an account?{" "}
                  <button onClick={() => setIsLogin(true)}>
                    Login here
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
