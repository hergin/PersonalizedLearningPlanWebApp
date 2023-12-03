import React, { useEffect, useState } from "react";
import "./GoalHeader.css";
import { Box, CircularProgress, Typography } from "@mui/material";

import GoalStepper from "../GoalStepper/GoalStepper";
import { ApiClient } from "../../hooks/ApiClient";

const GoalHeader = ({ moduleID }) => {
  const [steps, setSteps] = useState([]);
  console.log(steps.map((step) => step.name));
  const [goalProgress, setGoalProgress] = useState(0);
  const addGoalProgress = () => {
    if (goalProgress < 100) setGoalProgress(goalProgress + 100 / steps.length);
  };
  const restGoalProgress = () => {
    if (goalProgress > 0) setGoalProgress(goalProgress - 100 / steps.length);
  };
  const { get } = ApiClient();

  useEffect(() => {
    async function getGoals() {
      try {
        const result = await get(`/goal/get/${moduleID}`);
        let newGoals = [];
        for (let goal of result) {
          newGoals.push(goal);
        }
        setSteps(newGoals);
      } catch (error) {
        console.error(error);
        alert(error.message ? error.message : error);
      }
    }

    getGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addGoal = (goal) => {
    if (steps.includes(goal)) {
      return;
    }
    let newGoal = [].concat(steps);
    newGoal.push(goal);
    setSteps(newGoal);
  };

  return (
    <div className="header-component-body">
      <div className="header-component">
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress
            variant={"determinate"}
            value={100}
            size={200}
            style={{
              color: "white",
              outlineColor: "black",
              position: "absolute",
            }}
          />
          <CircularProgress
            variant={"determinate"}
            value={goalProgress}
            size={200}
            style={{ color: "#6FC3FF", outlineColor: "black" }}
          />
          <Typography
            position="absolute"
            sx={{ fontSize: "2rem", fontFamily: "var(--bodyFont)" }}
          >
            {Math.floor(goalProgress)}%
          </Typography>
        </Box>

        <div className="header-component-buttons">
          <GoalStepper
            addGoalProgress={addGoalProgress}
            restGoalProgress={restGoalProgress}
            steps={steps}
            setSteps={setSteps}
            addGoal={addGoal}
          />
        </div>
      </div>
    </div>
  );
};

export default GoalHeader;
