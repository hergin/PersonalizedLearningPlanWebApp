import React, { useEffect } from "react";
import ModuleComponent from "../components/ModuleComponent";
import { useAuth } from "../context/AuthContext";
import { ModuleProvider } from "../context/ModuleContext";
import { emptyUser } from "../types";
import "./LearningPlan.css";

function LearningPlan() {
  const { setUser } = useAuth();

  useEffect(() => {
    console.log(`Default screen: ${localStorage.getItem("user")}`);
    const currentUser : string | null = localStorage.getItem("user");
    setUser(currentUser ? JSON.parse(currentUser) : emptyUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <ModuleProvider>
      <div className="p-[2%] h-screen">
        <ModuleComponent />
      </div>
    </ModuleProvider>
  );
}

export default LearningPlan;
