import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LearningPlan from "./screens/LearningPlan";
import LoginScreen from "./screens/Login";
import Register from "./screens/Register";
import DefaultScreen from "./screens/DefaultContainer";
import Goals from "./screens/Goals";
import Profile from "./screens/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DefaultScreen />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/LearningPlan" element={<LearningPlan />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/goals/:id" element={<Goals />} />
            </Route>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
