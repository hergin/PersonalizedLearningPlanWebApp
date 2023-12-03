import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LearningPlan from "./screens/LearningPlan";
import LoginScreen from "./screens/login/login";
import Register from "./screens/register/Register";
import DefaultScreen from "./screens/Default";
import Goals from "./screens/Goals/Goal";
import Profile from "./screens/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<DefaultScreen />}>
            <Route element={<ProtectedRoute />}>
              <Route exact path="/LearningPlan" element={<LearningPlan />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/goal/:id" element={<Goals />} />
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
