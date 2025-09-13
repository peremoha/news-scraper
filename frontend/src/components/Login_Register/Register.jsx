import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

import {
  PageContainer,
  FormContainer,
  FormTitle,
  FormField,
  ErrorMessage,
  SuccessMessage,
  LinkText,
} from "./Login_Register_Styled";

import Button from '../../shared-components/Button/Button'

const Register = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

    useEffect(() => {
      if (isAuthenticated()) {
        navigate("/"); 
      }
    }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");  

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); 
      } else {
        const data = await response.json();
        setError(data.msg || "Error occurred during registration.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <PageContainer >
      <FormTitle>Register</FormTitle>
      <FormContainer ontainer rm onSubmit={handleRegister} >
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
        <Button variant="primary" type="submit" >Register</Button>
      </FormContainer >
      {error && <ErrorMessage >{error}</ErrorMessage>}
      {success && <SuccessMessage >{success}</SuccessMessage>}
      <LinkText>
        Already have an account? <Link to="/login">Login here</Link>
      </LinkText>
    </PageContainer>
  );
};

export default Register;