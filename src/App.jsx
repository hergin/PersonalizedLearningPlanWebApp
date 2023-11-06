import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LearningPlan from "./screens/LearningPlan";
import Login from "./screens/login";
import DefaultScreen from "./screens/Default";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultScreen />}>
          <Route path="/LearningPlan" element={<LearningPlan />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
