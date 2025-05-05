import styled from "styled-components";
import { Link } from "react-router-dom";

export const PageContainer = styled.div`
  text-align: center;
  margin-top: 50px;
  font-family: Arial, sans-serif;
`;

export const FormContainer = styled.form`
  display: inline-block;
  text-align: left;
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

export const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

export const FormField = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #007bff;
    }
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

export const SuccessMessage = styled.p`
  color: green;
  font-size: 14px;
  margin-top: 10px;
`;

export const LinkText = styled.p`
  margin-top: 15px;
  font-size: 14px;

  a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;