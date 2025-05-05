import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Додали Link для переходу

import {
  PageContainer,
  FormContainer,
  FormTitle,
  FormField,
  ErrorMessage,
  LinkText,
} from "./Login_Register_Styled";

import Button from '../../shared-components/Button/Button'

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
        localStorage.setItem("username", username);

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
    <PageContainer >
      <FormTitle>Login</FormTitle>
      <FormContainer onSubmit={handleLogin} >
        <FormField >
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormField>
        <FormField >
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>
        <Button type="submit">Login</Button>
      </FormContainer>
      {error && <ErrorMessage >{error}</ErrorMessage>}
      <LinkText>
        Don't have an account? <Link to="/register">Register here</Link>
      </LinkText>
    </PageContainer>
  );
};

export default Login;