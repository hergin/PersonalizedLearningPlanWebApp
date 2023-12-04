import React, { useEffect } from "react";
import ModuleComponent from "../../components/ModuleComponent/";
import { useAuth } from "../../context/AuthContext";
import { ModuleProvider } from "../../context/ModuleContext";

function LearningPlan() {
  const { setUser } = useAuth();

  useEffect(() => {
    console.log(`Default screen: ${localStorage.getItem("user")}`);
    setUser(JSON.parse(localStorage.getItem("user")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModuleProvider>
      <div style={{ padding: "2%", height: "100vh" }}>
        <ModuleComponent />
      </div>
    </ModuleProvider>
  );
}

export default LearningPlan;
