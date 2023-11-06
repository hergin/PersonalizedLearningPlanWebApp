import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LearningPlan from "./screens/LearningPlan";
import Login from "./screens/Login";
import DefaultScreen from "./screens/Default";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DefaultScreen />}>
          <Route path="/Learning-Plan" element={<LearningPlan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
