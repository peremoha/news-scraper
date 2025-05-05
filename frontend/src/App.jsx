import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login_Register/Login";
import Register from "./components/Login_Register/Register";
import NewsList from "./components/NewsList/NewsList";
import { isAuthenticated } from "./utils/auth";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <NewsList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;