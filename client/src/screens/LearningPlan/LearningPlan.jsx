import React, { useEffect } from "react";
import ModuleComponent from "../../components/ModuleComponent/";
import { useAuth } from "../../context/AuthContext";

function LearningPlan() {
  const { setUser } = useAuth();

  useEffect(() => {
    console.log(`Default screen: ${localStorage.getItem("user")}`);
    setUser(JSON.parse(localStorage.getItem("user")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "2%", height: "100vh" }}>
      <ModuleComponent />
    </div>
  );
}

export default LearningPlan;
