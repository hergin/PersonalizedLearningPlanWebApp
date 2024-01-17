import React, { useEffect } from "react";
import ModuleComponent from "../../components/ModuleComponent/ModuleComponent";
import { useAuth } from "../../context/AuthContext";
import { ModuleProvider } from "../../context/ModuleContext";
import { emptyUser } from "../../types";
import "./LearningPlan.css";

function LearningPlan() {
  const { setUser } = useAuth();

  useEffect(() => {
    console.log(`Default screen: ${localStorage.getItem("user")}`);
    const currentUser : string | null = localStorage.getItem("user");
    setUser(currentUser ? JSON.parse(currentUser) : emptyUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: My lint tool doesn't like that we're going an inline style here because all styling should be moved to an external file. 
  // Yet, when I move it to the css file, it doesn't work. Please fix this when you get the chance since I'm not sure what's going on here.
  // - Tim
  return (
    <ModuleProvider>
      <div style={{padding: "2%", height: "100vh"}}>
        <ModuleComponent />
      </div>
    </ModuleProvider>
  );
}

export default LearningPlan;
