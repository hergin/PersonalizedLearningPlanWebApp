import React, { useEffect } from "react";
import ModuleComponent from "../../components/ModuleComponent/";
import { useAuth } from "../../context/AuthContext";

function LearningPlan() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    console.log(`Default screen: ${localStorage.getItem("user")}`);
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <div style={{ padding: "2%", height: "100vh" }}>
      <ModuleComponent />
    </div>
  );
}

export default LearningPlan;
