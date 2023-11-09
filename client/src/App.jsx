import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import LearningPlan from "./screens/LearningPlan";
import LoginScreen from "./screens/login/Login";
import DefaultScreen from "./screens/Default";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<DefaultScreen />}>
          <Route path="/LearningPlan" element={<LearningPlan />} />
          <Route path="/login" element={<LoginScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
