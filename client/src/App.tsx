import React from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LearningPlan from "./features/modules/components/LearningPlan";
import LoginScreen from "./features/login/components/Login";
import Register from "./features/login/components/Register";
import DefaultScreen from "./components/DefaultContainer";
import ProfileScreen from "./features/profile/components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { MuiThemeProvider } from "./context/MuiThemeContext";
import GoalParentContainer from "./features/Goal/components/GoalMain";
import CoachingPage from "./features/coaching/components/CoachingPage";
import ChatScreen from "./features/messaging/components/ChatScreen";
import AdminPage from "./features/admin-panel/components/AdminPage";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MuiThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<DefaultScreen />}>
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                  <Route path="/" element={<LearningPlan />} />
                  <Route path="/LearningPlan" element={<LearningPlan />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/goals/:id" element={<GoalParentContainer />} />
                  <Route path="/coaching" element={<CoachingPage />} />
                  <Route path="/chat/:id" element={<ChatScreen />} />
                </Route>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<Register />} />
              </Route>
            </Routes>
          </Router>
        </MuiThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
