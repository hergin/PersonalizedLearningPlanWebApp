import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LearningPlan from "./screens/LearningPlan/LearningPlan";
import LoginScreen from "./screens/login/login";
import Register from "./screens/register/Register";
import DefaultScreen from "./screens/Default/DefaultContainer";
import Goals from "./screens/Goals/Goals";
import Profile from "./screens/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
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
