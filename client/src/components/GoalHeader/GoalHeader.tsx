import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import GoalStepper from "../GoalStepper/GoalStepper";
import { ApiClient } from "../../hooks/ApiClient";
import { Goal } from "../../custom_typing/types";

interface GoalHeaderParams {
  moduleID: number
}

const GoalHeader = ({moduleID}: GoalHeaderParams) => {
  const [steps, setSteps] = useState<Goal[]>([]);
  console.log(steps.map((step : Goal) => step.name));
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
        const result = await get(`/goal/get/module/${moduleID}`);
        let newGoals : Goal[] = [];
        for (let goal of result) {
          newGoals.push(goal);
        }
        setSteps(newGoals);
      } catch (error : any) {
        console.error(error);
        alert(error.response ? error.response.data : error);
      }
    }

    getGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addGoal = (goal : Goal) => {
    if (steps.includes(goal)) {
      return;
    }
    let newGoals : Goal[] = ([] as Goal[]).concat(steps);
    newGoals.push(goal);
    setSteps(newGoals);
  };
  
  function editGoal(updatedGoal : Goal) {
    const newGoal = steps.map((goal) => {
      if (goal.id === updatedGoal.id) {
        return {
          ...goal,
          name: updatedGoal.name,
          description: updatedGoal.description,
        };
      }
      return goal;
    });
    setSteps(newGoal);
  }

  const deleteGoal = (id : number) => {
    const newGoals = steps.filter((goal) => goal.id !== id);
    setSteps(newGoals);
  };

  return (
    <div className="relative flex h-screen">
      <div className="flex w-full relative items-center bg-element-base text-text-color h-[300px] pl-[3%]">
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

        <div className="flex overflow-hidden bg-white flex-col absolute h-auto w-3/5 rounded min-h-[80vh] top-1/2 left-[20%] gap-5 p-[3%] shadow-md">
          <GoalStepper
            addGoalProgress={addGoalProgress}
            restGoalProgress={restGoalProgress}
            moduleID={moduleID}
            steps={steps}
            addGoal={addGoal}
            deleteGoal={deleteGoal}
            editGoal={editGoal}
          />
        </div>
      </div>s
    </div>
  );
};

export default GoalHeader;
