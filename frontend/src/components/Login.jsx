import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Додали Link для переходу

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const roleResponse = await fetch("http://127.0.0.1:5000/get-role", {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
        
        const roleData = await roleResponse.json();

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", roleData.role); 

        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "5px 10px" }}>Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;