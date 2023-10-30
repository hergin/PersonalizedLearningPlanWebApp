import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router,Routes, Route} from "react-router-dom";
import LearningPlan from "./screens/LearningPlan";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route index element={<LearningPlan />} />
      </Routes>
  </Router>
  );
}

export default App;
